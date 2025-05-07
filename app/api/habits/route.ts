import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Habit, NewHabit, Completion } from "@/lib/schema";
import { eq, count, inArray, asc } from "drizzle-orm";
import { z } from "zod";

const MAX_HABITS_PER_USER = 6;
const goalValues = ["7", "14", "30"] as const;

const backendSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  description: z.string().min(2).max(150).trim().optional(),
  goal: z.enum(goalValues).optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const validationResult = backendSchema.safeParse(body);

    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid input",
          details: validationResult.error.flatten(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, description, goal } = validationResult.data;

    const userHabits = await db
      .select({ value: count() })
      .from(Habit)
      .where(eq(Habit.userId, userId));

    const habitCount = userHabits[0]?.value ?? 0;

    if (habitCount >= MAX_HABITS_PER_USER) {
      return new NextResponse(
        JSON.stringify({
          error: `You cannot create more than ${MAX_HABITS_PER_USER} habits.`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newHabitData: NewHabit = {
      userId: userId,
      name: name,
      description: description,
      goal: goal,
    };
    const insertedHabits = await db
      .insert(Habit)
      .values(newHabitData)
      .returning();

    if (insertedHabits.length === 0) {
      throw new Error("Failed to insert habit and get the returned record.");
    }

    const createdHabit = insertedHabits[0];

    return new NextResponse(JSON.stringify(createdHabit), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[API_HABITS_POST] Error creating habit:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
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
        .select({
          habitId: Completion.habitId,
          date: Completion.date,
        })
        .from(Completion)
        .where(inArray(Completion.habitId, habitIds));

      completionsMap = relevantCompletions.reduce((acc, comp) => {
        if (!acc[comp.habitId]) {
          acc[comp.habitId] = [];
        }

        if (typeof comp.date === "string") {
          acc[comp.habitId].push(comp.date);
        } else {
          console.warn(
            `Completion date for habit ${comp.habitId} is not a string:`,
            comp.date
          );
        }
        return acc;
      }, {} as Record<number, string[]>);
    }

    const habitsWithCompletions = userHabits.map((habit) => ({
      ...habit,
      completions: completionsMap[habit.id] || [],
    }));

    return NextResponse.json(habitsWithCompletions, { status: 200 });
  } catch (error) {
    console.error("[API_HABITS_GET] Error fetching habits:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
