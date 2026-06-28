import { cookies } from "next/headers";

export interface SessionTokens {
  accessToken: string;
  orgToken: string;
}

export async function getSessionTokens(): Promise<SessionTokens | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const orgToken = cookieStore.get("org_token")?.value;

  if (!accessToken || !orgToken) return null;
  return { accessToken, orgToken };
}

export async function setSessionCookies(
  accessToken: string,
  orgToken: string,
  maxAge: number,
): Promise<void> {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };

  cookieStore.set("access_token", accessToken, cookieOptions);
  cookieStore.set("org_token", orgToken, cookieOptions);
}

export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("org_token");
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}
