"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { getCurrentWeekDatesFormatted } from "@/lib/dateUtils";
import { toggleCompletionAction } from "@/lib/actions";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HabitWithCompletions {
  id: number;
  userId: string;
  name: string;
  description: string | null;
  goal: string | null;
  createdAt: Date | string;
  completions: string[];
}

interface HabitGridProps {
  initialHabits: HabitWithCompletions[];
}

export function HabitGrid({ initialHabits }: HabitGridProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  const datesOfWeek = useMemo(() => getCurrentWeekDatesFormatted(), []);

  const handleCompletionToggle = (
    habitId: number,
    date: string,
    currentCheckedStatus: boolean
  ) => {
    const newCompletedStatus = !currentCheckedStatus;
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id === habitId) {
          let updatedCompletions;
          if (newCompletedStatus) {
            updatedCompletions = [...new Set([...habit.completions, date])];
          } else {
            updatedCompletions = habit.completions.filter((d) => d !== date);
          }
          return { ...habit, completions: updatedCompletions };
        }
        return habit;
      })
    );
    startTransition(async () => {
      try {
        const result = await toggleCompletionAction(
          habitId,
          date,
          newCompletedStatus
        );
        if (result?.error) {
          toast.error(`Failed to update habit: ${result.error}`);

          setHabits(initialHabits);
        } else {
          toast.success("Habit updated");
        }
      } catch (err) {
        toast.error("An unexpected error occurred.");
        console.error(err);
        setHabits(initialHabits);
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
        <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))_auto] gap-x-2 sm:gap-x-3 gap-y-6 items-center text-center">
          <div className="font-semibold text-left sticky top-0 bg-white dark:bg-neutral-900 py-2 pl-4 pr-2">
            Habit
          </div>
          {datesOfWeek.map((day) => (
            <div
              key={day.iso}
              className="font-semibold text-xs sm:text-sm sticky top-0 bg-white dark:bg-neutral-900 py-2"
            >
              {day.display}
            </div>
          ))}
          <div className="sticky top-0 py-2 pr-4"></div>
          {habits.length > 0 &&
            habits.map((habit) => (
              <React.Fragment key={habit.id}>
                <div className="text-left py-2 pl-4 pr-2 font-medium overflow-hidden max-w-20 sm:max-w-24 md:max-w-32">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/habits/${habit.id}`}
                        className="truncate hover:underline hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1 transition-colors block"
                      >
                        {habit.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{habit.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {datesOfWeek.map((day) => {
                  const isCompleted = habit.completions.includes(day.iso);

                  return (
                    <div
                      key={`${habit.id}-${day.iso}`}
                      className="flex justify-center items-center py-2"
                    >
                      <input
                        type="checkbox"
                        className="
                        appearance-none w-5 h-5 rounded
                        border-2 border-gray-300 dark:border-neutral-600
                        checked:bg-green-500 checked:border-green-500
                        dark:checked:bg-green-600 dark:checked:border-green-600
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400
                        dark:focus:ring-offset-neutral-900
                        cursor-pointer transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                        aria-label={`Mark ${habit.name} complete for ${day.display}`}
                        checked={isCompleted}
                        disabled={isPending}
                        onChange={() =>
                          handleCompletionToggle(habit.id, day.iso, isCompleted)
                        }
                      />
                    </div>
                  );
                })}
                <div className="flex justify-center items-center py-2 pr-4">
                  <Link
                    href={`/habits/${habit.id}`}
                    aria-label={`View details for ${habit.name}`}
                    className="p-1 text-gray-400 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary rounded transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </React.Fragment>
            ))}
        </div>
        {habits.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No habits added yet. Use the form above to add one!
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}
