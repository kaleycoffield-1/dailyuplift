import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Menu, User } from "lucide-react";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatInput } from "@/components/chat/ChatInput";
import { BottomNav } from "@/components/home/BottomNav";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useToast } from "@/hooks/use-toast";

// Mock conversation data
const mockConversationData = {
  '1': {
    title: 'Rethinking my relationship to money',
    messages: [
      {
        id: "1",
        role: "assistant" as const,
        content: "Welcome back! Do you want a recap of where we left the conversation?",
        timestamp: "2025-11-18T10:30:00Z",
      },
      {
        id: "2",
        role: "user" as const,
        content: "Today I am feeling annoyed with having to pay more and more for insurance! Can we work on finding a different way to think about this?",
        timestamp: "2025-11-18T10:31:00Z",
      },
    ]
  },
  '2': {
    title: 'Reframing anger at my parents',
    messages: [
      {
        id: "1",
        role: "assistant" as const,
        content: "I'm glad you are here! What is on your mind right now?",
        timestamp: "2025-11-17T14:20:00Z",
      },
    ]
  },
  '3': {
    title: 'On my baby being fussy',
    messages: [
      {
        id: "1",
        role: "assistant" as const,
        content: "I'm glad you are here! What is on your mind right now?",
        timestamp: "2025-11-16T09:15:00Z",
      },
    ]
  }
};

export const RewireConversation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sendMessage: streamChat, isLoading } = useStreamingChat({ type: 'rewire' });

  // Get conversation data from route state or mock data
  const conversationData = location.state || mockConversationData[id as keyof typeof mockConversationData];
  
  const [messages, setMessages] = useState(
    conversationData?.initialMessages || conversationData?.messages || []
  );
  const [title, setTitle] = useState(conversationData?.title || "Conversation");

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage = {
      id: aiMessageId,
      role: "assistant" as const,
      content: "",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      await streamChat(
        messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })).concat({ ...userMessage, timestamp: new Date() }),
        (chunk) => {
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
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    }
  };

  const handleBack = () => {
    navigate('/chat/rewire');
  };

  return (
    <div className="min-h-screen bg-background pb-[104px] flex flex-col">
      {/* Header Bar */}
      <header className="h-14 px-4 flex items-center justify-between bg-background">
        <button onClick={handleBack} className="p-2 hover:scale-110 transition-transform">
          <ChevronLeft className="w-6 h-6 text-brown-900" />
        </button>
        <button className="p-2 hover:scale-110 transition-transform">
          <User className="w-6 h-6 text-brown-900" />
        </button>
      </header>

      {/* Tab Navigation */}
      <ChatTabs 
        activeTab="rewire" 
        onTabChange={(tab) => {
          if (tab === "daily") navigate("/chat");
        }}
      />
      
      {/* Conversation Title */}
      <div className="px-4 py-3 bg-background border-b border-border">
        <h2 className="text-lg font-semibold text-brown-900 truncate">
          {title}
        </h2>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[240px]">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            userName="Kaley"
          />
        ))}
        
        {isLoading && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6C00] to-[#FFC107]"></div>
              <span className="text-xs font-normal text-brown-700 uppercase">UPLIFT</span>
            </div>
            <p className="text-sm text-brown-600 italic">Thinking...</p>
          </div>
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
