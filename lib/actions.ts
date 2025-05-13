"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Habit, NewHabit, Completion } from "@/lib/schema";
import { eq, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

const UpdateArchivedStatusSchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  is_archived: z.boolean(),
});

const DeleteHabitSchema = z.object({
  habitId: z.string().uuid({ message: "Invalid Habit ID format." }),
});

const goalValues = ["7", "14", "30"] as const;

const HabitFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not exceed 50 characters." })
    .trim(),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." })
    .max(150, { message: "Description must not exceed 150 characters." })
    .trim()
    .optional()
    .or(z.literal("")),
  goal: z.enum(goalValues).optional().or(z.literal("")),
});
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
    console.log(
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
      description: description || null,
      goal: goal || null,
      is_archived: false,
    };

    await db.insert(Habit).values(newHabitData);
  } catch (error) {
    console.error("Database Error (create habit):", error);
    return {
      errors: { _form: ["Database Error: Failed to create habit."] },
      message: "Database Error: Failed to create habit.",
    };
  }

  revalidatePath("/habits");
  return { message: `Habit "${name}" created successfully!` };
}

export async function toggleCompletionAction(
  habitId: string,
  date: string,
  completed: boolean
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized: Please sign in." };
  }
  if (!habitId || !date) {
    return { error: "Invalid input: Habit ID and date are required." };
  }

  try {
    const habit = await db.query.Habit.findFirst({
      where: and(eq(Habit.id, habitId), eq(Habit.userId, userId)),
      columns: { id: true },
    });
    if (!habit) {
      return { error: "Habit not found or you do not have permission." };
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
    revalidatePath(`/habits/${habitId}`);
    return {
      success: true,
      message: `Completion for ${date} ${completed ? "marked" : "unmarked"}.`,
    };
  } catch (error) {
    console.error("Database Error (toggle completion):", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown database error occurred.";
    return { error: `Database error: ${errorMessage}` };
  }
}

export async function updateHabitArchivedStatus(
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized: Please sign in to update habit status." };
  }
  const validatedFields = UpdateArchivedStatusSchema.safeParse({
    habitId: formData.get("habitId"),
    is_archived: formData.get("is_archived") === "true",
  });
  if (!validatedFields.success) {
    console.error(
      "Validation Error (update archived):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error: "Invalid input data. Please check the provided information.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { habitId, is_archived } = validatedFields.data;

  try {
    const habitToUpdate = await db
      .select({ id: Habit.id, userId: Habit.userId })
      .from(Habit)
      .where(eq(Habit.id, habitId))
      .limit(1);

    if (
      !habitToUpdate ||
      habitToUpdate.length === 0 ||
      habitToUpdate[0].userId !== userId
    ) {
      return {
        error: "Habit not found or you do not have permission to modify it.",
      };
    }
    await db
      .update(Habit)
      .set({ is_archived: is_archived })
      .where(eq(Habit.id, habitId));

    revalidatePath("/habits");
    revalidatePath(`/habits/${habitId}`);

    const actionMessage = `Habit successfully ${
      is_archived ? "archived" : "unarchived"
    }.`;
    console.log(actionMessage, `Habit ID: ${habitId}`);
    return { success: true, message: actionMessage };
  } catch (error) {
    console.error("Database Error (update archived):", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown database error occurred.";
    return { error: `Database error: ${errorMessage}` };
  }
}

export async function deleteHabitAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized: Please sign in." };
  }

  const validatedFields = DeleteHabitSchema.safeParse({
    habitId: formData.get("habitId"),
  });

  if (!validatedFields.success) {
    console.error(
      "Validation Error (delete):",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error:
        "Invalid input: " +
        (validatedFields.error.flatten().fieldErrors.habitId?.join(", ") ||
          "Habit ID is missing or invalid."),
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
      return {
        error: "Habit not found or you do not have permission to delete it.",
      };
    }
    await db
      .delete(Habit)
      .where(and(eq(Habit.id, habitId), eq(Habit.userId, userId)));
    console.log(`Habit ${habitId} deleted successfully by user ${userId}.`);
    revalidatePath("/habits");
    redirect("/habits");
  } catch (error) {
    console.error("Error during habit deletion:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string" &&
      (error.message === "NEXT_REDIRECT" ||
        ("digest" in error && error.digest === "NEXT_REDIRECT"))
    ) {
      throw error;
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown database error occurred.";
    return { error: `Database error: ${errorMessage}` };
  }
}
