"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { CATEGORIES, PLATFORMS, type ToolItem } from "@/lib/types";

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!params.id || !session) return;

    let active = true;
    setLoading(true);

    apiFetch<{ item: ToolItem }>(`/api/items/${params.id}`)
      .then((data) => {
        if (!active) return;
        const item = data.item;
        if (item.createdBy !== session.user.id) {
          setError("You can only edit your own items.");
          return;
        }
        setTitle(item.title);
        setShortDescription(item.shortDescription);
        setDescription(item.description);
        setPrice(String(item.price));
        setCategory(item.category);
        setPlatform(item.platform);
        setImageUrl(item.images[0] ?? "");
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : "Failed to load item.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id, session]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = await apiFetch<{ item: ToolItem }>(`/api/items/${params.id}`, {
        method: "PUT",
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
      setError(err instanceof ApiError ? err.message : "Failed to update item.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <div className="container-pad py-20 text-center text-muted">
        Checking authentication…
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-pad py-20 text-center text-muted">
        Loading item…
      </div>
    );
  }

  return (
    <div className="container-pad py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Update
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
          Edit tool
        </h1>
        <p className="mt-3 text-muted">
          Change details and save. Updates are written to the Lattice catalog.
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
            <label className="mb-1.5 block text-sm font-medium">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || Boolean(error && !title)}
              className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60"
            >
              {saving ? "Saving…" : "Update"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/items/manage")}
              className="rounded-xl border border-line px-5 py-3 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
