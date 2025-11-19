import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { BottomNav } from "@/components/home/BottomNav";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendMessage: streamChat, isLoading } = useStreamingChat({ type: 'daily' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load or create conversation on mount
  useEffect(() => {
    loadOrCreateConversation();
  }, []);

  const loadOrCreateConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Try to find today's daily conversation
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'daily')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .maybeSingle();

      if (existingConv) {
        // Load existing conversation
        setConversationId(existingConv.id);
        await loadMessages(existingConv.id);
      } else {
        // Create new conversation
        const { data: newConv, error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            type: 'daily',
            title: `Daily Check-in - ${new Date().toLocaleDateString()}`
          })
          .select()
          .single();

        if (error) throw error;

        setConversationId(newConv.id);

        // Add initial message
        const initialMessage: Message = {
          id: "1",
          role: "assistant",
          content: "Good morning! What is your intention for today?",
          timestamp: new Date(),
        };
        
        await saveMessage(newConv.id, initialMessage);
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (data) {
      const loadedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));
      setMessages(loadedMessages);
    }
  };

  const saveMessage = async (convId: string, message: Message) => {
    try {
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: convId,
          role: message.role,
          content: message.content,
        });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTabChange = (tab: "daily" | "rewire") => {
    if (tab === "rewire") {
      navigate("/chat/rewire");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Save user message
    await saveMessage(conversationId, newMessage);
    
    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    let fullAiResponse = "";

    try {
      await streamChat(
        [...messages, newMessage],
        (chunk) => {
          fullAiResponse += chunk;
          // Update the AI message with streaming content
          setMessages((prev) => 
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        async () => {
          // Save complete AI response when streaming is done
          const completedAiMessage: Message = {
            id: aiMessageId,
            role: "assistant",
            content: fullAiResponse,
            timestamp: new Date(),
          };
          await saveMessage(conversationId, completedAiMessage);
          console.log('Streaming complete and saved');
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      // Remove the failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between bg-background z-50 border-b border-border/20">
        <button className="p-2 hover:scale-110 transition-transform">
          <Menu className="w-6 h-6 text-brown-900" />
        </button>
        <button className="p-2 hover:scale-110 transition-transform">
          <User className="w-6 h-6 text-brown-900" />
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-background">
        <ChatTabs activeTab="daily" onTabChange={handleTabChange} />
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-[120px] pb-[240px]">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isThinking={message.role === "assistant" && message.content === ""}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <ChatInput onSendMessage={handleSendMessage} />

      {/* Bottom Navigation */}
      <BottomNav active="chat" />
    </div>
  );
};

export default Chat;
