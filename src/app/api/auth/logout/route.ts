import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/features/auth/server/session";

export async function POST() {
  await clearSessionCookies();
  return NextResponse.json({ success: true });
}
