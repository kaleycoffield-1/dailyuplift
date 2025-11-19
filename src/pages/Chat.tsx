import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { BottomNav } from "@/components/home/BottomNav";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useToast } from "@/hooks/use-toast";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Good morning! What is your intention for today?",
      timestamp: new Date(),
    },
  ]);

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
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      await streamChat(
        [...messages, newMessage],
        (chunk) => {
          // Update the AI message with streaming content
          setMessages((prev) => 
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        () => {
          console.log('Streaming complete');
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
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isThinking={message.role === "assistant" && message.content === ""}
          />
        ))}
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
