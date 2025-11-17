import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatInput } from "@/components/chat/ChatInput";
import { BottomNav } from "@/components/home/BottomNav";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const RewireNew = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm glad you are here! What is on your mind right now?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Mock: Create conversation and navigate to it
    // In Phase 2, this will save to database and get real ID
    const mockConversationId = Date.now().toString();
    const conversationTitle = content.substring(0, 50) + (content.length > 50 ? "..." : "");
    
    setTimeout(() => {
      navigate(`/chat/rewire/${mockConversationId}`, {
        state: { title: conversationTitle, initialMessages: [...messages, userMessage] }
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background pb-[104px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background z-10 border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <button className="p-2">
            <Menu className="w-6 h-6 text-brown-900" />
          </button>
          <button className="p-2">
            <User className="w-6 h-6 text-brown-900" />
          </button>
        </div>
        
        <ChatTabs 
          activeTab="rewire" 
          onTabChange={(tab) => {
            if (tab === "daily") navigate("/chat");
          }}
        />
      </div>

      {/* Chat Area */}
      <div className="pt-[120px] px-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-5">
            {message.role === "assistant" ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs font-normal text-primary uppercase">UPLIFT</span>
                </div>
                <p className="text-base text-brown-900 leading-relaxed max-w-[90%]">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-brown-900 mb-2">You</span>
                <div className="bg-card rounded-2xl px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-brown-900 leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
