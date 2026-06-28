import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import {
  fetchAccessToken,
  fetchUserProfile,
} from "@/features/auth/server/auth.api";
import { setSessionCookies } from "@/features/auth/server/session";
import { ApiError } from "@/lib/api/api-error";
import { parseRequestBody } from "@/lib/validation/parse-request";

export async function POST(request: Request) {
  try {
    const parsed = parseRequestBody(loginSchema, await request.json());

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const tokenData = await fetchAccessToken(username, password);
    const { access_token, expires_in } = tokenData;

    const profileData = await fetchUserProfile(access_token);
    const orgToken = profileData.data?.memberships?.[0]?.token;

    if (!orgToken) {
      return NextResponse.json(
        { error: "No organization membership found for this user" },
        { status: 403 },
      );
    }

    await setSessionCookies(access_token, orgToken, expires_in || 3600);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login route error:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
