import * as React from "react";
import { cn } from "@/lib/utils";

interface CenterSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  max?: number;
  step?: number;
  className?: string;
}

export const CenterSlider = React.forwardRef<
  HTMLDivElement,
  CenterSliderProps
>(({ value, onValueChange, onPointerDown, max = 100, step = 1, className }, ref) => {
  const currentValue = value[0];
  const center = max / 2;
  const [isDragging, setIsDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  
  // Calculate the fill position and width from center
  const getFillStyle = () => {
    if (currentValue === center) {
      return { left: '50%', width: '0%' };
    } else if (currentValue < center) {
      const leftPercent = (currentValue / max) * 100;
      const widthPercent = ((center - currentValue) / max) * 100;
      return { left: `${leftPercent}%`, width: `${widthPercent}%` };
    } else {
      const leftPercent = 50;
      const widthPercent = ((currentValue - center) / max) * 100;
      return { left: `${leftPercent}%`, width: `${widthPercent}%` };
    }
  };

  const fillStyle = getFillStyle();
  const thumbPosition = (currentValue / max) * 100;

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round((percentage / 100) * max / step) * step;
    onValueChange([newValue]);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    onPointerDown?.(e);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalPointerMove = (e: PointerEvent) => handleMove(e.clientX);
      const handleGlobalPointerUp = () => setIsDragging(false);
      
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
      
      return () => {
        window.removeEventListener('pointermove', handleGlobalPointerMove);
        window.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
    >
      <div 
        ref={trackRef}
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-peach-400 cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div 
          className="absolute h-full bg-gradient-to-r from-gradient-start to-gradient-end transition-all"
          style={fillStyle}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 block h-6 w-6 rounded-full border-3 border-primary bg-white shadow-md transition-colors cursor-grab active:cursor-grabbing"
          style={{ left: `${thumbPosition}%` }}
        />
      </div>
    </div>
  );
});

CenterSlider.displayName = "CenterSlider";
