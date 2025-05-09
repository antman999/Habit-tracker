import { notFound } from "next/navigation";
import { fetchHabitDetails, HabitWithDetailsAndCompletions } from "@/lib/data";
import { HabitCalendar } from "@/components/habit-calendar/HabitCalendar";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeleteHabitButton } from "@/components/DeleteHabitButton";

interface AsyncPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: AsyncPageProps): Promise<Metadata> {
  const routeParams = await params;

  const id = parseInt(routeParams.id, 10);

  if (isNaN(id)) {
    return { title: "Invalid Habit ID" };
  }

  const habit = await fetchHabitDetails(id);

  return {
    title: habit ? `Habit: ${habit.name}` : "Habit Not Found",
  };
}

export default async function Page({ params }: AsyncPageProps) {
  const routeParams = await params;
  const id = parseInt(routeParams.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const habitDetails: HabitWithDetailsAndCompletions | null =
    await fetchHabitDetails(id);

  if (!habitDetails) {
    notFound();
  }

  const {
    name,
    description,
    goal,
    createdAt,
    currentStreak,
    longestStreak,
    completionDatesISO,
  } = habitDetails;

  return (
    <main className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
        <Link
          href="/habits"
          className="inline-flex items-center gap-2 mb-2 -mt-2 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-ring rounded-md px-2 py-1 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            {name}
          </h1>
          <DeleteHabitButton habitId={id} habitName={name} />
        </div>
        <div className="space-y-3 mb-6 text-base">
          {description && (
            <div className="mb-6">
              <span className="font-medium text-gray-800 dark:text-neutral-200">
                Description:
              </span>
              <p className="text-gray-600 dark:text-neutral-400">
                {description}
              </p>
            </div>
          )}
          {goal && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
              <div>
                <span className="font-medium text-gray-800 dark:text-neutral-200">
                  Goal:
                </span>
                <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-md">
                  {goal} Days
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-800 dark:text-neutral-200">
                  Current Streak:
                </span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md">
                  {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-800 dark:text-neutral-200">
                  Longest Streak:
                </span>
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-md">
                  {longestStreak} Day{longestStreak !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-800 dark:text-neutral-200">
              Created:
            </span>
            <span className="text-gray-600 dark:text-neutral-400 ml-1">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-neutral-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Completion Calendar</h2>
          <HabitCalendar
            habitCreatedAt={createdAt}
            completionDatesISO={completionDatesISO}
          />
        </div>
      </div>
    </main>
  );
}
