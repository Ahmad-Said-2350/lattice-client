"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { apiFetch, ApiError } from "@/lib/api";

interface AdminItem {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  vendor: string;
  createdByEmail: string;
}

function CatalogManager() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load(query = search) {
    setLoading(true);
    try {
      const data = await apiFetch<{ items: AdminItem[] }>(
        `/api/admin/items?search=${encodeURIComponent(query.trim())}`
      );
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function removeItem() {
    if (!selected) return;
    setBusy(true);
    try {
      await apiFetch(`/api/admin/items/${selected.id}`, { method: "DELETE" });
      setMessage(`“${selected.title}” removed from Lattice.`);
      setSelected(null);
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-pad py-10">
      <p className="section-label">Catalog</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">All tools</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Review every listing across Lattice. Removals require confirmation.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, vendor, or owner email"
          className="input-field sm:max-w-md"
        />
        <Button variant="secondary" onClick={() => load(search)}>
          Search
        </Button>
      </div>

      {message && <p className="mt-3 text-sm text-accent">{message}</p>}

      <div className="panel mt-6">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading catalog…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted">No tools matched.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted">{item.vendor}</p>
                    </td>
                    <td className="text-muted">{item.createdByEmail}</td>
                    <td className="text-muted">{item.category}</td>
                    <td>${item.price}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          View
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
        title="Delete catalog item"
        description={
          selected
            ? `Permanently remove “${selected.title}” from Lattice?`
            : ""
        }
        confirmLabel="Delete tool"
        danger
        loading={busy}
        onClose={() => setSelected(null)}
        onConfirm={removeItem}
      />
    </div>
  );
}

export default function AdminItemsPage() {
  return (
    <RoleGuard allow="admin">
      <CatalogManager />
    </RoleGuard>
  );
}
