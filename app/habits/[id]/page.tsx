import { notFound } from "next/navigation";
import { fetchHabitDetails } from "@/lib/data";
import { HabitWithDetailsAndCompletions } from "@/lib/types";
import { HabitCalendar } from "@/components/habit-calendar/HabitCalendar";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HabitProgressChart } from "@/components/habit-progress-chart/HabitProgressChart";
import { HabitActionsDropdown } from "@/components/HabitActionsDropdown";

interface AsyncPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: AsyncPageProps): Promise<Metadata> {
  const routeParams = await params;

  const id: string = routeParams.id;

  if (!id) return { title: "Invalid Habit ID" };

  const habit = await fetchHabitDetails(id);

  return {
    title: habit ? `Habit: ${habit.name}` : "Habit Not Found",
  };
}

export default async function Page({ params }: AsyncPageProps) {
  const routeParams = await params;
  const id: string = routeParams.id;
  if (!id) {
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

  const goalDays = goal ? parseInt(goal, 10) : null;

  return (
    <main className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-card text-card-foreground rounded-xl shadow-md border border-border">
        <div className="mb-2 max-w-5xl mx-auto">
          <Link
            href="/habits"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-ring rounded-md px-2 py-1 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent pr-4">
            {name}
          </h1>
          <HabitActionsDropdown
            habitId={habitDetails.id}
            isArchived={habitDetails.is_archived}
            habitName={name}
          />
        </div>
        <div
          className={`grid grid-cols-1 ${
            goalDays && goalDays > 0 ? "md:grid-cols-3" : ""
          } gap-6 md:gap-8 mb-8`}
        >
          <div
            className={`space-y-4 text-sm sm:text-base ${
              goalDays && goalDays > 0 ? "md:col-span-2" : "md:col-span-3"
            }`}
          >
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Description
              </h3>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-foreground mb-2">Stats</h3>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Streak:</span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md font-medium">
                    {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Longest Streak:</span>
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-md font-medium">
                    {longestStreak} Day{longestStreak !== 1 ? "s" : ""}
                  </span>
                </div>
                {goalDays !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Goal:</span>
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-md font-medium">
                      {goalDays} Days
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-muted-foreground ml-1">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {goalDays !== null && goalDays > 0 && (
            <div className="md:col-span-1 flex flex-col items-center md:items-start justify-start md:pt-0">
              <h2 className="text-xl font-semibold mb-2 text-center md:text-left text-foreground">
                Goal Progress
              </h2>
              <HabitProgressChart
                completedCount={completionDatesISO.length}
                goalCount={goalDays}
                habitName={name}
              />
            </div>
          )}
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Completion Calendar
          </h2>
          <HabitCalendar
            habitCreatedAt={createdAt}
            completionDatesISO={completionDatesISO}
          />
        </div>
      </div>
    </main>
  );
}
