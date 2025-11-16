import { Home, MessageCircle, Target, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  active?: "home" | "chat" | "goals" | "vision";
  onNavigate?: (page: string) => void;
}

export const BottomNav = ({ active = "home", onNavigate }: BottomNavProps) => {
  const navigate = useNavigate();
  
  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { id: "goals", label: "Goals", icon: Target, path: "/goals" },
    { id: "vision", label: "Vision", icon: Sparkles, path: "/vision" },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (onNavigate) {
      onNavigate(item.id);
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[104px] bg-background px-6 pt-4 pb-6 border-t border-transparent shadow-[0_-4px_8px_0_hsl(28_100%_86%_/_0.25)] flex justify-center">
      <div className="flex items-center justify-around w-full max-w-[480px] min-w-[320px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="flex flex-col items-center gap-1"
            >
              {isActive ? (
                <div className="w-[72px] h-[72px] rounded-full bg-card border-2 border-primary flex flex-col items-center justify-center shadow-[0_4px_4px_0_hsl(var(--peach-400))] gap-0.5">
                  <Icon className="w-6 h-6 text-brown-900" />
                  <span className="text-sm text-brown-900">{item.label}</span>
                </div>
              ) : (
                <>
                  <Icon className="w-6 h-6 text-brown-900" />
                  <span className="text-sm text-brown-900">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
