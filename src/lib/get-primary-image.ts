import type { ToolItem } from "@/lib/types";

export function getPrimaryImage(item: Pick<ToolItem, "images" | "title">): string {
  return (
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  );
}
