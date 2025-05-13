import { HeroVisual } from "@/components/layout/HeroVisual";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FeatureCardProps,
  currentFeatures,
  upcomingFeatures,
} from "@/static-data/homepage";
import { SignInButton } from "@clerk/nextjs";
import { Github, MoveRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Habit Achiever - Set up your habits, track your progress, and build lasting consistency.",
  description:
    "Join Habit Achiever to easily track your habits, visualize progress, and build lasting consistency.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Habit Achiever - Set up your habits, track your progress, and build lasting consistency.",
    description:
      "Join Habit Achiever to easily track your habits, visualize progress, and build lasting consistency.",
  },
  twitter: {
    title:
      "Habit Achiever - Set up your habits, track your progress, and build lasting consistency.",
    description:
      "Join Habit Achiever to easily track your habits, visualize progress, and build lasting consistency.",
  },
};

function FeatureCard({
  icon: Icon,
  title,
  description,
  comingSoon = false,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl border",
        comingSoon
          ? "bg-purple-50/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
          : "bg-card dark:bg-neutral-800/30 border-border"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon
          className={`w-7 h-7 flex-shrink-0 ${
            comingSoon ? "text-purple-500 dark:text-purple-400" : "text-primary"
          }`}
        />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-4">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center mb-8 sm:mb-24 md:mb-32">
        <header className="text-center md:text-left order-1 md:order-1 mb-4 md:mb-0 mx-auto md:pr-4 lg:pr-6 md:ml-10 lg:ml-20 xl:ml-32">
          <h1 className="text-4xl lg:text-5xl md:text-4xl font-bold mb-3 text-gray-400/80 dark:text-gray-200/70 italic">
            Habit Achiever
          </h1>
          <p className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent leading-tight">
            Achievers start here.
          </p>
          <p className="text-base sm:text-lg md:text-base lg:text-xl text-muted-foreground mb-8 max-w-lg">
            Set up your habits, track your progress, and build lasting
            consistency.
          </p>
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-md group"
            >
              Get Started Free
              <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignInButton>
        </header>
        <div className="order-2 md:order-2 flex justify-center md:justify-end md:pl-4 lg:pl-6">
          <HeroVisual />
        </div>
      </section>
      <section className="mb-20 sm:mb-28 max-w-5xl w-full mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
            Cut the Noise. Build Habits.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tired of overly complicated apps? We stripped away the unnecessary
            clutter so you can focus purely on consistency and progress.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
      <section className="mb-20 sm:mb-28 max-w-5xl w-full mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              What&apos;s next?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re adding more power, but our promise remains: tracking your
            habits will always be easy, never a chore.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {upcomingFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
      <footer className="w-full max-w-5xl mx-auto text-center py-8 mt-10 border-t border-border">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
          Made with ❤️ by
          <Link
            href="https://github.com/Antman999"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary transition-colors flex items-center gap-1"
          >
            Antman999
            <Github className="w-4 h-4" />
          </Link>
        </p>
      </footer>
    </div>
  );
}
