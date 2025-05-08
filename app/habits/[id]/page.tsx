import { notFound } from "next/navigation";
import { fetchHabitById } from "@/lib/data";
import type { Metadata } from "next";

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

  const habit = await fetchHabitById(id);

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

  const habit = await fetchHabitById(id);

  if (!habit) {
    notFound();
  }

  return (
    <main className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
        <h1 className="text-2xl font-semibold mb-4">{habit.name}</h1>
        {habit.description && (
          <p className="text-gray-700 dark:text-neutral-300 mb-2">
            <span className="font-medium">Description:</span>{" "}
            {habit.description}
          </p>
        )}
        {habit.goal && (
          <p className="text-gray-700 dark:text-neutral-300 mb-4">
            <span className="font-medium">Goal:</span> {habit.goal} Days
          </p>
        )}

        <div className="mt-6 border-t border-gray-200 dark:border-neutral-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Completion Calendar</h2>
          <p className="text-gray-500 dark:text-neutral-400"></p>
        </div>
      </div>
    </main>
  );
}
