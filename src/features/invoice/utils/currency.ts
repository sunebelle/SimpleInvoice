export function formatCurrency(amount: number, symbol = "$"): string {
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    GBP: "£",
    USD: "$",
    EUR: "€",
    VND: "₫",
  };
  return symbols[currency] ?? currency;
}
