"use client";

import { dark } from "@clerk/themes";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function AuthControls() {
  const { theme } = useTheme();

  const currentTheme = {
    baseTheme: theme === "dark" ? dark : undefined,
  };

  const spaceHolderWidthClass = "min-w-[28px]";
  const spaceHolderHeightClass = "h-10";

  return (
    <div
      className={`flex items-center justify-end ${spaceHolderWidthClass} ${spaceHolderHeightClass}`}
    >
      <ClerkLoading></ClerkLoading>
      <ClerkLoaded>
        <div className="flex items-center justify-end">
          <SignedIn>
            <UserButton appearance={currentTheme} afterSignOutUrl="/" />
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
        </div>
      </ClerkLoaded>
    </div>
  );
}
