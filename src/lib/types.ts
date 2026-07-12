export type ToolCategory =
  | "Design"
  | "Development"
  | "Productivity"
  | "Marketing"
  | "Analytics"
  | "Security";

export type Platform = "Web" | "Desktop" | "Mobile" | "Cross-platform";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ToolItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  category: ToolCategory;
  platform: Platform;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  vendor: string;
  createdBy: string;
  createdByEmail: string;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StatsResponse {
  totalTools: number;
  totalVendors: number;
  averageRating: number;
  categories: { name: string; count: number }[];
  platforms: { name: string; count: number }[];
}

export const CATEGORIES: ToolCategory[] = [
  "Design",
  "Development",
  "Productivity",
  "Marketing",
  "Analytics",
  "Security",
];

export const PLATFORMS: Platform[] = [
  "Web",
  "Desktop",
  "Mobile",
  "Cross-platform",
];
