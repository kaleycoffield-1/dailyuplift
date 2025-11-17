import { ThumbsUp, Check, Bookmark } from "lucide-react";
interface RadialAppreciationCardProps {
  isCompleted?: boolean;
  onAction?: () => void;
  onBookmark?: () => void;
}
export const RadialAppreciationCard = ({
  isCompleted = false,
  onAction,
  onBookmark
}: RadialAppreciationCardProps) => {
  return <div className="bg-peach-300 rounded-[20px] p-6 relative min-h-[300px] border-2 border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-normal uppercase tracking-wide text-brown-700">
          RADIAL APPRECIATION
        </p>
        <button onClick={onBookmark} className="text-brown-900 hover:scale-110 transition-transform" aria-label="Bookmark">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <p className="text-sm text-brown-900 leading-relaxed mb-6">
        Spend a few minutes radically appreciating what's around you. It's sure to get the good vibes flowing!
      </p>

      {/* Icon */}
      

      {/* Button */}
      <div className="text-center">
        <button onClick={onAction} className="text-sm font-semibold text-brown-900 hover:underline">
          {isCompleted ? "View" : "Try it out"}
        </button>
      </div>
    </div>;
};