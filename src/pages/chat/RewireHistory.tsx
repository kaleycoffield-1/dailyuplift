import { useNavigate } from "react-router-dom";
import { Menu, User, Plus } from "lucide-react";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { BottomNav } from "@/components/home/BottomNav";
import { ConversationListItem } from "@/components/chat/ConversationListItem";

// Mock data for Phase 1 - empty by default for first-time users
const mockConversations: Array<{
  id: string;
  title: string;
  updated_at: string;
}> = [];

export const RewireHistory = () => {
  const navigate = useNavigate();

  // If no conversations exist, redirect to new conversation view
  if (mockConversations.length === 0) {
    navigate('/chat/rewire/new', { replace: true });
    return null;
  }

  const handleConversationClick = (id: string) => {
    navigate(`/chat/rewire/${id}`);
  };

  const handleNewConversation = () => {
    navigate('/chat/rewire/new');
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

      {/* Conversation List */}
      <div className="pt-[120px] px-4">
        {mockConversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            title={conversation.title}
            onClick={() => handleConversationClick(conversation.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleNewConversation}
        className="fixed bottom-[120px] right-6 w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        style={{ boxShadow: '0px 4px 12px rgba(255, 148, 77, 0.3)' }}
      >
        <Plus className="w-7 h-7 text-brown-900" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
