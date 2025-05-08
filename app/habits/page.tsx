import React, { Suspense } from "react";
import { NewHabitForm } from "@/components/new-habit-form/NewHabitForm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Habit, Completion } from "@/lib/schema";
import { eq, inArray, asc } from "drizzle-orm";
import { HabitGridSkeleton } from "@/components/habit-grid/HabitGridSkeleton";
import { HabitGrid } from "@/components/habit-grid/HabitGrid";

interface HabitWithCompletions {
  id: number;
  userId: string;
  name: string;
  description: string | null;
  goal: string | null;
  createdAt: Date;
  completions: string[];
}

async function fetchHabitsDataForUser(): Promise<HabitWithCompletions[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: User must be signed in to view habits.");
  }

  const userHabits = await db
    .select()
    .from(Habit)
    .where(eq(Habit.userId, userId))
    .orderBy(asc(Habit.createdAt));

  let completionsMap: Record<number, string[]> = {};
  if (userHabits.length > 0) {
    const habitIds = userHabits.map((h) => h.id);
    const relevantCompletions = await db
      .select({ habitId: Completion.habitId, date: Completion.date })
      .from(Completion)
      .where(inArray(Completion.habitId, habitIds));

    completionsMap = relevantCompletions.reduce((acc, comp) => {
      if (!acc[comp.habitId]) acc[comp.habitId] = [];
      if (typeof comp.date === "string") acc[comp.habitId].push(comp.date);
      return acc;
    }, {} as Record<number, string[]>);
  }

  const habitsWithCompletions = userHabits.map((habit) => ({
    ...habit,
    createdAt: new Date(habit.createdAt),
    completions: completionsMap[habit.id] || [],
  }));

  return habitsWithCompletions;
}

export default async function HabitsPage() {
  const habitsData = await fetchHabitsDataForUser();

  return (
    <>
      <NewHabitForm />
      <Suspense fallback={<HabitGridSkeleton />}>
        <HabitGrid initialHabits={habitsData} />
      </Suspense>
    </>
  );
}
