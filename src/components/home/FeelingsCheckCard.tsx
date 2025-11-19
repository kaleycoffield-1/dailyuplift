import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type FeelingsState = "collapsed" | "expanded" | "transition" | "complete";

interface Emotion {
  name: string;
  emoji: string;
  type: "positive" | "neutral" | "challenging";
}

const emotions: Emotion[] = [
  { name: "Joyful", emoji: "😊", type: "positive" },
  { name: "Excited", emoji: "🎉", type: "positive" },
  { name: "Loved", emoji: "💕", type: "positive" },
  { name: "Empowered", emoji: "💪", type: "positive" },
  { name: "Happy", emoji: "😄", type: "positive" },
  { name: "Content", emoji: "😌", type: "neutral" },
  { name: "Peaceful", emoji: "☮️", type: "neutral" },
  { name: "Grateful", emoji: "🙏", type: "positive" },
  { name: "Energized", emoji: "⚡", type: "positive" },
  { name: "Calm", emoji: "🧘", type: "neutral" },
  { name: "Confident", emoji: "😎", type: "positive" },
  { name: "Hopeful", emoji: "🌟", type: "positive" },
  { name: "Optimistic", emoji: "✨", type: "positive" },
  { name: "Relaxed", emoji: "😮‍💨", type: "neutral" },
  { name: "Inspired", emoji: "💡", type: "positive" },
  { name: "Anxious", emoji: "😰", type: "challenging" },
  { name: "Stressed", emoji: "😫", type: "challenging" },
  { name: "Frustrated", emoji: "😤", type: "challenging" },
  { name: "Sad", emoji: "😢", type: "challenging" },
  { name: "Angry", emoji: "😠", type: "challenging" },
  { name: "Overwhelmed", emoji: "😵", type: "challenging" },
  { name: "Tired", emoji: "😴", type: "neutral" },
  { name: "Disappointed", emoji: "😞", type: "challenging" },
  { name: "Worried", emoji: "😟", type: "challenging" },
  { name: "Lonely", emoji: "🥺", type: "challenging" },
  { name: "Bored", emoji: "😑", type: "neutral" },
];

const encouragementMessages = {
  positive: [
    "That's terrific! Keep up those good vibes and enjoy your day! 💫",
    "Beautiful! Your energy is exactly where you want it. ✨",
    "Love this for you! Ride that wave of good feeling. 🌊",
    "Wonderful! You're in a great place right now. 💚",
  ],
  neutral: [
    "That's perfectly okay. Sometimes steady is exactly what we need. 🌿",
    "Good to check in. You're exactly where you are. 💭",
    "Nice and balanced. Enjoy this moment of peace. ☮️",
  ],
  challenging: [
    "I hear you. Remember, this feeling is just information. You're okay. 💚",
    "It's okay to feel this way. One better-feeling thought at a time. 🌱",
    "Thanks for being honest with yourself. Let's work on shifting this. 💫",
    "This is temporary. You have the power to feel better. ✨",
  ],
};

const getEncouragementMessage = (type: "positive" | "neutral" | "challenging"): string => {
  const messages = encouragementMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

const getEmotionFromScore = (score: number): Emotion => {
  // Map 0-100 score to emotions (worst to best)
  if (score < 4) return emotions.find(e => e.name === "Angry")!;
  if (score < 8) return emotions.find(e => e.name === "Sad")!;
  if (score < 12) return emotions.find(e => e.name === "Disappointed")!;
  if (score < 16) return emotions.find(e => e.name === "Frustrated")!;
  if (score < 20) return emotions.find(e => e.name === "Overwhelmed")!;
  if (score < 24) return emotions.find(e => e.name === "Anxious")!;
  if (score < 28) return emotions.find(e => e.name === "Worried")!;
  if (score < 32) return emotions.find(e => e.name === "Stressed")!;
  if (score < 36) return emotions.find(e => e.name === "Lonely")!;
  if (score < 40) return emotions.find(e => e.name === "Tired")!;
  if (score < 44) return emotions.find(e => e.name === "Bored")!;
  if (score < 48) return emotions.find(e => e.name === "Calm")!;
  if (score < 52) return emotions.find(e => e.name === "Content")!;
  if (score < 56) return emotions.find(e => e.name === "Peaceful")!;
  if (score < 60) return emotions.find(e => e.name === "Relaxed")!;
  if (score < 64) return emotions.find(e => e.name === "Grateful")!;
  if (score < 68) return emotions.find(e => e.name === "Hopeful")!;
  if (score < 72) return emotions.find(e => e.name === "Happy")!;
  if (score < 76) return emotions.find(e => e.name === "Confident")!;
  if (score < 80) return emotions.find(e => e.name === "Optimistic")!;
  if (score < 84) return emotions.find(e => e.name === "Joyful")!;
  if (score < 88) return emotions.find(e => e.name === "Loved")!;
  if (score < 92) return emotions.find(e => e.name === "Inspired")!;
  if (score < 96) return emotions.find(e => e.name === "Energized")!;
  if (score < 100) return emotions.find(e => e.name === "Excited")!;
  return emotions.find(e => e.name === "Empowered")!;
};

export const FeelingsCheckCard = () => {
  const [state, setState] = useState<FeelingsState>("collapsed");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  const [currentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  const cardRef = useRef<HTMLDivElement>(null);
  
  const currentEmotion = getEmotionFromScore(sliderValue[0]);

  // Lock scroll position when expanded
  useEffect(() => {
    if (state === "expanded") {
      // Scroll card into view smoothly and lock position
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Prevent body scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [state]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  const handleSliderCommit = () => {
    const emotion = getEmotionFromScore(sliderValue[0]);
    setSelectedEmotion(emotion);
    setState("transition");
    
    setTimeout(() => {
      setState("complete");
    }, 300);
  };

  const handleEdit = () => {
    setState("expanded");
  };

  const handleExpand = () => {
    if (state === "collapsed") {
      setState("expanded");
    }
  };

  // STATE 1: COLLAPSED
  if (state === "collapsed") {
    return (
      <div ref={cardRef}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brown-600 mb-3 px-4">
          FEELINGS CHECK
        </h3>
        <div 
          className="bg-peach-300 rounded-[16px] p-5 mx-4 cursor-pointer hover:bg-peach-400 transition-colors"
          onClick={handleExpand}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base text-brown-900 mb-1">
                I'm feeling...
              </h3>
              <p className="text-sm text-brown-700">
                {currentTime}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-brown-900 flex-shrink-0" />
          </div>

          <div className="space-y-2">
            <div className="relative h-2 bg-peach-400 rounded-full">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-2 border-white shadow-md" />
            </div>
            <div className="flex justify-between text-sm text-brown-700">
              <span>Terrible</span>
              <span>Wonderful</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE 2: EXPANDED
  if (state === "expanded") {
    return (
      <div ref={cardRef}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brown-600 mb-3 px-4">
          FEELINGS CHECK
        </h3>
        <div className="bg-peach-300 rounded-[16px] p-5 mx-4 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base text-brown-900 mb-1">
                I'm feeling...
              </h3>
              <p className="text-sm text-brown-700">
                {currentTime}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current emotion display */}
            <div className="text-center mb-2">
              <span className="text-2xl">{currentEmotion.emoji}</span>
              <p className="text-base font-semibold text-brown-900 mt-1">
                {currentEmotion.name}
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <Slider 
                value={sliderValue} 
                onValueChange={handleSliderChange}
                onValueCommit={handleSliderCommit}
                max={100} 
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-brown-700">
                <span>Terrible</span>
                <span>Wonderful</span>
              </div>
            </div>

            <p className="text-xs text-brown-700 text-center mt-4">
              Drag the slider and release to log your feeling
            </p>
          </div>
        </div>
      </div>
    );
  }

  // STATE 3: TRANSITION
  if (state === "transition" && selectedEmotion) {
    return (
      <div ref={cardRef}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brown-600 mb-3 px-4">
          FEELINGS CHECK
        </h3>
        <div className="bg-peach-300 rounded-[16px] p-5 mx-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base text-brown-900 mb-1">
                I'm feeling...
              </h3>
              <p className="text-sm text-brown-700">
                {currentTime}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              className="w-full min-w-[140px] bg-primary rounded-[20px] px-6 py-3 text-brown-900 font-semibold text-base animate-scale-in"
            >
              {selectedEmotion.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE 4: COMPLETE
  if (state === "complete" && selectedEmotion) {
    return (
      <div ref={cardRef}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brown-600 mb-3 px-4">
          FEELINGS CHECK
        </h3>
        <div className="bg-peach-300 rounded-[16px] p-5 mx-4 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handleEdit}
              className="flex items-center gap-1 text-sm text-brown-700 hover:text-brown-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Edit</span>
              <span className="ml-1">{currentTime}</span>
            </button>
            <button className="text-sm text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1">
              <span>Feelings log</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-base text-brown-900 mb-4">
              I'm feeling
            </h3>

            <div className="bg-gradient-to-r from-gradient-start to-gradient-end rounded-[20px] px-6 py-3 mb-4">
              <span className="text-brown-900 font-semibold text-base">
                {selectedEmotion.emoji} {selectedEmotion.name}
              </span>
            </div>

            <p className="text-sm text-brown-900 leading-relaxed">
              {getEncouragementMessage(selectedEmotion.type)}
            </p>

            <button className="mt-4 text-sm text-brown-700 hover:text-brown-900 transition-colors">
              + Add note
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
