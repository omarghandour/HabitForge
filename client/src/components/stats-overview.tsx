import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Award } from "lucide-react";
import type { HabitWithStats } from "@shared/schema";

interface StatsOverviewProps {
  habits: HabitWithStats[];
}

export function StatsOverview({ habits }: StatsOverviewProps) {
  const totalHabits = habits.length;
  const activeStreaks = habits.filter((h) => h.currentStreak > 0).length;
  const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
  const completedToday = habits.filter((h) => h.completedToday).length;
  const todayProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const stats = [
    {
      label: "Today's Progress",
      value: `${completedToday}/${totalHabits}`,
      subValue: `${todayProgress}%`,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Streaks",
      value: activeStreaks.toString(),
      subValue: `out of ${totalHabits}`,
      icon: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Best Streak",
      value: longestStreak.toString(),
      subValue: "days",
      icon: Award,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} data-testid={`stat-card-${index}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mb-1" data-testid={`stat-value-${index}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.subValue}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
