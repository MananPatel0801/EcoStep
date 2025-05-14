import type { EcoActivity } from '@/types/eco-step';
import { Recycle, Bus, Sprout, Droplets, ShoppingBag, ZapOff, Vegan } from 'lucide-react';

export const ecoActivities: EcoActivity[] = [
  {
    id: 'recycle',
    name: 'Recycled Waste',
    description: 'Sorted and recycled household waste.',
    icon: Recycle,
    points: 10,
  },
  {
    id: 'public_transport',
    name: 'Used Public Transport',
    description: 'Opted for public transport instead of a private vehicle.',
    icon: Bus,
    points: 15,
  },
  {
    id: 'plant_tree',
    name: 'Planted a Tree',
    description: 'Planted a new tree in your community or garden.',
    icon: Sprout,
    points: 50,
  },
  {
    id: 'conserve_water',
    name: 'Conserved Water',
    description: 'Took active steps to reduce water consumption.',
    icon: Droplets,
    points: 10,
  },
  {
    id: 'reusable_bag',
    name: 'Used Reusable Bag',
    description: 'Used a reusable bag for shopping.',
    icon: ShoppingBag,
    points: 5,
  },
  {
    id: 'reduce_energy',
    name: 'Reduced Energy Use',
    description: 'Unplugged unused devices or used energy-efficient appliances.',
    icon: ZapOff,
    points: 10,
  },
  {
    id: 'compost',
    name: 'Composted Food Scraps',
    description: 'Composted organic waste instead of sending it to landfill.',
    icon: Vegan, // Representing organic matter/leaf
    points: 15,
  },
];
