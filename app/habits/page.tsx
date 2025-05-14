import React, { Suspense } from "react";
import { NewHabitForm } from "@/components/new-habit-form/NewHabitForm";
import { fetchHabitsDataForUser } from "@/lib/data";
import { CategorizedHabitData } from "@/lib/types";
import { HabitGridSkeleton } from "@/components/habit-grid/HabitGridSkeleton";
import { HabitGrid } from "@/components/habit-grid/HabitGrid";
import { ArchivedHabitList } from "@/components/habit-grid/ArchivedHabitList";

export default async function HabitsPage() {
  const { activeHabits, archivedHabits }: CategorizedHabitData =
    await fetchHabitsDataForUser();

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
