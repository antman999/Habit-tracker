"use client";

import { dark } from "@clerk/themes";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function AuthControls() {
  const { theme } = useTheme();
  const currentTheme = {
    baseTheme: theme === "dark" ? dark : undefined,
  };
  return (
    <>
      <SignedIn>
        <UserButton appearance={currentTheme} />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" appearance={currentTheme}>
          <Button
            variant="default"
            size="sm"
            className="whitespace-nowrap bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 w-auto transition-colors duration-300 ease-in"
          >
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
