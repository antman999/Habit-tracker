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
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
