import { Bookmark } from "lucide-react";

interface DailyWisdomCardProps {
  title: string;
  content: string;
  onDeeper?: () => void;
  onBookmark?: () => void;
}

export const DailyWisdomCard = ({ title, content, onDeeper, onBookmark }: DailyWisdomCardProps) => {
  return (
    <div className="bg-peach-300 rounded-[20px] p-6 relative min-h-[200px]">
      {/* Header */}
      <div className="flex items-start justify-end mb-3">
        <button 
          onClick={onBookmark}
          className="text-brown-900 hover:scale-110 transition-transform"
          aria-label="Bookmark"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <h2 className="text-xs font-normal uppercase tracking-wide text-brown-700 mb-3">
        {title}
      </h2>
      
      {/* Body */}
      <p className="text-sm text-brown-900 leading-relaxed mb-4">
        {content}
      </p>
      
      {/* Footer */}
      <button 
        onClick={onDeeper}
        className="text-sm font-semibold text-brown-900 hover:underline w-full text-center"
      >
        Go deeper
      </button>
    </div>
  );
};
