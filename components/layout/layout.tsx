import { NavBar } from "./navigationBar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <NavBar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
