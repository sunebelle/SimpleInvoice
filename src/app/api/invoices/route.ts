import { NextResponse } from "next/server";
import { getSessionTokens } from "@/features/auth/server/session";
import {
  createInvoiceSchema,
  listInvoices,
  mapCreateInvoicePayload,
  parseInvoiceListSearchParams,
} from "@/features/invoice";
import { createInvoice } from "@/features/invoice/server/invoice.api";
import { logBffRouteError, toBffErrorResponse } from "@/lib/bff/route-error";
import { parseRequestBody } from "@/lib/validation/parse-request";

export async function GET(request: Request) {
  try {
    const session = await getSessionTokens();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    if (params.pageNum && !params.page) {
      params.page = params.pageNum;
    }

    const filters = parseInvoiceListSearchParams(params);
    const data = await listInvoices(session, filters);

    return NextResponse.json(data);
  } catch (error) {
    logBffRouteError("Fetch invoices route error", error);
    return toBffErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionTokens();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = parseRequestBody(createInvoiceSchema, await request.json());

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const apiPayload = mapCreateInvoicePayload(parsed.data);
    const data = await createInvoice(
      session.accessToken,
      session.orgToken,
      apiPayload,
    );

    return NextResponse.json(data);
  } catch (error) {
    logBffRouteError("Create invoice route error", error);
    return toBffErrorResponse(error);
  }
}
