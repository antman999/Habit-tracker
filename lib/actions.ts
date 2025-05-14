"use server";

import { db } from "@/lib/db";
import { Habit, NewHabit, Completion } from "@/lib/schema";
import type { ActionState, CreateHabitState } from "@/lib/types";
import {
  HabitFormSchema,
  UpdateArchivedStatusSchema,
  DeleteHabitSchema,
  UuidSchema,
} from "@/lib/validationSchemas";
import { auth } from "@clerk/nextjs/server";
import { eq, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_HABITS_PER_USER = 6;

export async function createHabitAction(
  prevState: CreateHabitState,
  formData: FormData
): Promise<CreateHabitState> {
  const { userId } = await auth();
  if (!userId) {
    return { errors: { _form: ["Unauthorized: Please sign in."] } };
  }

  const validatedFields = HabitFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    goal: formData.get("goal") || undefined,
  });

  if (!validatedFields.success) {
    console.warn(
      "Validation Errors (create habit):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to create habit.",
    };
  }

  const { name, description, goal } = validatedFields.data;

  try {
    const habitCountResult = await db
      .select({ value: count() })
      .from(Habit)
      .where(eq(Habit.userId, userId));
    const habitCount = habitCountResult[0]?.value ?? 0;

    if (habitCount >= MAX_HABITS_PER_USER) {
      return {
        errors: { _form: [`Habit limit (${MAX_HABITS_PER_USER}) reached.`] },
        message: "Failed to create habit: Limit reached.",
      };
    }

    const newHabitData: NewHabit = {
      userId: userId,
      name: name,
      description: description || null,
      goal: goal || null,
      is_archived: false,
    };

    await db.insert(Habit).values(newHabitData);
    revalidatePath("/habits");
    return { message: `Habit "${name}" created successfully!` };
  } catch (dbError) {
    console.error("Database Error (create habit):", dbError);
    return {
      errors: { _form: ["Database Error: Failed to create habit."] },
      message: "A database error occurred.",
    };
  }
}

export async function toggleCompletionAction(
  habitId: string,
  date: string,
  completed: boolean
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized: Please sign in." };

  if (!habitId || !date) {
    return { error: "Invalid input: Habit ID and date are required." };
  }
  const habitIdValidation = UuidSchema.safeParse(habitId);
  if (!habitIdValidation.success) return { error: "Invalid Habit ID format." };

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
        .onConflictDoNothing({
          target: [Completion.habitId, Completion.date],
        });
    } else {
      await db
        .delete(Completion)
        .where(and(eq(Completion.habitId, habitId), eq(Completion.date, date)));
    }

    revalidatePath("/habits");
    revalidatePath(`/habits/${habitId}`);
    return {
      success: true,
      message: `Completion for ${date} ${completed ? "marked" : "unmarked"}.`,
    };
  } catch (dbError) {
    console.error("Database Error (toggle completion):", dbError);
    return { error: "Database error while toggling completion." };
  }
}

export async function updateHabitArchivedStatus(
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized." };

  const rawData = {
    habitId: formData.get("habitId"),
    is_archived: formData.get("is_archived") === "true",
  };

  const validatedFields = UpdateArchivedStatusSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.warn(
      "Validation Error (update archived):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { habitId, is_archived } = validatedFields.data;

  try {
    const habitToUpdate = await db.query.Habit.findFirst({
      where: and(eq(Habit.id, habitId), eq(Habit.userId, userId)),
      columns: { id: true },
    });

    if (!habitToUpdate) {
      return { error: "Habit not found or permission denied." };
    }

    await db
      .update(Habit)
      .set({ is_archived: is_archived })
      .where(and(eq(Habit.id, habitId), eq(Habit.userId, userId)));

    revalidatePath("/habits");
    revalidatePath(`/habits/${habitId}`);
    const actionMessage = `Habit successfully ${
      is_archived ? "archived" : "unarchived"
    }.`;
    return { success: true, message: actionMessage };
  } catch (dbError) {
    console.error("Database Error (update archived):", dbError);
    return { error: "Database error while updating habit status." };
  }
}

export async function deleteHabitAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized." };

  const validatedFields = DeleteHabitSchema.safeParse({
    habitId: formData.get("habitId"),
  });

  if (!validatedFields.success) {
    console.warn(
      "Validation Error (delete habit):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error: "Invalid habit ID.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { habitId } = validatedFields.data;

  try {
    const habitToDelete = await db.query.Habit.findFirst({
      where: and(eq(Habit.id, habitId), eq(Habit.userId, userId)),
      columns: { id: true },
    });

    if (!habitToDelete) {
      return { error: "Habit not found or permission denied." };
    }

    const deleteResult = await db
      .delete(Habit)
      .where(and(eq(Habit.id, habitId), eq(Habit.userId, userId)))
      .returning({ id: Habit.id });

    if (deleteResult.length === 0) {
      return {
        error:
          "Failed to delete habit, it might have been already removed or permission issue.",
      };
    }

    console.log(`Habit ${habitId} deleted successfully by user ${userId}.`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (dbError: any) {
    if (
      dbError.message === "NEXT_REDIRECT" ||
      dbError.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw dbError;
    }
    console.error("Error during habit deletion:", dbError);
    return { error: "Database error during habit deletion." };
  }

  revalidatePath("/habits");
  redirect("/habits");
}
