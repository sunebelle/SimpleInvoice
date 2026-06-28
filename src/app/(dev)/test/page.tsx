import { notFound } from "next/navigation";
import { DemoCounter } from "@/features/dev";

export default function TestComponentPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">
          Test Components
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sandbox for isolated UI component testing.
        </p>
      </div>
      <DemoCounter label="Demo counter" />
    </div>
  );
}
