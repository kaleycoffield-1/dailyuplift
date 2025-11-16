import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, User } from "lucide-react";
import { DailyWisdomCard } from "@/components/home/DailyWisdomCard";
import { FeelingsCheckCard } from "@/components/home/FeelingsCheckCard";
import { RadialAppreciationCard } from "@/components/home/RadialAppreciationCard";
import { AffirmationCard } from "@/components/home/AffirmationCard";
import { BottomNav } from "@/components/home/BottomNav";

type TimeOfDay = "morning" | "midday" | "evening";

const Index = () => {
  const { user } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");

  // Placeholder data
  const userName = "Kaley";
  const dailyWisdomTitle = "SHARE YOUR JOY";
  const dailyWisdomContent = "The best thing you can do for those around you is to cultivate and share your own happiness.";
  const affirmation = "I am confident and capable.";
  const currentFeeling = 65;
  
  // Get current time formatted
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Determine time of day
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        setTimeOfDay("morning");
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay("midday");
      } else {
        setTimeOfDay("evening");
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    if (timeOfDay === "morning") return `Good morning ${userName}!`;
    if (timeOfDay === "midday") return `Hi there, ${userName}!`;
    return `Good evening, ${userName}.`;
  };

  return (
    <div className="min-h-screen bg-background pb-[120px]">
      {/* Header Bar */}
      <header className="h-14 px-4 flex items-center justify-between">
        <button className="p-2 hover:scale-110 transition-transform">
          <Menu className="w-6 h-6 text-brown-900" />
        </button>
        <button className="p-2 hover:scale-110 transition-transform">
          <User className="w-6 h-6 text-brown-900" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4">
        {/* Greeting */}
        <h1 className="text-2xl text-brown-900 text-center my-6">
          {getGreeting()}
        </h1>

        <div className="space-y-4 max-w-md mx-auto">
          {/* MORNING STATE */}
          {timeOfDay === "morning" && (
            <>
              {/* Primary Button */}
              <button className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold text-base px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px]">
                Begin morning check-in
              </button>

              <div className="mt-8 space-y-10">
                <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                  DAILY WISDOM
                </p>
                <DailyWisdomCard 
                  title={dailyWisdomTitle}
                  content={dailyWisdomContent}
                />
                <div>
                  <FeelingsCheckCard 
                    feeling={currentFeeling}
                    timestamp={getCurrentTime()}
                  />
                </div>
                <div>
                  <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                    LIFT YOUR VIBE EXERCISE
                  </p>
                  <RadialAppreciationCard isCompleted={false} />
                </div>
              </div>
            </>
          )}

          {/* MIDDAY STATE */}
          {timeOfDay === "midday" && (
            <div className="space-y-10">
              <FeelingsCheckCard 
                feeling={currentFeeling}
                timestamp={getCurrentTime()}
              />
              <div>
                <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                  LIFT YOUR VIBE EXERCISE
                </p>
                <RadialAppreciationCard isCompleted={true} />
              </div>
              <div>
                <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                  DAILY WISDOM
                </p>
                <DailyWisdomCard 
                  title={dailyWisdomTitle}
                  content={dailyWisdomContent}
                />
              </div>
              <div>
                <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                  TODAY'S AFFIRMATION
                </p>
                <AffirmationCard text={affirmation} />
              </div>
            </div>
          )}

          {/* EVENING STATE */}
          {timeOfDay === "evening" && (
            <>
              {/* Primary Button */}
              <button className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold text-base px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px]">
                Begin evening reflection
              </button>

              <div className="mt-8 space-y-10">
                <div>
                  <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                    TODAY'S AFFIRMATION
                  </p>
                  <AffirmationCard text={affirmation} />
                </div>
                <div>
                  <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                    DAILY WISDOM
                  </p>
                  <DailyWisdomCard 
                    title={dailyWisdomTitle}
                    content={dailyWisdomContent}
                  />
                </div>
                <div>
                  <FeelingsCheckCard 
                    feeling={currentFeeling}
                    timestamp={getCurrentTime()}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </div>
  );
};

export default Index;
