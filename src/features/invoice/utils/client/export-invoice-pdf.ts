import { jsPDF } from "jspdf";
import type { Invoice } from "@/features/invoice/types/invoice";
import { formatCurrency } from "@/features/invoice/utils/currency";
import { formatDateOnly } from "@/features/invoice/utils/date";
import {
  getActiveInvoiceStatus,
  getInvoiceAmountSymbol,
  getInvoiceDisplayAmount,
  getInvoicePartyName,
  getInvoicePartySubtext,
  getInvoiceReference,
} from "@/features/invoice/utils/display";

export function downloadInvoicePdf(invoice: Invoice): void {
  const doc = new jsPDF();
  const symbol = getInvoiceAmountSymbol(invoice);
  const amount = getInvoiceDisplayAmount(invoice);
  const status = getActiveInvoiceStatus(invoice.status);
  
  const customerName = getInvoicePartyName(invoice.customer);
  const customerSubtext = getInvoicePartySubtext(invoice.customer);
  const merchantName = getInvoicePartyName(invoice.merchant);
  const merchantSubtext = getInvoicePartySubtext(invoice.merchant);
  const reference = getInvoiceReference(invoice);

  let y = 20;

  const line = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value, 120);
    doc.text(lines, 60, y);
    y += 8 * lines.length;
  };

  const sectionTitle = (title: string) => {
    y += 6;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  };

  doc.setFontSize(18);
  doc.text(`Invoice ${invoice.invoiceNumber}`, 14, y);
  y += 12;

  doc.setFontSize(10);
  
  sectionTitle("General Information");
  if (reference) line("Reference", reference);
  line("Invoice Date", formatDateOnly(invoice.invoiceDate));
  line("Due Date", formatDateOnly(invoice.dueDate));
  line("Status", status);

  sectionTitle("Merchant");
  line("Name", merchantName || "—");
  if (merchantSubtext) line("Details", merchantSubtext);

  sectionTitle("Customer");
  line("Name", customerName || "—");
  if (customerSubtext) line("Details", customerSubtext);

  sectionTitle("Financial Summary");
  line("Subtotal", formatCurrency(invoice.invoiceSubTotal, symbol));
  line("Tax", formatCurrency(invoice.totalTax, symbol));
  line("Discount", formatCurrency(invoice.totalDiscount, symbol));
  line("Total", formatCurrency(invoice.totalAmount, symbol));
  line("Paid", formatCurrency(invoice.totalPaid, symbol));
  line("Balance", formatCurrency(invoice.balanceAmount, symbol));

  if (invoice.customFields && invoice.customFields.length > 0) {
    sectionTitle("Custom Fields");
    for (const field of invoice.customFields) {
      line(field.key, field.value);
    }
  }

  if (invoice.items && invoice.items.length > 0) {
    sectionTitle("Line Items");
    line("Total Items", invoice.items.length.toString());
  }

  if (invoice.payments && invoice.payments.length > 0) {
    sectionTitle("Payments");
    line("Total Payments", invoice.payments.length.toString());
  }

  if (invoice.description?.trim()) {
    sectionTitle("Description");
    const lines = doc.splitTextToSize(invoice.description.trim(), 180);
    doc.text(lines, 14, y);
    y += 6 * lines.length;
  }

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

export function printInvoice(invoice: Invoice): void {
  const symbol = getInvoiceAmountSymbol(invoice);
  const status = getActiveInvoiceStatus(invoice.status);
  
  const customerName = getInvoicePartyName(invoice.customer);
  const customerSubtext = getInvoicePartySubtext(invoice.customer);
  const merchantName = getInvoicePartyName(invoice.merchant);
  const merchantSubtext = getInvoicePartySubtext(invoice.merchant);
  const reference = getInvoiceReference(invoice);

  const html = `<!DOCTYPE html><html><head><title>${invoice.invoiceNumber}</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:2rem;max-width:800px;margin:0 auto;line-height:1.5;}
      h1{margin:0 0 1.5rem}
      h2{margin:2rem 0 1rem;font-size:1.25rem;border-bottom:1px solid #eee;padding-bottom:0.5rem;}
      table{width:100%;border-collapse:collapse;margin-bottom:1rem;}
      td{padding:.5rem;vertical-align:top;border-bottom:1px solid #f5f5f5;}
      td:first-child{font-weight:600;width:200px;color:#555}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;}
    </style></head><body>
    <h1>Invoice ${invoice.invoiceNumber}</h1>
    
    <table>
      ${reference ? `<tr><td>Reference</td><td>${reference}</td></tr>` : ""}
      <tr><td>Invoice Date</td><td>${formatDateOnly(invoice.invoiceDate)}</td></tr>
      <tr><td>Due Date</td><td>${formatDateOnly(invoice.dueDate)}</td></tr>
      <tr><td>Status</td><td>${status}</td></tr>
    </table>

    <div class="grid">
      <div>
        <h2>Merchant</h2>
        <table>
          <tr><td>Name</td><td>${merchantName || "—"}</td></tr>
          ${merchantSubtext ? `<tr><td>Details</td><td>${merchantSubtext}</td></tr>` : ""}
        </table>
      </div>
      <div>
        <h2>Customer</h2>
        <table>
          <tr><td>Name</td><td>${customerName || "—"}</td></tr>
          ${customerSubtext ? `<tr><td>Details</td><td>${customerSubtext}</td></tr>` : ""}
        </table>
      </div>
    </div>

    <h2>Financial Summary</h2>
    <table>
      <tr><td>Subtotal</td><td>${formatCurrency(invoice.invoiceSubTotal, symbol)}</td></tr>
      <tr><td>Tax</td><td>${formatCurrency(invoice.totalTax, symbol)}</td></tr>
      <tr><td>Discount</td><td>${formatCurrency(invoice.totalDiscount, symbol)}</td></tr>
      <tr><td>Total</td><td><strong>${formatCurrency(invoice.totalAmount, symbol)}</strong></td></tr>
      <tr><td>Paid</td><td>${formatCurrency(invoice.totalPaid, symbol)}</td></tr>
      <tr><td>Balance</td><td><strong>${formatCurrency(invoice.balanceAmount, symbol)}</strong></td></tr>
    </table>

    ${invoice.customFields && invoice.customFields.length > 0 ? `
      <h2>Custom Fields</h2>
      <table>
        ${invoice.customFields.map(f => `<tr><td>${f.key}</td><td>${f.value}</td></tr>`).join('')}
      </table>
    ` : ""}
    
    ${invoice.items && invoice.items.length > 0 ? `<h2>Line Items</h2><p>${invoice.items.length} items</p>` : ""}
    ${invoice.payments && invoice.payments.length > 0 ? `<h2>Payments</h2><p>${invoice.payments.length} payments</p>` : ""}

    ${invoice.description?.trim() ? `<h2>Description</h2><p>${invoice.description.replace(/\n/g, '<br/>')}</p>` : ""}
    </body></html>`;

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
