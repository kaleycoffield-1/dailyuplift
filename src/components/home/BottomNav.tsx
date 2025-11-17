import { useNavigate } from "react-router-dom";
import homeIcon from "@/assets/icons/vision.svg";
import chatIcon from "@/assets/icons/chat.svg";
import goalIcon from "@/assets/icons/goal.svg";
import visionIcon from "@/assets/icons/home.svg";

interface BottomNavProps {
  active?: "home" | "chat" | "goals" | "vision";
  onNavigate?: (page: string) => void;
}

export const BottomNav = ({ active = "home", onNavigate }: BottomNavProps) => {
  const navigate = useNavigate();
  
  const navItems = [
    { id: "home", label: "Home", icon: homeIcon, path: "/" },
    { id: "chat", label: "Chat", icon: chatIcon, path: "/chat" },
    { id: "goals", label: "Goals", icon: goalIcon, path: "/goals" },
    { id: "vision", label: "Vision", icon: visionIcon, path: "/vision" },
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
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="flex flex-col items-center gap-1"
            >
              {isActive ? (
                <div className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-r from-[#FF6C00] to-[#FFC107] p-[2px] shadow-[0_4px_4px_0_hsl(var(--peach-400))]">
                  <div className="w-full h-full rounded-full bg-card flex flex-col items-center justify-center gap-0.5">
                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                    <span className="text-sm text-brown-900">{item.label}</span>
                  </div>
                </div>
              ) : (
                <>
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
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
