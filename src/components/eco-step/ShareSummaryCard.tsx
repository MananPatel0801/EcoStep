"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';

interface ShareSummaryCardProps {
  points: number;
  loggedActivitiesCount: number;
}

export function ShareSummaryCard({ points, loggedActivitiesCount }: ShareSummaryCardProps) {
  const { toast } = useToast();

  const handleShare = () => {
    toast({
      title: "Sharing Achievements!",
      description: `Your eco-summary has been (not really) shared! You've earned ${points} points and completed ${loggedActivitiesCount} actions. Keep it up!`,
      variant: "default",
    });
  };

  const shareMessage = `I've earned ${points.toLocaleString()} points and completed ${loggedActivitiesCount} eco-actions on EcoStep! Join me in making a difference. 🌱 #EcoStep #Sustainability`;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
            <Share2 className="w-6 h-6 mr-2"/> Share Your Impact
        </CardTitle>
        <CardDescription>Inspire others by sharing your eco-journey.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-secondary/50 rounded-lg border border-dashed border-primary/30">
            <p className="text-sm text-foreground italic">
                "{shareMessage}"
            </p>
        </div>
        <Button 
            onClick={handleShare} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Share your eco achievements"
        >
            <Share2 className="w-4 h-4 mr-2" />
            Share on Social (Dummy)
        </Button>
      </CardContent>
    </Card>
  );
}
