
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { LoggedEntry } from '@/types/eco-step';
import { ecoActivities } from '@/config/eco-activities';
import { AppHeader } from '@/components/eco-step/Header';
import { ActivitySelectorCard } from '@/components/eco-step/ActivitySelectorCard';
import { LoggedActivitiesList } from '@/components/eco-step/LoggedActivitiesList';
import { UserStatsCard } from '@/components/eco-step/UserStatsCard';
import { ProgressForestCard } from '@/components/eco-step/ProgressForestCard';
import { EcoTipsCard } from '@/components/eco-step/EcoTipsCard';
import { ShareSummaryCard } from '@/components/eco-step/ShareSummaryCard';
import { personalizedEcoTips } from '@/ai/flows/personalized-eco-tips';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const LOCAL_STORAGE_KEY_LOGS = 'ecoStepLoggedEntries';
const LOCAL_STORAGE_KEY_POINTS = 'ecoStepUserPoints';

export default function EcoStepPage() {
  const [loggedEntries, setLoggedEntries] = useState<LoggedEntry[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [ecoTips, setEcoTips] = useState<string[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Load data from localStorage on initial mount
    const storedLogs = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
    if (storedLogs) {
      setLoggedEntries(JSON.parse(storedLogs));
    }
    const storedPoints = localStorage.getItem(LOCAL_STORAGE_KEY_POINTS);
    if (storedPoints) {
      setUserPoints(parseInt(storedPoints, 10));
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    if (isClient) {
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(loggedEntries));
      localStorage.setItem(LOCAL_STORAGE_KEY_POINTS, userPoints.toString());
    }
  }, [loggedEntries, userPoints, isClient]);

  const handleLogActivity = useCallback((activityId: string) => {
    const activity = ecoActivities.find(a => a.id === activityId);
    if (!activity) return;

    const newEntry: LoggedEntry = {
      id: Date.now().toString(), // Simple unique ID
      activityId,
      date: new Date().toISOString(),
    };

    setLoggedEntries(prev => [newEntry, ...prev]); // Add to beginning for chronological display reverse
    setUserPoints(prev => prev + activity.points);

    toast({
      title: "Activity Logged!",
      description: `You earned ${activity.points} points for ${activity.name}.`,
    });

  }, [toast]);

  const fetchEcoTips = useCallback(async () => {
    setIsLoadingTips(true);
    setTipsError(null);
    setEcoTips([]); 
    try {
      const activityNames = loggedEntries
        .map(entry => ecoActivities.find(a => a.id === entry.activityId)?.name)
        .filter((name): name is string => !!name);
      
      // Use at least one generic activity if none logged, or AI might not give good tips
      const inputActivities = activityNames.length > 0 ? activityNames : ["trying to be eco-friendly"];

      const result = await personalizedEcoTips({ loggedActivities: inputActivities.slice(0, 5) }); // Limit to last 5 for relevance
      if (result && result.tips) {
        setEcoTips(result.tips);
      } else {
        setTipsError("Couldn't fetch tips this time. Try again later!");
      }
    } catch (error) {
      console.error("Error fetching eco tips:", error);
      if (error instanceof Error && (error.message.includes('Service Unavailable') || error.message.includes('503'))) {
        setTipsError("The AI assistant is temporarily overloaded. Please try again in a few moments.");
      } else {
        setTipsError("An error occurred while fetching tips. Please try again.");
      }
    } finally {
      setIsLoadingTips(false);
    }
  }, [loggedEntries]);
  
  // Fetch initial tips if no activities logged yet
  useEffect(() => {
    if (isClient && loggedEntries.length === 0 && ecoTips.length === 0 && !isLoadingTips) {
      fetchEcoTips();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]); // Run once on client mount if conditions met

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main interactions) */}
          <div className="lg:col-span-2 space-y-8">
            <ActivitySelectorCard activities={ecoActivities} onLogActivity={handleLogActivity} />
            <LoggedActivitiesList loggedEntries={loggedEntries} activities={ecoActivities} />
             <EcoTipsCard 
              tips={ecoTips} 
              onGetTips={fetchEcoTips} 
              isLoading={isLoadingTips}
              error={tipsError}
            />
          </div>

          {/* Right Column (Stats and Visuals) */}
          <aside className="space-y-8">
            <UserStatsCard points={userPoints} />
            <ProgressForestCard points={userPoints} />
            <ShareSummaryCard points={userPoints} loggedActivitiesCount={loggedEntries.length} />
          </aside>
        </div>
        
        <Separator className="my-12" />

        <footer className="text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} EcoStep. Make every step count for the planet.</p>
        </footer>
      </main>
    </div>
  );
}
