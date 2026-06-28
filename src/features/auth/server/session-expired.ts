import { redirect } from "next/navigation";
import { SESSION_EXPIRED_REASON } from "@/features/auth/constants/session";

/** Redirect only — cookie cleanup runs in proxy.ts (RSC cannot mutate cookies). */
export function redirectToLoginWhenSessionExpired(): never {
  redirect(`/login?reason=${SESSION_EXPIRED_REASON}`);
}
