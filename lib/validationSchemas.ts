import { z } from "zod";

export const UuidSchema = z
  .string()
  .uuid({ message: "Invalid ID format. Expected UUID." });
export const goalValues = ["7", "14", "30"] as const;
export const HabitFormSchema = z.object({
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

export const UpdateArchivedStatusSchema = z.object({
  habitId: UuidSchema,
  is_archived: z.boolean(),
});

export const DeleteHabitSchema = z.object({
  habitId: UuidSchema,
});
