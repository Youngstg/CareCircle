const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string | null): string {
  if (!value) return "Tanpa tenggat";
  return dateFormatter.format(new Date(value));
}

export function isOverdue(value: string | null, completedAt: string | null): boolean {
  return Boolean(value && !completedAt && new Date(value).getTime() < Date.now());
}
