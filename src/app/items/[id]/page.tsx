"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { ItemCard } from "@/components/items/ItemCard";
import { apiFetch, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { ToolItem } from "@/lib/types";

export default function ItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [item, setItem] = useState<ToolItem | null>(null);
  const [related, setRelated] = useState<ToolItem[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ item: ToolItem; related: ToolItem[] }>(
        `/api/items/${params.id}`
      );
      setItem(data.item);
      setRelated(data.related);
      setActiveImage(0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load item.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function submitReview(event: React.FormEvent) {
    event.preventDefault();
    setReviewMessage("");
    try {
      await apiFetch(`/api/items/${params.id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      setComment("");
      setReviewMessage("Review published.");
      await load();
    } catch (err) {
      setReviewMessage(
        err instanceof ApiError ? err.message : "Could not publish review."
      );
    }
  }

  if (loading) {
    return (
      <div className="container-pad py-10">
        <div className="h-80 animate-pulse rounded-2xl bg-line" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container-pad py-20 text-center">
        <p className="text-muted">{error || "Item not found."}</p>
        <Link href="/explore" className="mt-4 inline-block text-accent">
          Back to explore
        </Link>
      </div>
    );
  }

  return (
    <div className="container-pad py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.images[activeImage] ?? item.images[0]}
              alt={item.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          {item.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {item.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-xl border ${
                    activeImage === index ? "border-accent" : "border-line"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="aspect-video w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            {item.category}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 text-muted">{item.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-accent">
              ${item.price}/mo
            </span>
            <span className="inline-flex items-center gap-1 text-muted">
              <FiStar className="text-accent" />
              {item.rating.toFixed(1)} ({item.reviewCount} reviews)
            </span>
            <span className="text-muted">{item.platform}</span>
            <span className="text-muted">by {item.vendor}</span>
          </div>
        </div>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
          <ul className="mt-6 space-y-2">
            {item.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-xl font-semibold">Specifications</h2>
          <dl className="mt-4 space-y-3">
            {Object.entries(item.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 border-b border-line pb-3 text-sm"
              >
                <dt className="text-muted">{key}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-line bg-white p-6">
        <h2 className="text-xl font-semibold">Reviews & ratings</h2>
        <div className="mt-6 space-y-4">
          {item.reviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet.</p>
          ) : (
            item.reviews.map((review) => (
              <article key={review.id} className="rounded-xl bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-sm text-accent">{review.rating}/5</p>
                </div>
                <p className="mt-2 text-sm text-muted">{review.comment}</p>
              </article>
            ))
          )}
        </div>

        {session ? (
          <form onSubmit={submitReview} className="mt-6 grid gap-3 md:grid-cols-[120px_1fr_auto]">
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="rounded-xl border border-line px-3 py-2.5 text-sm"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
              minLength={8}
              placeholder="Share a concise review"
              className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-accent"
            >
              Submit
            </button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-muted">
            <Link href="/login" className="font-medium text-accent">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}
        {reviewMessage && (
          <p className="mt-3 text-sm text-accent">{reviewMessage}</p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Related tools
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((entry) => (
              <ItemCard key={entry.id} item={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
