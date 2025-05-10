"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeekDate {
  display: string;
  iso: string;
  dayInitial: string;
  dayNumber: string;
}

interface HabitWithCompletions {
  id: string;
  name: string;
  completions: string[];
}

interface MobileHabitItemProps {
  habit: HabitWithCompletions;
  datesOfWeek: WeekDate[];
  isPending: boolean;
  onToggleCompletion: (
    habitId: string,
    date: string,
    currentCheckedStatus: boolean
  ) => void;
}

export function MobileHabitItem({
  habit,
  datesOfWeek,
  isPending,
  onToggleCompletion,
}: MobileHabitItemProps) {
  return (
    <TooltipProvider>
      <div className="py-4 border-b border-gray-200 dark:border-neutral-800 last:border-b-0">
        <Link
          href={`/habits/${habit.id}`}
          className="flex justify-between items-center mb-3 group"
        >
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span className="font-semibold text-base text-gray-800 dark:text-neutral-200 truncate group-hover:text-primary transition-colors">
                {habit.name}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p>{habit.name}</p>
            </TooltipContent>
          </Tooltip>
          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500 group-hover:text-primary transition-colors" />
        </Link>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {datesOfWeek.map((day) => (
            <div
              key={`header-${day.iso}`}
              className="text-xs text-muted-foreground"
            >
              <div>{day.dayInitial}</div>
              <div className="font-medium">{day.dayNumber}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {datesOfWeek.map((day) => {
            const isCompleted = habit.completions.includes(day.iso);
            return (
              <div
                key={`checkbox-${habit.id}-${day.iso}`}
                className="flex justify-center items-center h-8"
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
                    onToggleCompletion(habit.id, day.iso, isCompleted)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
