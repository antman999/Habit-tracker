import { AuthControls } from "./authControls";
import { ThemeToggle } from "./themeToggle";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 px-4 sm:px-8 flex items-center justify-between bg-white/80 dark:bg-neutral-950/70 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800 z-10 font-[family-name:var(--font-geist-sans)]">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200"></div>
      <div className="flex gap-4 items-center">
        <ThemeToggle />
        <AuthControls />
      </div>
    </nav>
  );
}
