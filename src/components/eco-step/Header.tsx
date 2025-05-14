import { Leaf } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 mb-4">
      <div className="container mx-auto flex items-center space-x-3">
        <Leaf className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-primary tracking-tight">EcoStep</h1>
      </div>
    </header>
  );
}
