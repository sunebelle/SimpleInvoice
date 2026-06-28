import type { UserProfile } from "@/features/auth/types/auth";

export function formatUserDisplayName(user?: UserProfile | null): string {
  if (!user) return "";

  const givenName = user.firstName || "User";
  const familyName = user.lastName || "";
  return `${givenName} ${familyName}`.trim();
}
