"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import {
  SESSION_EXPIRED_REASON,
  SESSION_EXPIRED_USER_MESSAGE,
} from "@/features/auth/constants/session";
import {
  type LoginFormData,
  loginSchema,
} from "@/features/auth/schemas/login.schema";

const labelClassName =
  "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const sessionExpired = searchParams.get("reason") === SESSION_EXPIRED_REASON;
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Login failed");
      }

      router.push(from);
      router.refresh();
    } catch (err) {
      setServerError(
        (err as Error).message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground antialiased">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-8 shadow-lg transition-all duration-300 hover:border-ring/50">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
            {siteConfig.name}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage your billing & invoices
          </p>
        </div>

        {sessionExpired && (
          <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-sm text-amber-800 dark:text-amber-500">
            {SESSION_EXPIRED_USER_MESSAGE}
          </div>
        )}

        {serverError && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="username-input" className={labelClassName}>
              Username
            </label>
            <Input
              id="username-input"
              type="text"
              inputSize="lg"
              autoComplete="username"
              disabled={isSubmitting}
              placeholder="Enter your username"
              {...register("username")}
            />
            <FieldError message={errors.username?.message} />
          </div>

          <div>
            <label htmlFor="password-input" className={labelClassName}>
              Password
            </label>
            <Input
              id="password-input"
              type="password"
              inputSize="lg"
              autoComplete="current-password"
              disabled={isSubmitting}
              placeholder="Enter your password"
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 rounded-lg bg-muted/50 border border-border p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">
            Demo Credentials:
          </p>
          <p>
            Username: <code className="text-primary">94756921275</code>
          </p>
          <p className="mt-0.5">
            Password: <code className="text-primary">Password@12345</code>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <span className="text-sm font-medium">Loading session...</span>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginFormContent />
    </Suspense>
  );
}
