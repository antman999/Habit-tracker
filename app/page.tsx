import { CheckIcon, SparklesIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col text-center px-4 pt-12">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
        Habit Tracker
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6">
        Track your habits, build consistency, achieve your goals.
      </p>

      <div className="text-left max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
          Key Features:
        </h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex items-center  gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-sm">
            <CheckIcon
              aria-hidden="true"
              className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1"
            />
            <span>
              <span className="font-semibold">Daily Tracking:</span> Easily mark
              habits as complete or incomplete each day.
            </span>
          </li>
          <li className="flex items-center  gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-sm">
            <CheckIcon
              aria-hidden="true"
              className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1"
            />
            <span>
              <span className="font-semibold">Streaks & Stats:</span> Visualize
              your progress with current/longest streaks and completion rates.
            </span>
          </li>
          <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-sm">
            <CheckIcon
              aria-hidden="true"
              className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-1"
            />
            <span>
              <span className="font-semibold">Customizable Habits:</span> Define
              habit names, descriptions, goals, and frequencies.
            </span>
          </li>
          <li className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/50 dark:to-fuchsia-900/50 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
            <SparklesIcon
              aria-hidden="true"
              className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1"
            />
            <span>
              <span className="font-semibold">Reminders (Coming Soon):</span>{" "}
              Set optional notifications to stay on track.
            </span>
          </li>
          <li className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/50 dark:to-fuchsia-900/50 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
            <SparklesIcon
              aria-hidden="true"
              className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1"
            />
            <span>
              <span className="font-semibold">
                AI Motivation (Coming Soon):
              </span>{" "}
              Personalized insights to help you stick to your goals.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
