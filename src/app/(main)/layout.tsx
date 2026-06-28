import { Navbar } from "@/components/layout/navbar";
import {
  formatUserDisplayName,
  redirectToLoginWhenSessionExpired,
} from "@/features/auth";
import type { UserProfile } from "@/features/auth/types/auth";
import { bffFetch } from "@/lib/bff/server-fetch";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let userName = "";

  const response = await bffFetch("/api/auth/me");

  if (response.status === 401) {
    redirectToLoginWhenSessionExpired();
  }

  if (response.ok) {
    const data = (await response.json()) as { user?: UserProfile };
    userName = formatUserDisplayName(data.user);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userName={userName} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
