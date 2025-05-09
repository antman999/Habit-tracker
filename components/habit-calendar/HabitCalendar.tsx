"use client";
import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { startOfMonth } from "date-fns";
import { groupConsecutiveDates } from "@/lib/dateUtils";

interface HabitCalendarProps {
  habitCreatedAt: Date | string;
  completionDatesISO: string[];
}

export function HabitCalendar({
  habitCreatedAt,
  completionDatesISO,
}: HabitCalendarProps) {
  const createdAtDate = useMemo(
    () => new Date(habitCreatedAt),
    [habitCreatedAt]
  );
  const startMonth = useMemo(
    () => startOfMonth(createdAtDate),
    [createdAtDate]
  );
  const dateGroups = useMemo(
    () => groupConsecutiveDates(completionDatesISO),
    [completionDatesISO]
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(startMonth);

  const modifiers = {
    completed_single: dateGroups.single,
    completed_start: dateGroups.start,
    completed_middle: dateGroups.middle,
    completed_end: dateGroups.end,
  };

  const baseCompletedClass = `text-white dark:text-black`;
  const focusRingClass = `focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 dark:focus:ring-offset-neutral-900`;
  const bgClass = `bg-green-500/90 dark:bg-green-400`;

  const modifiersClassNames = {
    completed_single: cn(
      baseCompletedClass,
      focusRingClass,
      bgClass,
      `rounded-md`
    ),
    completed_start: cn(
      baseCompletedClass,
      focusRingClass,
      bgClass,
      `rounded-none rounded-l-md`
    ),
    completed_middle: cn(
      baseCompletedClass,
      focusRingClass,
      bgClass,
      `rounded-none`
    ),
    completed_end: cn(
      baseCompletedClass,
      focusRingClass,
      bgClass,
      `rounded-none rounded-r-md`
    ),
  };

  return (
    <div className="w-full flex justify-center">
      <Calendar
        mode="multiple"
        selected={undefined}
        defaultMonth={startMonth}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        fromMonth={startMonth}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        showOutsideDays
        fixedWeeks
        className="p-0 "
        classNames={{
          months: "w-full",
          month: "w-full space-y-4",
          table: "w-full border-collapse",
          head_row: "flex justify-around w-full",
          head_cell:
            "text-muted-foreground rounded-md w-14 font-normal text-[0.8rem]",
          row: "flex w-full mt-2 justify-around",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20", // Base cell styles from shadcn default
          day: "h-10 w-14 p-0 font-normal aria-selected:opacity-100",
          day_selected: "",
          day_range_start: "",
          day_range_end: "",
          day_range_middle: "",
          day_disabled: "text-neutral-400 dark:text-neutral-600 opacity-50",
          day_outside: "text-muted-foreground opacity-50",
          button:
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        }}
        disabled={(date) => date < startOfMonth(createdAtDate)}
      />
    </div>
  );
}
