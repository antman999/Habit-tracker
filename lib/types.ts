import type { Habit as DrizzleHabit } from "./schema";

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export type CreateHabitState = {
  errors?: {
    name?: string[];
    description?: string[];
    goal?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export interface HabitWithCompletions extends DrizzleHabit {
  completions: string[];
}

export interface HabitWithDetailsAndCompletions extends DrizzleHabit {
  currentStreak: number;
  longestStreak: number;
  completionDatesISO: string[];
}

export interface CategorizedHabitData {
  activeHabits: HabitWithCompletions[];
  archivedHabits: HabitWithCompletions[];
}

export type DrizzleCompletionSelection = {
  habitId: string;
  date: string | null;
};
