import { Bookmark } from "lucide-react";

interface DailyWisdomCardProps {
  title: string;
  content: string;
  onDeeper?: () => void;
  onBookmark?: () => void;
}

export const DailyWisdomCard = ({ title, content, onDeeper, onBookmark }: DailyWisdomCardProps) => {
  // Strip any markdown formatting from title
  const cleanTitle = title.replace(/[*_~`#]/g, '').trim();
  
  return (
    <div className="bg-peach-300 rounded-[20px] p-6 relative min-h-[300px] border-2 border-border flex flex-col">
      {/* Header with Title and Bookmark */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-normal uppercase tracking-wide text-brown-700">
          {cleanTitle}
        </h2>
        <button 
          onClick={onBookmark}
          className="text-brown-900 hover:scale-110 transition-transform"
          aria-label="Bookmark"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
      
      {/* Body */}
      <p className="text-base text-brown-900 leading-relaxed mb-4 flex-1">
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
