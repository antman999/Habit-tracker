import { NavBar } from "./navigationBar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4">
        <NavBar />
      </div>
      <main className="pt-24 sm:pt-28">{children}</main>
    </div>
  );
}
