import { 
  type Habit, 
  type InsertHabit,
  type Completion,
  type InsertCompletion,
  type HabitWithStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Habits
  getAllHabits(): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, habit: InsertHabit): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  
  // Completions
  getCompletionsByHabitId(habitId: string): Promise<Completion[]>;
  createCompletion(completion: InsertCompletion): Promise<Completion>;
  deleteCompletion(habitId: string, date: string): Promise<boolean>;
  getCompletionByHabitAndDate(habitId: string, date: string): Promise<Completion | undefined>;
}

export class MemStorage implements IStorage {
  private habits: Map<string, Habit>;
  private completions: Map<string, Completion>;

  constructor() {
    this.habits = new Map();
    this.completions = new Map();
  }

  // Habits
  async getAllHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values());
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      id,
      name: insertHabit.name,
      description: insertHabit.description || null,
      frequency: insertHabit.frequency,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, insertHabit: InsertHabit): Promise<Habit | undefined> {
    const existing = this.habits.get(id);
    if (!existing) return undefined;

    const updated: Habit = {
      ...existing,
      name: insertHabit.name,
      description: insertHabit.description || null,
      frequency: insertHabit.frequency,
    };
    this.habits.set(id, updated);
    return updated;
  }

  async deleteHabit(id: string): Promise<boolean> {
    // Delete all completions for this habit
    const completions = Array.from(this.completions.values());
    completions.forEach(completion => {
      if (completion.habitId === id) {
        this.completions.delete(completion.id);
      }
    });
    
    return this.habits.delete(id);
  }

  // Completions
  async getCompletionsByHabitId(habitId: string): Promise<Completion[]> {
    return Array.from(this.completions.values())
      .filter(c => c.habitId === habitId)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }

  async createCompletion(insertCompletion: InsertCompletion): Promise<Completion> {
    const id = randomUUID();
    const completion: Completion = {
      id,
      habitId: insertCompletion.habitId,
      completedAt: insertCompletion.completedAt,
    };
    this.completions.set(id, completion);
    return completion;
  }

  async deleteCompletion(habitId: string, date: string): Promise<boolean> {
    const completion = Array.from(this.completions.values())
      .find(c => c.habitId === habitId && c.completedAt === date);
    
    if (completion) {
      return this.completions.delete(completion.id);
    }
    return false;
  }

  async getCompletionByHabitAndDate(habitId: string, date: string): Promise<Completion | undefined> {
    return Array.from(this.completions.values())
      .find(c => c.habitId === habitId && c.completedAt === date);
  }
}

export const storage = new MemStorage();
