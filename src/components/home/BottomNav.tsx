import { Home, MessageCircle, Target, Sparkles } from "lucide-react";

interface BottomNavProps {
  active?: "home" | "chat" | "goals" | "vision";
  onNavigate?: (page: string) => void;
}

export const BottomNav = ({ active = "home", onNavigate }: BottomNavProps) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "goals", label: "Goals", icon: Target },
    { id: "vision", label: "Vision", icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[104px] bg-background px-6 pt-4 pb-6 border-t border-transparent">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="flex flex-col items-center gap-1 relative"
            >
              {isActive && (
                <div className="w-[72px] h-[72px] rounded-full bg-card border-2 border-primary flex items-center justify-center absolute -top-2 shadow-[0_4px_4px_0_hsl(var(--peach-400))]">
                  <Icon className="w-6 h-6 text-brown-900" />
                </div>
              )}
              {!isActive && <Icon className="w-6 h-6 text-brown-900" />}
              <span className={`text-sm text-brown-900 ${isActive ? 'mt-[60px]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
