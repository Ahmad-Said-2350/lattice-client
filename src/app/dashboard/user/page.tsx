"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { apiFetch, ApiError } from "@/lib/api";
import { useAppRole } from "@/lib/use-app-role";
import type { ToolItem } from "@/lib/types";

interface UserStats {
  listings: number;
  reviewsReceived: number;
  averageRating: number;
  role: string;
}

function UserWorkspace() {
  const { session } = useAppRole();
  const [items, setItems] = useState<ToolItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ToolItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const [mine, meStats] = await Promise.all([
      apiFetch<{ items: ToolItem[] }>("/api/items/mine"),
      apiFetch<UserStats>("/api/me/stats"),
    ]);
    setItems(mine.items);
    setStats(meStats);
  }

  useEffect(() => {
    load().catch(() => {
      setItems([]);
      setStats(null);
    });
  }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await apiFetch(`/api/items/${deleteTarget.id}`, { method: "DELETE" });
      setMessage(`“${deleteTarget.title}” deleted.`);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-pad py-10">
      <p className="section-label">Workspace</p>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Hello, {session?.user.name?.split(" ")[0]}
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Publish tools, track performance, and keep your Lattice catalog
            sharp.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/items/add" className="btn btn-primary">
            List a tool
          </Link>
          <Link href="/explore" className="btn btn-secondary">
            Browse marketplace
          </Link>
        </div>
      </div>

      {message && <p className="mt-4 text-sm text-accent">{message}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Your listings", value: stats?.listings ?? "—" },
          { label: "Reviews received", value: stats?.reviewsReceived ?? "—" },
          { label: "Avg rating", value: stats?.averageRating ?? "—" },
        ].map((card) => (
          <div key={card.label} className="panel p-5">
            <p className="font-display text-3xl font-semibold">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <section className="panel mt-8">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-semibold">Your tools</h2>
          <Link href="/items/manage" className="text-sm font-medium text-accent">
            Manage all
          </Link>
        </div>
        {items.length === 0 ? (
          <div className="p-6 text-sm text-muted">
            No listings yet.{" "}
            <Link href="/items/add" className="font-medium text-accent">
              Create your first tool
            </Link>
            .
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 6).map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.title}</td>
                    <td className="text-muted">{item.category}</td>
                    <td>${item.price}</td>
                    <td>{item.rating.toFixed(1)}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/items/${item.id}/edit`}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete your listing"
        description={
          deleteTarget
            ? `Remove “${deleteTarget.title}” from Lattice? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete tool"
        danger
        loading={busy}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <RoleGuard allow="user">
      <UserWorkspace />
    </RoleGuard>
  );
}
