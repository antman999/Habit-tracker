import type { Metadata } from "next";
import { Layout } from "@/components/layout/layout";
export const metadata: Metadata = {
  title: "Habit tracker",
  description: "A list of my habits",
};

export default function HabitsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
