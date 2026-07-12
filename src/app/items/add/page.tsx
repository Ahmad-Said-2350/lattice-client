"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { CATEGORIES, PLATFORMS, type ToolItem } from "@/lib/types";

export default function AddItemPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Productivity");
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("Web");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="container-pad py-20 text-center text-muted">
        Checking authentication…
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<{ item: ToolItem }>("/api/items", {
        method: "POST",
        body: JSON.stringify({
          title,
          shortDescription,
          description,
          price: Number(price),
          category,
          platform,
          imageUrl,
        }),
      });
      router.push(`/items/${data.item.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-pad py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Protected
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
          Add a tool
        </h1>
        <p className="mt-3 text-muted">
          Publish a new listing to the Lattice marketplace.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              required
              minLength={3}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Short description
            </label>
            <input
              required
              minLength={10}
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Full description
            </label>
            <textarea
              required
              minLength={30}
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Price (USD/mo)
              </label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as (typeof CATEGORIES)[number])
                }
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
              >
                {CATEGORIES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Platform</label>
              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(event.target.value as (typeof PLATFORMS)[number])
                }
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
              >
                {PLATFORMS.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
