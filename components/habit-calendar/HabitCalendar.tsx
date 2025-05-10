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
    <div className="w-full overflow-hidden">
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
        className="p-0 w-full"
        classNames={{
          months: "w-full flex justify-center",
          month: "w-full space-y-2 sm:space-y-3",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-around",
          head_cell:
            "text-muted-foreground rounded-md font-normal text-[0.7rem] sm:text-[0.8rem] w-8 h-8 sm:w-10 sm:h-10 md:w-12 flex items-center justify-center",
          row: "flex w-full mt-1 sm:mt-2 justify-around",
          cell: "p-0 flex-1",
          day: "h-8 w-full sm:h-9 md:h-10 text-xs sm:text-sm p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring",
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
