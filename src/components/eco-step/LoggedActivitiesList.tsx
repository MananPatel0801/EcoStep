"use client";

import type { LoggedEntry, EcoActivity } from '@/types/eco-step';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ListTree } from 'lucide-react';

interface LoggedActivitiesListProps {
  loggedEntries: LoggedEntry[];
  activities: EcoActivity[];
}

export function LoggedActivitiesList({ loggedEntries, activities }: LoggedActivitiesListProps) {
  const getFullActivity = (activityId: string) => activities.find(a => a.id === activityId);

  if (loggedEntries.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Activity Log</CardTitle>
          <CardDescription>No activities logged yet. Start today!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-32">
            <ListTree className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Your logged activities will appear here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Recent Activity Log</CardTitle>
        <CardDescription>Keep track of your eco-friendly actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <ul className="space-y-3">
            {loggedEntries.slice().reverse().map((entry) => {
              const activity = getFullActivity(entry.activityId);
              if (!activity) return null;
              return (
                <li key={entry.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <activity.icon className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">+{activity.points} points</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, yyyy 'at' h:mm a")}</p>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
