import { NextResponse } from "next/server";
import { getSessionTokens } from "@/features/auth/server/session";
import { computeInvoiceSummary } from "@/features/invoice";
import { logBffRouteError, toBffErrorResponse } from "@/lib/bff/route-error";

export async function GET() {
  try {
    const session = await getSessionTokens();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await computeInvoiceSummary(session);
    return NextResponse.json(summary);
  } catch (error) {
    logBffRouteError("Invoice summary route error", error);
    return toBffErrorResponse(error);
  }
}
