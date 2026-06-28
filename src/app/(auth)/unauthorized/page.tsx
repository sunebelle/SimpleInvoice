import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
      <p className="text-5xl font-extrabold text-destructive">401</p>
      <h1 className="text-2xl font-bold text-foreground">Unauthorized</h1>
      <p className="text-sm text-muted-foreground">
        Your session is missing or expired. Please sign in again to access this
        resource.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Sign in
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
