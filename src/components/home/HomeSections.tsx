"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemGridSkeleton } from "@/components/items/ItemSkeleton";
import { apiFetch } from "@/lib/api";
import type { StatsResponse, ToolItem } from "@/lib/types";

const features = [
  {
    title: "Curated categories",
    text: "Design, development, analytics, security, and more — organized for operators.",
  },
  {
    title: "Transparent pricing",
    text: "Clear monthly pricing and license notes so teams can compare without guesswork.",
  },
  {
    title: "Trusted reviews",
    text: "Ratings and written feedback from people actually shipping with these tools.",
  },
];

const services = [
  {
    title: "Discovery",
    text: "Search, filter, and sort tools by category, platform, price, and rating.",
  },
  {
    title: "Listing",
    text: "Publish your product with images, specs, and a concise value story.",
  },
  {
    title: "Management",
    text: "Update visibility by reviewing and removing your own marketplace entries.",
  },
];

const highlights = [
  "No cluttered dashboards on the marketing surface",
  "Consistent card layout across explore and home",
  "Protected flows for adding and managing listings",
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Design Lead",
    quote:
      "Lattice helped our squad evaluate three design suites in one afternoon. The detail pages are unusually clear.",
  },
  {
    name: "Jonah Reed",
    role: "Founding Engineer",
    quote:
      "Listing ShipLane here brought serious trial traffic. The marketplace feels premium without being loud.",
  },
  {
    name: "Priya Nair",
    role: "Growth Operator",
    quote:
      "Filters actually work. We shortlisted analytics tools by rating and platform in minutes.",
  },
];

const faqs = [
  {
    q: "Is Lattice free to browse?",
    a: "Yes. Exploring tools, reading details, and comparing specs is free for every visitor.",
  },
  {
    q: "Who can add a listing?",
    a: "Any signed-in user can publish a tool. You manage your own listings from the Manage page.",
  },
  {
    q: "Do you host the software?",
    a: "No. Lattice is a discovery marketplace. Vendors fulfill access after purchase outside the catalog.",
  },
];

const blogs = [
  {
    title: "How to evaluate a SaaS tool in 20 minutes",
    excerpt:
      "A practical checklist for specs, pricing honesty, and support quality before you commit.",
  },
  {
    title: "Why marketplace UX should stay quiet",
    excerpt:
      "Busy grids kill comparison. Lattice favors consistent cards and readable metadata.",
  },
  {
    title: "Security tools buyers ask about first",
    excerpt:
      "From SSO depth to audit exports — the questions that show up on every serious evaluation.",
  },
];

export function HomeSections() {
  const [featured, setFeatured] = useState<ToolItem[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          apiFetch<{ items: ToolItem[] }>("/api/items?limit=4&sort=rating"),
          apiFetch<StatsResponse>("/api/stats"),
        ]);
        if (!active) return;
        setFeatured(itemsRes.items);
        setStats(statsRes);
      } catch {
        if (!active) return;
        setFeatured([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="container-pad py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Featured tools
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
              Highest rated this week
            </h2>
          </div>
          <Link href="/explore" className="text-sm font-medium text-accent">
            View all
          </Link>
        </div>
        {loading ? (
          <ItemGridSkeleton count={4} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-line bg-white py-16">
        <div className="container-pad">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            Features
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Lattice is built for calm comparison — not endless promo tiles.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card-shell p-6">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pad py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Services
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Everything you need to discover or publish digital products.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white py-16">
        <div className="container-pad grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl">
              Marketplace statistics
            </h2>
            <p className="mt-3 text-muted">
              Live counts from the Lattice catalog powered by MongoDB Atlas.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-2xl font-semibold text-ink">
                  {stats?.totalTools ?? "—"}
                </p>
                <p className="mt-1 text-xs text-muted">Tools listed</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-2xl font-semibold text-ink">
                  {stats?.totalVendors ?? "—"}
                </p>
                <p className="mt-1 text-xs text-muted">Vendors</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-2xl font-semibold text-ink">
                  {stats?.averageRating ?? "—"}
                </p>
                <p className="mt-1 text-xs text-muted">Avg rating</p>
              </div>
            </div>
          </div>
          <div className="h-72 rounded-2xl border border-line bg-surface p-4">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#116466" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                Loading chart…
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-pad py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Highlights
        </h2>
        <ul className="mt-6 space-y-4">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-line bg-white px-5 py-4 text-sm"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-white py-16">
        <div className="container-pad">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            Testimonials
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="card-shell p-6">
                <p className="text-sm leading-relaxed text-muted">
                  “{item.quote}”
                </p>
                <footer className="mt-5">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pad py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          From the Lattice journal
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {blogs.map((post) => (
            <article key={post.title} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <Link href="/about" className="mt-4 inline-block text-sm font-medium text-accent">
                Read perspective
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-ink py-16 text-white">
        <div className="container-pad grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl">
              Newsletter
            </h2>
            <p className="mt-3 max-w-xl text-white/70">
              Monthly shortlist of standout tools and marketplace updates. No
              filler campaigns.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.trim()) return;
              setSubscribed(true);
              setEmail("");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-sm text-teal-200 md:col-span-2">
              Thanks — you are on the list.
            </p>
          )}
        </div>
      </section>

      <section className="container-pad py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">FAQ</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-line bg-white px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-medium">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-pad pb-16">
        <div className="overflow-hidden rounded-[1.5rem] bg-accent px-8 py-12 text-white md:px-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            Ready to list your tool?
          </h2>
          <p className="mt-3 max-w-xl text-white/85">
            Create an account, publish a listing, and reach buyers who care about
            clarity over hype.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/items/add"
              className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold"
            >
              Add a tool
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold"
            >
              Browse catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
