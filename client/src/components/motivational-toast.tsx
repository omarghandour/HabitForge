import { useToast } from "@/hooks/use-toast";
import { Trophy, Zap, Star, Flame } from "lucide-react";

export function useMotivationalToast() {
  const { toast } = useToast();

  const showStreakToast = (streakCount: number, habitName: string) => {
    const messages = {
      1: {
        title: "Great start!",
        description: `You've started your ${habitName} journey!`,
        icon: Star,
      },
      3: {
        title: "Building momentum!",
        description: `3-day streak on ${habitName}. Keep it going!`,
        icon: Zap,
      },
      7: {
        title: "One week strong!",
        description: `Amazing! You've completed ${habitName} for 7 days straight!`,
        icon: Flame,
      },
      14: {
        title: "Two weeks of dedication!",
        description: `Incredible consistency on ${habitName}. You're unstoppable!`,
        icon: Trophy,
      },
      30: {
        title: "30-Day Milestone!",
        description: `Outstanding achievement! A full month of ${habitName}. You're a champion!`,
        icon: Trophy,
      },
      60: {
        title: "60 Days of Excellence!",
        description: `Phenomenal! Two months of ${habitName}. This is who you are now!`,
        icon: Trophy,
      },
      100: {
        title: "Century Club!",
        description: `Legendary! 100 days of ${habitName}. You've mastered this habit!`,
        icon: Trophy,
      },
    };

    const milestones = [100, 60, 30, 14, 7, 3, 1];
    const milestone = milestones.find((m) => streakCount === m);

    if (milestone && messages[milestone as keyof typeof messages]) {
      const { title, description } = messages[milestone as keyof typeof messages];
      toast({
        title,
        description,
        duration: 4000,
      });
    }
  };

  const showCompletionToast = (habitName: string) => {
    const encouragements = [
      "Excellent work!",
      "Way to go!",
      "You did it!",
      "Keep crushing it!",
      "Another win!",
      "Fantastic effort!",
    ];

    const message = encouragements[Math.floor(Math.random() * encouragements.length)];

    toast({
      title: message,
      description: `${habitName} completed for today.`,
      duration: 2000,
    });
  };

  const showUncompleteToast = (habitName: string) => {
    toast({
      title: "Progress updated",
      description: `${habitName} marked as incomplete.`,
      duration: 2000,
    });
  };

  return {
    showStreakToast,
    showCompletionToast,
    showUncompleteToast,
  };
}
