import React, { Suspense } from "react";
import { NewHabitForm } from "@/components/new-habit-form/NewHabitForm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  Habit as HabitTable,
  Completion as CompletionTable,
} from "@/lib/schema";
import { eq, inArray, asc } from "drizzle-orm";
import { HabitGridSkeleton } from "@/components/habit-grid/HabitGridSkeleton";
import { HabitGrid } from "@/components/habit-grid/HabitGrid";
import { ArchivedHabitList } from "@/components/habit-grid/ArchivedHabitList";

interface HabitWithCompletions {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  goal: string | null;
  createdAt: Date;
  completions: string[];
  is_archived: boolean;
}

type DrizzleHabit = typeof HabitTable.$inferSelect;
type DrizzleCompletionSelection = { habitId: string; date: string | null };

async function fetchHabitsDataForUser(): Promise<HabitWithCompletions[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: User must be signed in to view habits.");
  }

  const userHabits: DrizzleHabit[] = await db
    .select()
    .from(HabitTable)
    .where(eq(HabitTable.userId, userId))
    .orderBy(asc(HabitTable.createdAt));

  let completionsMap: Record<string, string[]> = {};
  if (userHabits.length > 0) {
    const habitIds: string[] = userHabits.map((h) => h.id);
    const relevantCompletions: DrizzleCompletionSelection[] = await db
      .select({ habitId: CompletionTable.habitId, date: CompletionTable.date })
      .from(CompletionTable)
      .where(inArray(CompletionTable.habitId, habitIds));

    completionsMap = relevantCompletions.reduce(
      (acc: Record<string, string[]>, comp: DrizzleCompletionSelection) => {
        const key: string = comp.habitId;
        if (!acc[key]) {
          acc[key] = [];
        }
        if (typeof comp.date === "string") {
          acc[key].push(comp.date);
        }
        return acc;
      },
      {} as Record<string, string[]>
    );
  }

  const habitsWithCompletions: HabitWithCompletions[] = userHabits.map(
    (habit: DrizzleHabit): HabitWithCompletions => {
      const key: string = habit.id;
      return {
        ...habit,
        id: habit.id,
        createdAt: habit.createdAt,
        description: habit.description ?? null,
        goal: habit.goal ?? null,
        completions: completionsMap[key] || [],
      };
    }
  );

  return habitsWithCompletions;
}

export default async function HabitsPage() {
  const allHabitsData: HabitWithCompletions[] = await fetchHabitsDataForUser();

  const activeHabits = allHabitsData.filter((habit) => !habit.is_archived);
  const archivedHabits = allHabitsData.filter((habit) => habit.is_archived);

  return (
    <>
      <NewHabitForm />
      <Suspense fallback={<HabitGridSkeleton />}>
        <HabitGrid initialHabits={activeHabits} />
      </Suspense>
      {archivedHabits.length > 0 && (
        <ArchivedHabitList habits={archivedHabits} />
      )}
    </>
  );
}
