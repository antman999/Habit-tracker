import { Layout } from "@/components/layout/layout";
import { NewHabitForm } from "@/components/new-habit-form/NewHabitForm";
import { getCurrentWeekDatesFormatted } from "@/lib/dateUtils";
import React from "react";

export default function Home() {
  const datesOfWeek = getCurrentWeekDatesFormatted();
  const numberOfDateColumns = datesOfWeek.length;
  const totalColumns = 1 + numberOfDateColumns; // 1 for Habit name + dates
  const habits = [
    { id: 1, name: "Drink Water" },
    { id: 2, name: "Exercise" },
    { id: 3, name: "Read Book" },
  ];
  return (
    <Layout>
      <div className="">
        <NewHabitForm />
      </div>
      <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
        <div
          className={`grid grid-cols-${totalColumns} gap-x-2 gap-y-4 items-center text-center`}
          // Example: If datesOfWeek.length is 7, this becomes grid-cols-8
        >
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
          {habits.map((habit) => (
            <React.Fragment key={habit.id}>
              <div className="text-left py-2 pl-2">{habit.name}</div>
              {datesOfWeek.map((day, index) => (
                <div
                  key={`${habit.id}-${index}`}
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
                  "
                    aria-label={`Mark ${habit.name} complete for ${day}`}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        {habits.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No habits added yet. Use the form above to add one!
          </p>
        )}
      </div>
    </Layout>
  );
}
