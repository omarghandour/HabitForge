import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Edit, Trash2, Check } from "lucide-react";
import type { HabitWithStats } from "@shared/schema";

interface HabitCardProps {
  habit: HabitWithStats;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habitId: string) => void;
  isLoading?: boolean;
}

export function HabitCard({ 
  habit, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isLoading = false 
}: HabitCardProps) {
  const getStreakColor = () => {
    if (habit.currentStreak >= 30) return "text-chart-3";
    if (habit.currentStreak >= 14) return "text-chart-2";
    if (habit.currentStreak >= 7) return "text-primary";
    return "text-muted-foreground";
  };

  const getStreakGlow = () => {
    if (habit.currentStreak >= 30) return "animate-pulse";
    if (habit.currentStreak >= 14) return "animate-pulse";
    return "";
  };

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-md ${
        habit.completedToday ? "border-l-4 border-l-primary" : ""
      }`}
      data-testid={`card-habit-${habit.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight truncate" data-testid={`text-habit-name-${habit.id}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {habit.description}
            </p>
          )}
          <Badge variant="secondary" className="mt-2">
            {habit.frequency}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(habit)}
            data-testid={`button-edit-habit-${habit.id}`}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit habit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(habit.id)}
            data-testid={`button-delete-habit-${habit.id}`}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete habit</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium" data-testid={`text-progress-${habit.id}`}>
              {habit.weeklyProgress}%
            </span>
          </div>
          <Progress 
            value={habit.weeklyProgress} 
            className="h-2"
            data-testid={`progress-bar-${habit.id}`}
          />
        </div>

        {/* Streak Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`h-6 w-6 ${getStreakColor()} ${getStreakGlow()}`} />
            <div>
              <p className="text-2xl font-bold" data-testid={`text-streak-${habit.id}`}>
                {habit.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>

          <Button
            size="lg"
            variant={habit.completedToday ? "default" : "outline"}
            onClick={() => onToggleComplete(habit.id)}
            disabled={isLoading}
            data-testid={`button-complete-${habit.id}`}
            className="min-w-[100px]"
          >
            {habit.completedToday ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Done
              </>
            ) : (
              "Mark Done"
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="pt-2 border-t flex justify-between text-sm text-muted-foreground">
          <span>Best: {habit.longestStreak} days</span>
          <span>Total: {habit.totalCompletions}</span>
        </div>
      </CardContent>
    </Card>
  );
}
