import { db } from "@/lib/db";
import { Habit } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import "server-only";

export async function fetchHabitById(id: number): Promise<Habit | null> {
  if (isNaN(id)) {
    console.error("Invalid habit ID provided:", id);
    return null;
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    const data = await db.query.Habit.findFirst({
      where: and(eq(Habit.id, id), eq(Habit.userId, userId)),
    });

    return data ?? null;
  } catch (error) {
    console.error("Database Error fetching habit by ID:", error);
    return null;
  }
}
