import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { DailyWisdomCard } from "@/components/home/DailyWisdomCard";
import { FeelingsCheckCard } from "@/components/home/FeelingsCheckCard";
import { RadialAppreciationCard } from "@/components/home/RadialAppreciationCard";
import { AffirmationCard } from "@/components/home/AffirmationCard";
import { BottomNav } from "@/components/home/BottomNav";
import { useGenerateContent } from "@/hooks/useGenerateContent";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TimeOfDay = "morning" | "midday" | "evening";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { generateContent, isGenerating } = useGenerateContent();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");
  const [dailyWisdom, setDailyWisdom] = useState({ 
    title: "SHARE YOUR JOY",
    content: "The best thing you can do for those around you is to cultivate and share your own happiness."
  });
  const [affirmation, setAffirmation] = useState("I am confident and capable.");

  const userName = "Kaley";
  const currentFeeling = 65;
  
  // Fetch or generate daily wisdom
  useEffect(() => {
    const fetchWisdom = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_wisdom')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setDailyWisdom({ title: data.title, content: data.content });
        } else {
          // Generate new wisdom if none exists
          const newWisdom = await generateContent('wisdom');
          if (newWisdom) {
            setDailyWisdom({ title: newWisdom.title, content: newWisdom.content });
          }
        }
      } catch (error) {
        console.error('Error fetching wisdom:', error);
      }
    };

    fetchWisdom();
  }, []);

  // Fetch or generate affirmation
  useEffect(() => {
    if (!user?.id) return;

    const fetchAffirmation = async () => {
      try {
        const { data, error } = await supabase
          .from('affirmations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setAffirmation(data.text);
        } else {
          // Generate new affirmation if none exists
          const newAffirmation = await generateContent('affirmation');
          if (newAffirmation) {
            setAffirmation(newAffirmation.text);
          }
        }
      } catch (error) {
        console.error('Error fetching affirmation:', error);
      }
    };

    fetchAffirmation();
  }, [user?.id]);
  
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header Bar - Fixed */}
      <header className="h-14 px-4 flex items-center justify-between flex-shrink-0 fixed top-0 left-0 right-0 bg-background z-10">
        <button className="p-2 hover:scale-110 transition-transform">
          <Menu className="w-6 h-6 text-brown-900" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-brown-900" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border-peach-400">
            <DropdownMenuItem 
              onClick={signOut}
              className="cursor-pointer text-brown-900 focus:bg-peach-200 focus:text-brown-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 pt-14">
        <div className="space-y-4 max-w-md mx-auto min-h-full pb-6">
          {/* MORNING STATE */}
          {timeOfDay === "morning" && (
            <>
              <div className="mt-10">
                {/* Greeting */}
                <h1 className="text-2xl text-brown-900 text-center mb-6">
                  {getGreeting()}
                </h1>
                
                {/* Primary Button */}
                <button className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold text-base px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px] mb-20">
                  Begin morning check-in
                </button>
              </div>

              <div className="mt-20 space-y-10">
                <div>
                  <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-1">
                    DAILY WISDOM
                  </p>
                  <DailyWisdomCard 
                    title={dailyWisdom.title}
                    content={dailyWisdom.content}
                  />
                </div>
                <FeelingsCheckCard />
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
            <>
              {/* Greeting */}
              <h1 className="text-2xl text-brown-900 text-center mt-10 mb-6">
                {getGreeting()}
              </h1>
              
              <div className="space-y-10">
                <FeelingsCheckCard />
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
                    title={dailyWisdom.title}
                    content={dailyWisdom.content}
                  />
                </div>
                <div>
                  <p className="text-xs font-normal uppercase tracking-wide text-brown-700 text-center mb-3">
                    TODAY'S AFFIRMATION
                  </p>
                  <AffirmationCard text={affirmation} />
                </div>
              </div>
            </>
          )}

          {/* EVENING STATE */}
          {timeOfDay === "evening" && (
            <>
              <div className="mt-10 mb-20">
                {/* Greeting */}
                <h1 className="text-2xl text-brown-900 text-center mb-6">
                  {getGreeting()}
                </h1>
                
                {/* Primary Button */}
                <button 
                  onClick={() => navigate('/chat')}
                  className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold text-base px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px]"
                >
                  Begin evening reflection
                </button>
              </div>

              <div className="mt-20 space-y-10">
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
                    title={dailyWisdom.title}
                    content={dailyWisdom.content}
                  />
                </div>
                <div className="pb-28">
                  <FeelingsCheckCard />
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
