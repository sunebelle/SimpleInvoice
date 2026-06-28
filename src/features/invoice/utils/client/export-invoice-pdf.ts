import { jsPDF } from "jspdf";
import type { Invoice } from "@/features/invoice/types/invoice";
import { formatCurrency } from "@/features/invoice/utils/currency";
import { formatDateOnly } from "@/features/invoice/utils/date";
import {
  getActiveInvoiceStatus,
  getInvoiceAmountSymbol,
  getInvoiceDisplayAmount,
  getInvoicePartyName,
} from "@/features/invoice/utils/display";

export function downloadInvoicePdf(invoice: Invoice): void {
  const doc = new jsPDF();
  const symbol = getInvoiceAmountSymbol(invoice);
  const amount = getInvoiceDisplayAmount(invoice);
  const status = getActiveInvoiceStatus(invoice.status);
  const customer = getInvoicePartyName(invoice.customer);
  let y = 20;

  const line = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 50, y);
    y += 8;
  };

  doc.setFontSize(18);
  doc.text("Invoice", 14, y);
  y += 12;

  doc.setFontSize(11);
  line("Invoice #", invoice.invoiceNumber);
  line("Customer", customer);
  line("Invoice Date", formatDateOnly(invoice.invoiceDate));
  line("Due Date", formatDateOnly(invoice.dueDate));
  line("Status", status);
  line("Amount", formatCurrency(amount, symbol));

  if (invoice.description?.trim()) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(invoice.description.trim(), 180);
    doc.text(lines, 14, y);
  }

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

export function printInvoice(invoice: Invoice): void {
  const symbol = getInvoiceAmountSymbol(invoice);
  const amount = getInvoiceDisplayAmount(invoice);
  const status = getActiveInvoiceStatus(invoice.status);
  const customer = getInvoicePartyName(invoice.customer);

  const html = `<!DOCTYPE html><html><head><title>${invoice.invoiceNumber}</title>
    <style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:720px;margin:0 auto}
    h1{margin:0 0 1rem}table{width:100%;border-collapse:collapse}td{padding:.35rem 0}
    td:first-child{font-weight:600;width:140px;color:#555}</style></head><body>
    <h1>Invoice ${invoice.invoiceNumber}</h1>
    <table>
    <tr><td>Customer</td><td>${customer}</td></tr>
    <tr><td>Invoice Date</td><td>${formatDateOnly(invoice.invoiceDate)}</td></tr>
    <tr><td>Due Date</td><td>${formatDateOnly(invoice.dueDate)}</td></tr>
    <tr><td>Status</td><td>${status}</td></tr>
    <tr><td>Amount</td><td>${formatCurrency(amount, symbol)}</td></tr>
    </table>
    ${invoice.description?.trim() ? `<p><strong>Description</strong><br/>${invoice.description}</p>` : ""}
    </body></html>`;

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
