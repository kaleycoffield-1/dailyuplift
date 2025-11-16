import { useState } from "react";
import { Menu, User } from "lucide-react";
import { BottomNav } from "@/components/home/BottomNav";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const Chat = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "rewire">("daily");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Good morning! What is your intention for today?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Mock AI response (will be replaced with Claude API later)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "That's a wonderful intention! What actions will you take today to make this happen?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-[104px] flex flex-col">
      {/* Header Bar */}
      <header className="h-14 px-4 flex items-center justify-between bg-background">
        <button className="p-2 hover:scale-110 transition-transform">
          <Menu className="w-6 h-6 text-brown-900" />
        </button>
        <button className="p-2 hover:scale-110 transition-transform">
          <User className="w-6 h-6 text-brown-900" />
        </button>
      </header>

      {/* Tab Navigation */}
      <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* Message Input */}
      <ChatInput onSendMessage={handleSendMessage} />

      {/* Bottom Navigation */}
      <BottomNav active="chat" />
    </div>
  );
};

export default Chat;
