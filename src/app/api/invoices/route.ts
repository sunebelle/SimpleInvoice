import {
  handleGetInvoices,
  handleCreateInvoice,
} from "@/features/invoice/services/invoice.service";

export async function GET(request: Request) {
  return handleGetInvoices(request);
}

export async function POST(request: Request) {
  return handleCreateInvoice(request);
}
