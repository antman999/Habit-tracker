"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Habit, NewHabit, Completion } from "@/lib/schema";
import { eq, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CreateHabitState = {
  errors?: {
    name?: string[];
    description?: string[];
    goal?: string[];
    _form?: string[];
  };
  message?: string | null;
};

const goalValues = ["7", "14", "30"] as const;

const HabitFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50)
    .trim(),
  description: z.string().min(2).max(150).trim().optional(),
  goal: z.enum(goalValues).optional(),
});

const MAX_HABITS_PER_USER = 6;

export async function createHabitAction(
  prevState: CreateHabitState,
  formData: FormData
): Promise<CreateHabitState> {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized: Please sign in." };
  }

  const validatedFields = HabitFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    goal: formData.get("goal"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to create habit.",
    };
  }

  const { name, description, goal } = validatedFields.data;

  try {
    const userHabits = await db
      .select({ value: count() })
      .from(Habit)
      .where(eq(Habit.userId, userId));
    const habitCount = userHabits[0]?.value ?? 0;

    if (habitCount >= MAX_HABITS_PER_USER) {
      return {
        errors: { _form: [`Habit limit (${MAX_HABITS_PER_USER}) reached.`] },
        message: "Failed to create habit.",
      };
    }

    const newHabitData: NewHabit = {
      userId: userId,
      name: name,
      description: description,
      goal: goal,
    };

    await db.insert(Habit).values(newHabitData);
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create habit.",
    };
  }

  revalidatePath("/habits");

  return { message: `Habit "${name}" created successfully!` };
}

export async function toggleCompletionAction(
  habitId: number,
  date: string,
  completed: boolean
): Promise<{ success?: boolean; error?: string }> {
  "use server";

  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const habit = await db.query.Habit.findFirst({
      where: and(eq(Habit.id, habitId), eq(Habit.userId, userId)),
      columns: { id: true },
    });

    if (!habit) {
      return { error: "Habit not found or permission denied." };
    }
    if (completed) {
      await db
        .insert(Completion)
        .values({ habitId: habitId, date: date })
        .onConflictDoNothing({ target: [Completion.habitId, Completion.date] });
    } else {
      await db
        .delete(Completion)
        .where(and(eq(Completion.habitId, habitId), eq(Completion.date, date)));
    }

    revalidatePath("/habits");
    return { success: true };
  } catch (error) {
    console.error("Error toggling completion:", error);
    return { error: "Database error occurred." };
  }
}
