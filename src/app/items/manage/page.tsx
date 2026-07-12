"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { apiFetch, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { ToolItem } from "@/lib/types";

export default function ManageItemsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [items, setItems] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ToolItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<{ items: ToolItem[] }>("/api/items/mine");
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
      return;
    }
    if (session) load();
  }, [isPending, session, router]);

  async function confirmDelete() {
    if (!selected) return;
    setBusy(true);
    try {
      await apiFetch(`/api/items/${selected.id}`, { method: "DELETE" });
      setMessage(`“${selected.title}” deleted.`);
      setSelected(null);
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || !session) {
    return (
      <div className="container-pad py-20 text-center text-muted">
        Checking authentication…
      </div>
    );
  }

  return (
    <div className="container-pad py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">Workspace</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">My tools</h1>
          <p className="mt-2 text-muted">
            View, edit, or remove your Lattice listings.
          </p>
        </div>
        <Link href="/items/add" className="btn btn-primary">
          Add tool
        </Link>
      </div>

      {message && <p className="mt-4 text-sm text-accent">{message}</p>}

      <div className="panel mt-8">
        {loading ? (
          <div className="p-8 text-sm text-muted">Loading your listings…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No tools yet.{" "}
            <Link href="/items/add" className="font-medium text-accent">
              Add your first tool
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
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted">
                        {item.shortDescription}
                      </p>
                    </td>
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
                          onClick={() => setSelected(item)}
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
      </div>

      <ConfirmModal
        open={Boolean(selected)}
        title="Delete listing"
        description={
          selected
            ? `Remove “${selected.title}” from Lattice permanently?`
            : ""
        }
        confirmLabel="Delete"
        danger
        loading={busy}
        onClose={() => setSelected(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
