import {
  pgTable,
  uuid,
  serial,
  text,
  timestamp,
  date,
  uniqueIndex,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const Habit = pgTable(
  "habits",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    goal: text("goal"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("habits_user_id_idx").on(table.userId)]
);

export const Completion = pgTable(
  "completions",
  {
    id: serial("id").primaryKey(),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => Habit.id, { onDelete: "cascade" }),
    date: date("date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.habitId],
      foreignColumns: [Habit.id],
      name: "completions_habit_id_fk",
    }).onDelete("cascade"),
    uniqueIndex("completions_habit_id_date_unq").on(table.habitId, table.date),
    index("completions_habit_id_idx").on(table.habitId),
    index("completions_date_idx").on(table.date),
  ]
);

export type Habit = typeof Habit.$inferSelect;
export type NewHabit = typeof Habit.$inferInsert;
export type Completion = typeof Completion.$inferSelect;
export type NewCompletion = typeof Completion.$inferInsert;
