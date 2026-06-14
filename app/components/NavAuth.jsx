"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function NavAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="ml-auto h-8 w-20" aria-hidden />;
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton mode="modal">
          <button
            type="button"
            className="text-[13px] font-medium text-neutral-700 hover:text-neutral-950"
          >
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
}
