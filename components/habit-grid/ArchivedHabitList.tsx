import Link from "next/link";
import { History, ChevronRight } from "lucide-react";
interface HabitWithCompletions {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  goal: string | null;
  createdAt: Date | string;
  completions: string[];
  is_archived: boolean;
}

interface ArchivedHabitListProps {
  habits: HabitWithCompletions[];
}

export function ArchivedHabitList({ habits }: ArchivedHabitListProps) {
  if (!habits || habits.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-4 p-4 sm:p-6 md:p-8 bg-card dark:bg-neutral-900/50 rounded-xl shadow-lg border border-border dark:border-neutral-700/50">
      <h2 className="text-xl font-semibold tracking-tight mb-4 text-muted-foreground">
        Archived Habits
      </h2>

      <div className="space-y-3">
        {habits.map((habit) => (
          <Link href={`/habits/${habit.id}`} key={habit.id}>
            <div
              className={
                "block py-4 sm:px-4 rounded-lg transition-all duration-200 ease-in-out " +
                "bg-background/50 hover:bg-muted/60 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/60 " +
                "border border-transparent hover:border-primary/30 " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                "group"
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    <h3 className="text-md font-medium text-foreground group-hover:text-primary truncate transition-colors">
                      {habit.name}
                    </h3>
                  </div>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground/80 mt-1 truncate">
                      {habit.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground/60">
                Goal: {habit.goal ? `${habit.goal} Days` : "No set days"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
