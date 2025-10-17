import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habit-card";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { EmptyState } from "@/components/empty-state";
import { StatsOverview } from "@/components/stats-overview";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMotivationalToast } from "@/components/motivational-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HabitWithStats, InsertHabit } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const { toast } = useToast();
  const { showStreakToast, showCompletionToast, showUncompleteToast } = useMotivationalToast();

  const { data: habits = [], isLoading } = useQuery<HabitWithStats[]>({
    queryKey: ["/api/habits"],
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: InsertHabit) => {
      return apiRequest("POST", "/api/habits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      setDialogOpen(false);
      toast({
        title: "Habit created!",
        description: "Your new habit has been added successfully.",
      });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertHabit }) => {
      return apiRequest("PATCH", `/api/habits/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      setDialogOpen(false);
      setEditingHabit(null);
      toast({
        title: "Habit updated!",
        description: "Your habit has been updated successfully.",
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/habits/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      setDeletingHabitId(null);
      toast({
        title: "Habit deleted",
        description: "Your habit has been removed.",
      });
    },
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: async (habitId: string) => {
      return apiRequest("POST", `/api/habits/${habitId}/toggle`, undefined);
    },
    onSuccess: (data: HabitWithStats) => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      
      const habit = habits.find((h) => h.id === data.id);
      if (habit) {
        if (data.completedToday && !habit.completedToday) {
          showCompletionToast(data.name);
          if (data.currentStreak > habit.currentStreak) {
            showStreakToast(data.currentStreak, data.name);
          }
        } else if (!data.completedToday && habit.completedToday) {
          showUncompleteToast(data.name);
        }
      }
    },
  });

  const handleSubmit = (data: InsertHabit) => {
    if (editingHabit) {
      updateHabitMutation.mutate({ id: editingHabit.id, data });
    } else {
      createHabitMutation.mutate(data);
    }
  };

  const handleEdit = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingHabitId(id);
  };

  const confirmDelete = () => {
    if (deletingHabitId) {
      deleteHabitMutation.mutate(deletingHabitId);
    }
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
            <ThemeToggle />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold" data-testid="text-app-title">Habit Tracker</h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddHabit} data-testid="button-add-habit">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {habits.length === 0 ? (
          <EmptyState onAddHabit={handleAddHabit} />
        ) : (
          <div className="space-y-8">
            <StatsOverview habits={habits} />

            <div>
              <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleComplete={toggleCompletionMutation.mutate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={toggleCompletionMutation.isPending}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <AddHabitDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingHabit(null);
        }}
        onSubmit={handleSubmit}
        editingHabit={editingHabit}
        isLoading={createHabitMutation.isPending || updateHabitMutation.isPending}
      />

      <AlertDialog open={!!deletingHabitId} onOpenChange={() => setDeletingHabitId(null)}>
        <AlertDialogContent data-testid="dialog-delete-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all its completion history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
