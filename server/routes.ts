import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema, insertCompletionSchema, type HabitWithStats } from "@shared/schema";

// Helper function to calculate streaks
function calculateStreaks(completions: { completedAt: string }[], frequency: string): {
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: string;
} {
  if (completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = completions
    .map(c => c.completedAt)
    .sort((a, b) => b.localeCompare(a));

  const lastCompletedAt = sortedDates[0];
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // For daily habits
  if (frequency === 'daily') {
    // Calculate current streak
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      let checkDate = sortedDates[0] === today ? today : yesterday;
      for (const date of sortedDates) {
        if (date === checkDate) {
          currentStreak++;
          const prevDate = new Date(checkDate);
          prevDate.setDate(prevDate.getDate() - 1);
          checkDate = prevDate.toISOString().split('T')[0];
        } else if (date < checkDate) {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffDays = Math.floor((prevDate.getTime() - currentDate.getTime()) / 86400000);

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
  } else {
    // For weekly habits - use week start date (Sunday) as unique identifier
    const getWeekStart = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(Date.UTC(year, month - 1, day));
      const dayOfWeek = d.getUTCDay();
      const diff = dayOfWeek; // Days since Sunday
      const weekStartDate = new Date(Date.UTC(year, month - 1, day - diff));
      return weekStartDate.toISOString().split('T')[0];
    };

    // Get unique week starts
    const weekStarts = Array.from(
      new Set(sortedDates.map(date => getWeekStart(date)))
    ).sort().reverse(); // Most recent first

    const todayWeekStart = getWeekStart(new Date().toISOString().split('T')[0]);

    // Calculate current streak
    if (weekStarts.includes(todayWeekStart)) {
      currentStreak = 1;
      for (let i = 1; i < weekStarts.length; i++) {
        const [y1, m1, d1] = weekStarts[i - 1].split('-').map(Number);
        const [y2, m2, d2] = weekStarts[i].split('-').map(Number);
        const date1 = Date.UTC(y1, m1 - 1, d1);
        const date2 = Date.UTC(y2, m2 - 1, d2);
        const daysDiff = Math.floor((date1 - date2) / 86400000);
        
        // Consecutive weeks are exactly 7 days apart
        if (daysDiff === 7) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < weekStarts.length; i++) {
      const [y1, m1, d1] = weekStarts[i - 1].split('-').map(Number);
      const [y2, m2, d2] = weekStarts[i].split('-').map(Number);
      const date1 = Date.UTC(y1, m1 - 1, d1);
      const date2 = Date.UTC(y2, m2 - 1, d2);
      const daysDiff = Math.floor((date1 - date2) / 86400000);
      
      if (daysDiff === 7) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
  }

  return { currentStreak, longestStreak, lastCompletedAt };
}

// Helper to calculate weekly progress
function calculateWeeklyProgress(completions: { completedAt: string }[], frequency: string): number {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const completionsThisWeek = completions.filter(c => {
    const completionDate = new Date(c.completedAt);
    return completionDate >= startOfWeek;
  });

  if (frequency === 'daily') {
    const daysInWeek = 7;
    return Math.min(Math.round((completionsThisWeek.length / daysInWeek) * 100), 100);
  } else {
    return completionsThisWeek.length > 0 ? 100 : 0;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all habits with stats
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getAllHabits();
      const today = new Date().toISOString().split('T')[0];

      const habitsWithStats: HabitWithStats[] = await Promise.all(
        habits.map(async (habit) => {
          const completions = await storage.getCompletionsByHabitId(habit.id);
          const { currentStreak, longestStreak, lastCompletedAt } = calculateStreaks(completions, habit.frequency);
          const weeklyProgress = calculateWeeklyProgress(completions, habit.frequency);
          const completedToday = completions.some(c => c.completedAt === today);

          return {
            ...habit,
            currentStreak,
            longestStreak,
            completedToday,
            weeklyProgress,
            totalCompletions: completions.length,
            lastCompletedAt,
          };
        })
      );

      res.json(habitsWithStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habits" });
    }
  });

  // Create a habit
  app.post("/api/habits", async (req, res) => {
    try {
      const data = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(data);
      
      const habitWithStats: HabitWithStats = {
        ...habit,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        weeklyProgress: 0,
        totalCompletions: 0,
      };

      res.json(habitWithStats);
    } catch (error) {
      res.status(400).json({ error: "Invalid habit data" });
    }
  });

  // Update a habit
  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertHabitSchema.parse(req.body);
      const habit = await storage.updateHabit(id, data);

      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }

      const completions = await storage.getCompletionsByHabitId(habit.id);
      const today = new Date().toISOString().split('T')[0];
      const { currentStreak, longestStreak, lastCompletedAt } = calculateStreaks(completions, habit.frequency);
      const weeklyProgress = calculateWeeklyProgress(completions, habit.frequency);
      const completedToday = completions.some(c => c.completedAt === today);

      const habitWithStats: HabitWithStats = {
        ...habit,
        currentStreak,
        longestStreak,
        completedToday,
        weeklyProgress,
        totalCompletions: completions.length,
        lastCompletedAt,
      };

      res.json(habitWithStats);
    } catch (error) {
      res.status(400).json({ error: "Invalid habit data" });
    }
  });

  // Delete a habit
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHabit(id);

      if (!deleted) {
        return res.status(404).json({ error: "Habit not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  });

  // Toggle habit completion for today
  app.post("/api/habits/:id/toggle", async (req, res) => {
    try {
      const { id } = req.params;
      const habit = await storage.getHabit(id);

      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }

      const today = new Date().toISOString().split('T')[0];
      const existingCompletion = await storage.getCompletionByHabitAndDate(id, today);

      if (existingCompletion) {
        await storage.deleteCompletion(id, today);
      } else {
        await storage.createCompletion({
          habitId: id,
          completedAt: today,
        });
      }

      const completions = await storage.getCompletionsByHabitId(habit.id);
      const { currentStreak, longestStreak, lastCompletedAt } = calculateStreaks(completions, habit.frequency);
      const weeklyProgress = calculateWeeklyProgress(completions, habit.frequency);
      const completedToday = completions.some(c => c.completedAt === today);

      const habitWithStats: HabitWithStats = {
        ...habit,
        currentStreak,
        longestStreak,
        completedToday,
        weeklyProgress,
        totalCompletions: completions.length,
        lastCompletedAt,
      };

      res.json(habitWithStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle completion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
