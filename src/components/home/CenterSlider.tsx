import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
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
  React.ElementRef<typeof SliderPrimitive.Root>,
  CenterSliderProps
>(({ value, onValueChange, onPointerDown, max = 100, step = 1, className }, ref) => {
  const currentValue = value[0];
  const center = max / 2;
  
  // Calculate the fill position and width from center
  const getFillStyle = () => {
    if (currentValue === center) {
      return { left: '50%', width: '0%' };
    } else if (currentValue < center) {
      // Fill from current value to center (left side)
      const leftPercent = (currentValue / max) * 100;
      const widthPercent = ((center - currentValue) / max) * 100;
      return { left: `${leftPercent}%`, width: `${widthPercent}%` };
    } else {
      // Fill from center to current value (right side)
      const leftPercent = 50;
      const widthPercent = ((currentValue - center) / max) * 100;
      return { left: `${leftPercent}%`, width: `${widthPercent}%` };
    }
  };

  const fillStyle = getFillStyle();

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      onPointerDown={onPointerDown}
      max={max}
      step={step}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-peach-400">
        {/* Custom fill from center */}
        <div 
          className="absolute h-full bg-gradient-to-r from-gradient-start to-gradient-end transition-all"
          style={fillStyle}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-3 border-primary bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing" />
    </SliderPrimitive.Root>
  );
});

CenterSlider.displayName = "CenterSlider";
