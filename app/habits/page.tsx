"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NewHabitForm } from "@/components/new-habit-form/NewHabitForm";
import { getCurrentWeekDatesFormatted } from "@/lib/dateUtils";

interface HabitWithCompletions {
  id: number;
  userId: string;
  name: string;
  description: string | null;
  goal: string | null;
  createdAt: string;
  completions: string[];
}

export default function HabitsPage() {
  const datesOfWeek = getCurrentWeekDatesFormatted();
  const [habitsData, setHabitsData] = useState<HabitWithCompletions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/habits");
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const data: HabitWithCompletions[] = await response.json();
      setHabitsData(data);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setError(err instanceof Error ? err.message : "Failed to load habits.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCompletionToggle = (
    habitId: number,
    date: string,
    isCompleted: boolean
  ) => {
    console.log(
      `TODO: Toggle habit ${habitId} for date ${date} to ${
        isCompleted ? "complete" : "incomplete"
      }`
    );
    // This will involve another API call (e.g., POST or DELETE to /api/habits/:id/completions)
    // and potentially updating the local state optimistically or refetching.
  };

  return (
    <>
      <NewHabitForm onHabitCreated={fetchHabits} />
      <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
        {isLoading && <p className="text-center">Loading habits...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-8 gap-x-2 gap-y-4 items-center text-center">
            <div className="font-semibold text-left sticky top-0 bg-white dark:bg-neutral-900 py-2 pl-2">
              Habit
            </div>
            {datesOfWeek.map((day) => (
              <div
                key={day}
                className="font-semibold text-xs sm:text-sm sticky top-0 bg-white dark:bg-neutral-900 py-2"
              >
                {day}
              </div>
            ))}
            {habitsData.length > 0 &&
              habitsData.map((habit) => (
                <React.Fragment key={habit.id}>
                  <div className="text-left py-2 pl-2">{habit.name}</div>
                  {datesOfWeek.map((day, index) => {
                    const dateToCheck = "YYYY-MM-DD";

                    const isCompleted = habit.completions.includes(dateToCheck);
                    return (
                      <div
                        key={`${habit.id}-${index}`}
                        className="flex justify-center items-center py-2"
                      >
                        <input
                          type="checkbox"
                          aria-label={`Mark ${habit.name} complete for ${day}`}
                          checked={isCompleted}
                          onChange={(e) =>
                            handleCompletionToggle(
                              habit.id,
                              dateToCheck,
                              e.target.checked
                            )
                          }
                          className="
                    appearance-none w-5 h-5 rounded
                    border-2 border-gray-300 dark:border-neutral-600
                    checked:bg-green-500 checked:border-green-500
                    dark:checked:bg-green-600 dark:checked:border-green-600
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400
                    dark:focus:ring-offset-neutral-900
                    cursor-pointer transition-colors
                  "
                        />
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
          </div>
        )}
        {!isLoading && !error && habitsData.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No habits added yet. Use the form above to add one!
          </p>
        )}
      </div>
    </>
  );
}
