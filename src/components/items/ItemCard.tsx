"use client";

import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { formatPrice } from "@/lib/format-price";
import { formatRating } from "@/lib/format-rating";
import { getPrimaryImage } from "@/lib/get-primary-image";
import type { ToolItem } from "@/lib/types";

export function ItemCard({ item }: { item: ToolItem }) {
  return (
    <article className="card-shell flex h-full flex-col transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getPrimaryImage(item)}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-display text-lg font-semibold">
            {item.title}
          </h3>
          <span className="badge badge-accent shrink-0">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {item.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted">
          <span>{item.category}</span>
          <span className="inline-flex items-center gap-1">
            <FiStar className="text-accent" />
            {formatRating(item.rating)} · {item.platform}
          </span>
        </div>
        <Link
          href={`/items/${item.id}`}
          className="btn btn-primary mt-1 w-full"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
