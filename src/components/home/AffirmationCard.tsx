import { Bookmark } from "lucide-react";

interface AffirmationCardProps {
  text: string;
  onBookmark?: () => void;
}

export const AffirmationCard = ({ text, onBookmark }: AffirmationCardProps) => {
  return (
    <div className="bg-peach-300 rounded-[20px] p-8 relative min-h-[300px] flex items-center justify-center border-2 border-border">
      {/* Bookmark icon */}
      <button 
        onClick={onBookmark}
        className="absolute top-6 right-6 text-brown-900 hover:scale-110 transition-transform"
        aria-label="Bookmark"
      >
        <Bookmark className="w-5 h-5" />
      </button>

      {/* Affirmation text */}
      <p className="text-xl text-brown-900 text-center leading-relaxed">
        {text}
      </p>
    </div>
  );
};
