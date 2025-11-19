import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { CenterSlider } from "./CenterSlider";

type FeelingsState = "collapsed" | "expanded" | "selecting" | "transition" | "complete";

interface Emotion {
  name: string;
  emoji: string;
  type: "positive" | "neutral" | "challenging";
  intensity: "low" | "medium" | "high";
}

const emotions: Emotion[] = [
  // Challenging emotions - high intensity (0-16)
  { name: "Angry", emoji: "😠", type: "challenging", intensity: "high" },
  { name: "Overwhelmed", emoji: "😵", type: "challenging", intensity: "high" },
  { name: "Frustrated", emoji: "😤", type: "challenging", intensity: "high" },
  
  // Challenging emotions - medium intensity (17-33)
  { name: "Anxious", emoji: "😰", type: "challenging", intensity: "medium" },
  { name: "Stressed", emoji: "😫", type: "challenging", intensity: "medium" },
  { name: "Worried", emoji: "😟", type: "challenging", intensity: "medium" },
  { name: "Sad", emoji: "😢", type: "challenging", intensity: "medium" },
  
  // Challenging emotions - low intensity (34-42)
  { name: "Disappointed", emoji: "😞", type: "challenging", intensity: "low" },
  { name: "Tired", emoji: "😴", type: "challenging", intensity: "low" },
  { name: "Lonely", emoji: "🥺", type: "challenging", intensity: "low" },
  
  // Neutral emotions (43-57)
  { name: "Bored", emoji: "😑", type: "neutral", intensity: "low" },
  { name: "Calm", emoji: "🧘", type: "neutral", intensity: "low" },
  { name: "Content", emoji: "😌", type: "neutral", intensity: "medium" },
  { name: "Peaceful", emoji: "☮️", type: "neutral", intensity: "medium" },
  { name: "Relaxed", emoji: "😮‍💨", type: "neutral", intensity: "medium" },
  
  // Positive emotions - low intensity (58-67)
  { name: "Grateful", emoji: "🙏", type: "positive", intensity: "low" },
  { name: "Hopeful", emoji: "🌟", type: "positive", intensity: "low" },
  { name: "Happy", emoji: "😄", type: "positive", intensity: "low" },
  
  // Positive emotions - medium intensity (68-83)
  { name: "Confident", emoji: "😎", type: "positive", intensity: "medium" },
  { name: "Optimistic", emoji: "✨", type: "positive", intensity: "medium" },
  { name: "Joyful", emoji: "😊", type: "positive", intensity: "medium" },
  { name: "Loved", emoji: "💕", type: "positive", intensity: "medium" },
  
  // Positive emotions - high intensity (84-100)
  { name: "Inspired", emoji: "💡", type: "positive", intensity: "high" },
  { name: "Energized", emoji: "⚡", type: "positive", intensity: "high" },
  { name: "Excited", emoji: "🎉", type: "positive", intensity: "high" },
  { name: "Empowered", emoji: "💪", type: "positive", intensity: "high" },
];

const getEmotionsFromScore = (score: number): Emotion[] => {
  if (score < 17) {
    // Very bad (0-16)
    return emotions.filter(e => e.type === "challenging" && e.intensity === "high");
  } else if (score < 34) {
    // Bad (17-33)
    return emotions.filter(e => e.type === "challenging" && e.intensity === "medium");
  } else if (score < 43) {
    // A little bad (34-42)
    return emotions.filter(e => e.type === "challenging" && e.intensity === "low");
  } else if (score < 58) {
    // Neutral (43-57)
    return emotions.filter(e => e.type === "neutral");
  } else if (score < 68) {
    // A little good (58-67)
    return emotions.filter(e => e.type === "positive" && e.intensity === "low");
  } else if (score < 84) {
    // Good (68-83)
    return emotions.filter(e => e.type === "positive" && e.intensity === "medium");
  } else {
    // Very good (84-100)
    return emotions.filter(e => e.type === "positive" && e.intensity === "high");
  }
};

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

const getEmotionFromScore = (score: number): string => {
  if (score < 17) return "Very bad";
  if (score < 34) return "Bad";
  if (score < 43) return "A little bad";
  if (score < 58) return "Neutral";
  if (score < 68) return "A little good";
  if (score < 84) return "Good";
  return "Very good";
};

export const FeelingsCheckCard = () => {
  const [state, setState] = useState<FeelingsState>("collapsed");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  const [availableEmotions, setAvailableEmotions] = useState<Emotion[]>([]);
  const [currentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  const cardRef = useRef<HTMLDivElement>(null);
  
  const currentIntensity = getEmotionFromScore(sliderValue[0]);

  // Lock scroll position when expanded or selecting
  useEffect(() => {
    if (state === "expanded" || state === "selecting") {
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
    const emotionOptions = getEmotionsFromScore(sliderValue[0]);
    setAvailableEmotions(emotionOptions);
    setState("selecting");
  };

  const handleEmotionSelect = (emotion: Emotion) => {
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
            {/* Current intensity display */}
            <div className="text-center mb-2">
              <p className="text-lg font-semibold text-brown-900">
                {currentIntensity}
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <CenterSlider 
                value={sliderValue} 
                onValueChange={handleSliderChange}
                onPointerDown={(e) => e.stopPropagation()}
                max={100} 
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-brown-700">
                <span>Terrible</span>
                <span>Wonderful</span>
              </div>
            </div>

            <button
              onClick={handleSliderCommit}
              className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold text-base px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE 3: SELECTING EMOTION
  if (state === "selecting") {
    return (
      <div ref={cardRef}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brown-600 mb-3 px-4">
          FEELINGS CHECK
        </h3>
        <div className="bg-peach-300 rounded-[16px] p-5 mx-4 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base text-brown-900 mb-1">
                How are you feeling?
              </h3>
              <p className="text-sm text-brown-700">
                {currentIntensity}
              </p>
            </div>
            <button 
              onClick={() => setState("expanded")}
              className="text-sm text-brown-700 hover:text-brown-900"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-brown-700 mb-4">
              Select the emotion that best describes how you're feeling:
            </p>
            
            <div className="flex flex-col items-center gap-2">
              {availableEmotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleEmotionSelect(emotion)}
                  className="w-full bg-background border border-peach-400 rounded-[20px] px-6 py-3 text-brown-900 text-[15px] hover:bg-peach-100 hover:border-primary transition-all"
                >
                  {emotion.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE 4: TRANSITION
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

  // STATE 5: COMPLETE
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
                {selectedEmotion.name}
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
