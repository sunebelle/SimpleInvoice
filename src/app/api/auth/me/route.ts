import { NextResponse } from "next/server";
import { fetchUserProfile } from "@/features/auth/server/auth.api";
import { getAccessToken } from "@/features/auth/server/session";
import { logBffRouteError, toBffErrorResponse } from "@/lib/bff/route-error";

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { authenticated: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const profile = await fetchUserProfile(accessToken);

    return NextResponse.json({
      authenticated: true,
      user: profile.data,
    });
  } catch (error) {
    logBffRouteError("Auth check error", error);
    return toBffErrorResponse(error);
  }
}
