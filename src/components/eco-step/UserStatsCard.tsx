"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star } from 'lucide-react';

interface UserStatsCardProps {
  points: number;
}

const POINTS_PER_LEVEL = 100;

export function UserStatsCard({ points }: UserStatsCardProps) {
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const pointsToNextLevel = POINTS_PER_LEVEL - (points % POINTS_PER_LEVEL);
  const progressPercentage = (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100;


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Your EcoStats</CardTitle>
        <CardDescription>Track your progress and impact.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <div>
            <p className="text-sm font-medium text-primary">Total Points</p>
            <p className="text-3xl font-bold text-primary">{points.toLocaleString()}</p>
          </div>
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
          <div>
            <p className="text-sm font-medium text-accent-foreground">Current Level</p>
            <p className="text-3xl font-bold text-accent">{level}</p>
          </div>
          <Star className="w-10 h-10 text-accent" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress to Level {level + 1}</span>
            <span>{points % POINTS_PER_LEVEL}/{POINTS_PER_LEVEL}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-accent h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
              aria-label={`Progress to next level: ${progressPercentage.toFixed(0)}%`}
            ></div>
          </div>
          { points < POINTS_PER_LEVEL * 10 && // Show only if not too high level
            <p className="text-xs text-muted-foreground mt-1 text-right">{pointsToNextLevel} more points to Level {level + 1}!</p>
          }
        </div>
      </CardContent>
    </Card>
  );
}
