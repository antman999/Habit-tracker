import {
  CheckCircle2,
  CalendarDays,
  Target,
  TrendingUp,
  Settings2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  comingSoon?: boolean;
}

export const currentFeatures: FeatureCardProps[] = [
  {
    icon: CheckCircle2,
    title: "Daily Tracking",
    description:
      "Easily mark habits as complete each day with a simple and intuitive UI. Stay on top of your goals effortlessly.",
  },
  {
    icon: TrendingUp,
    title: "Streaks & Stats",
    description:
      "Visualize your consistency with current and longest streak counters. Understand your patterns at a glance.",
  },
  {
    icon: Target,
    title: "Goal Progress Ring",
    description:
      "See how close you are to achieving your habit goals with a clear, motivating circular progress chart. Also who doesn't love progress rings.",
  },
  {
    icon: CalendarDays,
    title: "Completion Calendar",
    description:
      "Look back at your journey with a full calendar view for each habit, showing all your completed days.",
  },
  {
    icon: Settings2,
    title: "Customizable Habits",
    description:
      "Define habits with custom names, detailed descriptions, and specific day goals to tailor your tracking experience.",
  },
  {
    icon: ShieldCheck,
    title: "Free & Private",
    description:
      "100% Free, No Ads, No Tracking, No selling your data, and open source. Your journey is yours alone.",
  },
];

export const upcomingFeatures: FeatureCardProps[] = [
  {
    icon: Sparkles,
    title: "Smart Reminders",
    description: "Set intelligent, timely reminders to help you stay on track.",
    comingSoon: true,
  },
  {
    icon: Sparkles,
    title: "Advanced Statistics",
    description:
      "Dive deeper into your progress with more detailed charts and insights.",
    comingSoon: true,
  },
  {
    icon: Sparkles,
    title: "Journaling & Notes",
    description:
      "Add notes to your daily check-ins to reflect on your journey.",
    comingSoon: true,
  },
  {
    icon: Sparkles,
    title: "Achievements",
    description:
      "Unlock badges and celebrate milestones as you build lasting habits.",
    comingSoon: true,
  },
  {
    icon: Sparkles,
    title: "Habit Archiving",
    description: "Pause or archive habits you're taking a break from.",
    comingSoon: true,
  },
  {
    icon: Sparkles,
    title: "AI Motivation (Planned)",
    description: "Get personalized insights to help you stick to your goals.",
    comingSoon: true,
  },
];
