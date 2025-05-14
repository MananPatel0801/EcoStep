import type { LucideIcon } from 'lucide-react';

export interface EcoActivity {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  points: number;
}

export interface LoggedEntry {
  id: string;
  activityId: string;
  date: string; // ISO string format for date
}
