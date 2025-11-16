interface ChatTabsProps {
  activeTab: "daily" | "rewire";
  onTabChange: (tab: "daily" | "rewire") => void;
}

export const ChatTabs = ({ activeTab, onTabChange }: ChatTabsProps) => {
  return (
    <div className="px-4 py-3 bg-background">
      <div className="flex gap-8">
        <button
          onClick={() => onTabChange("daily")}
          className="relative pb-2"
        >
          <span
            className={`${
              activeTab === "daily"
                ? "font-semibold text-brown-900"
                : "font-normal text-brown-700"
            } text-lg`}
          >
            Daily Chat
          </span>
          {activeTab === "daily" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
          )}
        </button>
        
        <button
          onClick={() => onTabChange("rewire")}
          className="relative pb-2"
        >
          <span
            className={`${
              activeTab === "rewire"
                ? "font-semibold text-brown-900"
                : "font-normal text-brown-700"
            } text-lg`}
          >
            Rewire
          </span>
          {activeTab === "rewire" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
