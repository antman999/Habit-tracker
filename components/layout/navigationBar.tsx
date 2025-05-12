import Link from "next/link";
import { AuthControls } from "./authControls";
import { ThemeToggle } from "./themeToggle";
import { auth } from "@clerk/nextjs/server";

export async function NavBar() {
  const { userId } = await auth();
  const homeHref = userId ? "/habits" : "/";
  return (
    <nav className="flex items-center justify-between gap-8 sm:gap-10 px-4 py-2.5 sm:px-6 sm:py-3  rounded-full bg-white/60 dark:bg-neutral-900/75 backdrop-blur-lg border border-gray-100 dark:border-gray-700 shadow-sm min-w-[370px] sm:min-w-[650px]">
      <Link href={homeHref}>
        <span className="font-extrabold text-lg italic bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
          Habit Achiever
        </span>
      </Link>
      <div className="flex gap-3 sm:gap-4 items-center">
        <ThemeToggle />
        <AuthControls />
      </div>
    </nav>
  );
}
