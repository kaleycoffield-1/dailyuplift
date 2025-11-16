import { ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FeelingsCheckCardProps {
  feeling: number;
  timestamp: string;
  onClick?: () => void;
}

export const FeelingsCheckCard = ({ feeling, timestamp, onClick }: FeelingsCheckCardProps) => {
  return (
    <div 
      className="bg-peach-300 rounded-[20px] p-5 cursor-pointer hover:scale-[1.02] transition-transform border-2 border-border"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base text-brown-900 mb-1">
            I'm feeling...
          </h3>
          <p className="text-xs text-brown-700">
            {timestamp}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-brown-900 flex-shrink-0" />
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider 
          value={[feeling]} 
          max={100} 
          step={1}
          className="w-full"
          disabled
        />
        <div className="flex justify-between text-xs text-brown-900">
          <span>Terrible</span>
          <span>Wonderful</span>
        </div>
      </div>
    </div>
  );
};
