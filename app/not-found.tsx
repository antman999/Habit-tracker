import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center p-6 text-center  text-foreground">
      <div className="bg-card p-8 sm:p-12 rounded-xl shadow-2xl border border-border max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-card-foreground">
          Oops! Page Not Found.
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-10">
          It seems the page you were looking for doesn&apos;t exist or has been
          moved. Don&apos;t worry, let&apos;s get you back on track!
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-background"
        >
          <Home className="h-5 w-5" />
          Go Back
        </Link>
      </div>
    </main>
  );
}
