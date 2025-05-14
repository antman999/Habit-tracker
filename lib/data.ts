import "server-only";
import { db } from "@/lib/db";
import {
  Habit as HabitTable,
  Completion as CompletionTable,
} from "@/lib/schema";
import type {
  HabitWithCompletions,
  CategorizedHabitData,
  HabitWithDetailsAndCompletions,
  DrizzleCompletionSelection,
} from "@/lib/types";
import { UuidSchema } from "@/lib/validationSchemas";
import { eq, and, asc, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { parseISO, differenceInDays, subDays } from "date-fns";
import { formatToUTCIsoDateString } from "@/lib/dateUtils";

function calculateCurrentStreak(
  completionDateStrings: string[],
  utcDateFormatter: (date: Date) => string
): number {
  if (!completionDateStrings || completionDateStrings.length === 0) {
    return 0;
  }
  const completionSet = new Set(completionDateStrings);
  const serverNow = new Date();

  const serverTodayFormattedUTC = utcDateFormatter(serverNow);
  const serverYesterdayFormattedUTC = utcDateFormatter(subDays(serverNow, 1));

  let dateToStartCountingFrom: Date;
  if (completionSet.has(serverTodayFormattedUTC)) {
    dateToStartCountingFrom = serverNow;
  } else if (completionSet.has(serverYesterdayFormattedUTC)) {
    dateToStartCountingFrom = subDays(serverNow, 1);
  } else {
    return 0;
  }

  let currentStreak = 0;
  let checkDate = dateToStartCountingFrom;
  while (completionSet.has(utcDateFormatter(checkDate))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }
  return currentStreak;
}

function calculateLongestStreak(completionDateStrings: string[]): number {
  if (!completionDateStrings || completionDateStrings.length === 0) return 0;

  const dates = completionDateStrings
    .map((iso) => parseISO(iso))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const dayDiff = differenceInDays(dates[i], dates[i - 1]);
    if (dayDiff === 1) {
      currentStreak++;
    } else if (dayDiff > 1) {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }
  return longestStreak;
}

export async function fetchHabitsDataForUser(): Promise<CategorizedHabitData> {
  const { userId } = await auth();
  if (!userId) {
    return { activeHabits: [], archivedHabits: [] };
  }

  const userHabits = await db
    .select()
    .from(HabitTable)
    .where(eq(HabitTable.userId, userId))
    .orderBy(asc(HabitTable.createdAt));

  if (userHabits.length === 0) {
    return { activeHabits: [], archivedHabits: [] };
  }

  const habitIds: string[] = userHabits.map((h) => h.id);
  const relevantCompletions: DrizzleCompletionSelection[] = await db
    .select({ habitId: CompletionTable.habitId, date: CompletionTable.date })
    .from(CompletionTable)
    .where(inArray(CompletionTable.habitId, habitIds));

  const completionsMap = relevantCompletions.reduce<Record<string, string[]>>(
    (acc, comp) => {
      if (comp.date) {
        acc[comp.habitId] = acc[comp.habitId] || [];
        acc[comp.habitId].push(comp.date);
      }
      return acc;
    },
    {}
  );

  const categorizedData: CategorizedHabitData = {
    activeHabits: [],
    archivedHabits: [],
  };

  userHabits.forEach((habit) => {
    const habitWithCompletions: HabitWithCompletions = {
      ...habit,
      completions: completionsMap[habit.id] || [],
    };

    if (habitWithCompletions.is_archived) {
      categorizedData.archivedHabits.push(habitWithCompletions);
    } else {
      categorizedData.activeHabits.push(habitWithCompletions);
    }
  });

  return categorizedData;
}

export async function fetchHabitDetails(
  id: string
): Promise<HabitWithDetailsAndCompletions | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const validationResult = UuidSchema.safeParse(id);
  if (!validationResult.success) {
    console.warn(
      `WorkspaceHabitDetails: Invalid habit ID format: "${id}". Error: ${validationResult.error
        .flatten()
        .formErrors.join(", ")}`
    );
    return null;
  }
  const validHabitId = validationResult.data;

  try {
    const habit = await db.query.Habit.findFirst({
      where: and(
        eq(HabitTable.id, validHabitId),
        eq(HabitTable.userId, userId)
      ),
    });

    if (!habit) return null;

    const completions = await db
      .select({ date: CompletionTable.date })
      .from(CompletionTable)
      .where(eq(CompletionTable.habitId, validHabitId))
      .orderBy(asc(CompletionTable.date));

    const completionDateStrings = completions
      .map((c) => c.date)
      .filter((d): d is string => d !== null);

    const currentStreakVal = calculateCurrentStreak(
      completionDateStrings,
      formatToUTCIsoDateString
    );
    const longestStreakVal = calculateLongestStreak(completionDateStrings);

    return {
      ...habit,
      currentStreak: currentStreakVal,
      longestStreak: longestStreakVal,
      completionDatesISO: completionDateStrings,
    };
  } catch (error) {
    console.error(
      `WorkspaceHabitDetails: Database error for habit ID "${validHabitId}":`,
      error
    );
    return null;
  }
}
