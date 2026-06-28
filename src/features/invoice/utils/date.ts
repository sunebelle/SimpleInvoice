export function formatDateOnly(isoDate: string | undefined): string {
  if (!isoDate) return "N/A";
  return isoDate.split("T")[0];
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function addDaysISO(days: number): string {
  return new Date(Date.now() + days * 24 * 3600 * 1000)
    .toISOString()
    .split("T")[0];
}
