import { db } from "@/lib/db";
import { Habit, Completion } from "@/lib/schema";
import { eq, and, asc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import "server-only";
import { format, parseISO, differenceInDays, subDays } from "date-fns";

function formatToYYYYMMDD(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function calculateCurrentStreak(completionDateStrings: string[]): number {
  if (!completionDateStrings.length) return 0;

  const completionSet = new Set(completionDateStrings);
  let currentStreak = 0;
  let checkDate = new Date();
  while (completionSet.has(formatToYYYYMMDD(checkDate))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }
  return currentStreak;
}

function calculateLongestStreak(completionDateStrings: string[]): number {
  if (!completionDateStrings.length) return 0;
  const dates = completionDateStrings
    .map((iso) => parseISO(iso))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 1;

  longestStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    if (differenceInDays(dates[i], dates[i - 1]) === 1) {
      currentStreak++;
    } else if (differenceInDays(dates[i], dates[i - 1]) > 1) {
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }
  return longestStreak;
}

export interface HabitWithDetailsAndCompletions extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionDatesISO: string[];
}

export async function fetchHabitDetails(
  id: number
): Promise<HabitWithDetailsAndCompletions | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (isNaN(id)) return null;

  try {
    const habit = await db.query.Habit.findFirst({
      where: and(eq(Habit.id, id), eq(Habit.userId, userId)),
    });

    if (!habit) {
      return null;
    }

    const completions = await db
      .select({ date: Completion.date })
      .from(Completion)
      .where(eq(Completion.habitId, id))
      .orderBy(asc(Completion.date));

    const completionDateStrings = completions.map((c) => c.date);
    const currentStreak = calculateCurrentStreak(completionDateStrings);
    const longestStreak = calculateLongestStreak(completionDateStrings);

    return {
      ...habit,
      currentStreak,
      longestStreak,
      completionDatesISO: completionDateStrings,
    };
  } catch (error) {
    console.error("Database Error fetching habit details:", error);
    return null;
  }
}

// export async function fetchCompletionsForHabit(
//   habitId: number
// ): Promise<string[]> {
//   if (isNaN(habitId)) {
//     console.error(
//       "Invalid habit ID provided for fetching completions:",
//       habitId
//     );
//     return [];
//   }

//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return [];
//     }

//     const habitOwnerCheck = await db.query.Habit.findFirst({
//       columns: { id: true },
//       where: and(eq(Habit.id, habitId), eq(Habit.userId, userId)),
//     });

//     if (!habitOwnerCheck) {
//       return [];
//     }

//     const completions = await db
//       .select({
//         date: Completion.date,
//       })
//       .from(Completion)
//       .where(eq(Completion.habitId, habitId))
//       .orderBy(asc(Completion.date));

//     return completions.map((c) => c.date);
//   } catch (error) {
//     console.error(
//       `Database Error fetching completions for habit ${habitId}:`,
//       error
//     );
//     return [];
//   }
// }
