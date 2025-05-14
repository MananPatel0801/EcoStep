"use client";

import type { EcoActivity } from '@/types/eco-step';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivitySelectorCardProps {
  activities: EcoActivity[];
  onLogActivity: (activityId: string) => void;
  disabled?: boolean;
}

export function ActivitySelectorCard({ activities, onLogActivity, disabled }: ActivitySelectorCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Log Your Green Actions</CardTitle>
        <CardDescription>Select an activity you've completed today to earn points.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <Button
                key={activity.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center justify-center space-y-2 text-center transform transition-all hover:shadow-md hover:scale-105 border-2 border-primary/20 hover:border-primary"
                onClick={() => onLogActivity(activity.id)}
                disabled={disabled}
                aria-label={`Log ${activity.name}`}
              >
                <activity.icon className="w-10 h-10 text-primary mb-2" />
                <span className="font-semibold text-sm text-foreground">{activity.name}</span>
                <span className="text-xs text-muted-foreground">+{activity.points} points</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
