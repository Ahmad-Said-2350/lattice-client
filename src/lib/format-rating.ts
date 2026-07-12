export function formatRating(value: number): string {
  if (!Number.isFinite(value)) return "0.0";
  return value.toFixed(1);
}
