import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddHabit: () => void;
}

export function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Target className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No habits yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start building better habits today. Create your first habit and begin your journey to consistency.
      </p>
      <Button onClick={onAddHabit} size="lg" data-testid="button-create-first-habit">
        Create Your First Habit
      </Button>
    </div>
  );
}
