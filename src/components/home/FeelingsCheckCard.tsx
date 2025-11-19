import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

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

export const FeelingsCheckCard = () => {
  const [state, setState] = useState<FeelingsState>("collapsed");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [showAllEmotions, setShowAllEmotions] = useState(false);
  const [currentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));

  const displayedEmotions = showAllEmotions ? emotions : emotions.slice(0, 4);

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
      <div>
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
      <div>
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

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-brown-700 mb-2">
              <span>Terrible</span>
              <span>Wonderful</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              {displayedEmotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleEmotionSelect(emotion)}
                  className="w-full min-w-[140px] bg-background border border-peach-400 rounded-[20px] px-6 py-3 text-brown-900 text-[15px] hover:bg-peach-100 hover:border-primary transition-all"
                >
                  {emotion.name}
                </button>
              ))}
              {!showAllEmotions && (
                <button
                  onClick={() => setShowAllEmotions(true)}
                  className="w-full min-w-[140px] bg-background border border-peach-400 rounded-[20px] px-6 py-3 text-brown-900 text-[15px] hover:bg-peach-100 hover:border-primary transition-all"
                >
                  + Other
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE 3: TRANSITION
  if (state === "transition" && selectedEmotion) {
    return (
      <div>
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
      <div>
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
