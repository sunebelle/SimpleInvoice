"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DemoCounterProps {
  initialCount?: number;
  label?: string;
}

/** Demo component for `/_test` route and component tests. */
export function DemoCounter({
  initialCount = 0,
  label = "Count",
}: DemoCounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="rounded-xl border border-border bg-card p-6 max-w-sm space-y-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold" data-testid="counter-value">
        {count}
      </p>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={() => setCount((c) => c + 1)}>
          Increment
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCount(initialCount)}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
