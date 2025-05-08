import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-neutral-400 mb-6">
        Oops! The page or resource you requested could not be found.
      </p>
      <Link href="/habits" className="text-primary hover:underline">
        Go back to Habits
      </Link>
    </main>
  );
}
