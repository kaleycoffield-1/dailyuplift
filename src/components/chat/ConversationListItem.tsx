import { ChevronRight } from "lucide-react";

interface ConversationListItemProps {
  title: string;
  onClick: () => void;
}

export const ConversationListItem = ({ title, onClick }: ConversationListItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-xl p-5 mb-3 flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] transition-all"
    >
      <span className="text-base text-brown-900 text-left flex-1 line-clamp-2">
        {title}
      </span>
      <ChevronRight className="w-5 h-5 text-brown-900 flex-shrink-0 ml-3" />
    </button>
  );
};
