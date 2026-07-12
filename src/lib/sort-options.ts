export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "title";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "title", label: "Title A–Z" },
];
