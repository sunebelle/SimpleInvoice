import { NextResponse } from "next/server";
import { getSessionTokens } from "@/features/auth/server/session";
import { findInvoiceById } from "@/features/invoice";
import { logBffRouteError, toBffErrorResponse } from "@/lib/bff/route-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getSessionTokens();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const invoice = await findInvoiceById(session, id);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ data: invoice });
  } catch (error) {
    logBffRouteError("Fetch invoice by id route error", error);
    return toBffErrorResponse(error);
  }
}
