"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface EcoTipsCardProps {
  tips: string[];
  onGetTips: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function EcoTipsCard({ tips, onGetTips, isLoading, error }: EcoTipsCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
           <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" /> Personalized Eco-Tips
        </CardTitle>
        <CardDescription>Discover new ways to enhance your green habits.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : error ? (
          <div className="text-destructive flex items-center space-x-2 p-3 bg-destructive/10 rounded-md">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        ) : tips.length > 0 ? (
          <ul className="space-y-3 list-disc list-inside pl-2 text-foreground">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm leading-relaxed">{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Click the button to get your personalized tips!</p>
        )}
        <Button 
          onClick={onGetTips} 
          disabled={isLoading} 
          className="mt-6 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          aria-label="Get personalized eco-tips"
        >
          {isLoading ? 'Loading Tips...' : 'Get Fresh Tips'}
        </Button>
      </CardContent>
    </Card>
  );
}
