import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatInput } from "@/components/chat/ChatInput";
import { BottomNav } from "@/components/home/BottomNav";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const RewireNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendMessage: streamChat, isLoading } = useStreamingChat({ type: 'rewire' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm glad you are here! What is on your mind right now?",
      timestamp: new Date().toISOString(),
    },
  ]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
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
          // After first response, navigate to conversation view
          const conversationTitle = content.substring(0, 50) + (content.length > 50 ? "..." : "");
          const mockConversationId = Date.now().toString();
          
          navigate(`/chat/rewire/${mockConversationId}`, {
            state: { 
              title: conversationTitle, 
              initialMessages: messages.concat(userMessage, { 
                ...aiMessage, 
                content: messages.find(m => m.id === aiMessageId)?.content || "" 
              })
            }
          });
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
        <ChatTabs 
          activeTab="rewire" 
          onTabChange={(tab) => {
            if (tab === "daily") navigate("/chat");
          }}
        />
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-[120px] pb-[240px]">
        {messages.map((message) => (
          <div key={message.id} className="mb-5">
            {message.role === "assistant" ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6C00] to-[#FFC107]"></div>
                  <span className="text-xs font-normal text-brown-700 uppercase">UPLIFT</span>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <ChatInput onSendMessage={handleSendMessage} />

      {/* Bottom Navigation */}
      <BottomNav active="chat" />
    </div>
  );
};
