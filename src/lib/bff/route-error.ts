import { NextResponse } from "next/server";
import { SESSION_EXPIRED_USER_MESSAGE } from "@/features/auth/constants/session";
import { clearSessionCookies } from "@/features/auth/server/session";
import { ApiError } from "@/lib/api/api-error";

export function logBffRouteError(context: string, error: unknown): void {
  if (error instanceof ApiError && error.code === "SESSION_EXPIRED") {
    return;
  }

  console.error(`${context}:`, error);
}

export async function toBffErrorResponse(
  error: unknown,
): Promise<NextResponse> {
  if (error instanceof ApiError && error.isUnauthorized) {
    await clearSessionCookies();

    return NextResponse.json(
      {
        error: SESSION_EXPIRED_USER_MESSAGE,
        code: "SESSION_EXPIRED",
      },
      { status: 401 },
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  const message =
    error instanceof Error ? error.message : "Internal Server Error";

  return NextResponse.json({ error: message }, { status: 500 });
}
