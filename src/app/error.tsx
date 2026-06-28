"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.assign("/")}
            >
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
