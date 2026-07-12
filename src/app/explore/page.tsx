"use client";

import { useEffect, useMemo, useState } from "react";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemGridSkeleton } from "@/components/items/ItemSkeleton";
import { apiFetch } from "@/lib/api";
import { CATEGORIES, PLATFORMS, type Pagination, type ToolItem } from "@/lib/types";

export default function ExplorePage() {
  const [items, setItems] = useState<ToolItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "8",
      sort,
    });
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (platform) params.set("platform", platform);
    if (minRating) params.set("minRating", minRating);
    return params.toString();
  }, [page, sort, search, category, platform, minRating]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    apiFetch<{ items: ToolItem[]; pagination: Pagination }>(`/api/items?${query}`)
      .then((data) => {
        if (!active) return;
        setItems(data.items);
        setPagination(data.pagination);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
        setPagination(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="container-pad py-10">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Explore
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
          Browse the Lattice catalog
        </h1>
        <p className="mt-3 text-muted">
          Search, filter by category and platform, then sort by what matters to
          your team.
        </p>
      </div>

      <div className="mt-8 grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-2 lg:grid-cols-6">
        <input
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Search tools, vendors…"
          className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent lg:col-span-2"
        />
        <select
          value={category}
          onChange={(event) => {
            setPage(1);
            setCategory(event.target.value);
          }}
          className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <select
          value={platform}
          onChange={(event) => {
            setPage(1);
            setPlatform(event.target.value);
          }}
          className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">All platforms</option>
          {PLATFORMS.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <select
          value={minRating}
          onChange={(event) => {
            setPage(1);
            setMinRating(event.target.value);
          }}
          className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
        <select
          value={sort}
          onChange={(event) => {
            setPage(1);
            setSort(event.target.value);
          }}
          className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <ItemGridSkeleton count={8} />
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center text-muted">
            No tools match these filters. Try clearing a filter or searching a
            different keyword.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-xl border border-line px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() =>
              setPage((value) => Math.min(pagination.totalPages, value + 1))
            }
            className="rounded-xl border border-line px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
