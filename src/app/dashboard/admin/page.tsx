"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { apiFetch, ApiError } from "@/lib/api";
import { useAppRole } from "@/lib/use-app-role";

interface Overview {
  totalUsers: number;
  totalAdmins: number;
  blockedUsers: number;
  activeUsers: number;
  totalItems: number;
  totalVendors: number;
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    blocked: boolean;
  }[];
  recentItems: {
    id: string;
    title: string;
    category: string;
    price: number;
    createdByEmail: string;
  }[];
}

function AdminHome() {
  const { session } = useAppRole();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const data = await apiFetch<Overview>("/api/admin/overview");
    setOverview(data);
  }

  useEffect(() => {
    load().catch(() => setOverview(null));
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    setLoadingAction(true);
    try {
      await apiFetch(`/api/admin/items/${deleteId}`, { method: "DELETE" });
      setMessage("Listing removed from the catalog.");
      setDeleteId(null);
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setLoadingAction(false);
    }
  }

  const stats = [
    { label: "Active users", value: overview?.activeUsers },
    { label: "Blocked", value: overview?.blockedUsers },
    { label: "Admins", value: overview?.totalAdmins },
    { label: "Listings", value: overview?.totalItems },
  ];

  return (
    <div className="container-pad py-10">
      <p className="section-label">Admin</p>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Control center</h1>
          <p className="mt-2 max-w-xl text-muted">
            Hello {session?.user.name}. Monitor Lattice health, govern accounts,
            and keep the catalog trustworthy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/admin/users" className="btn btn-primary">
            Manage users
          </Link>
          <Link href="/dashboard/admin/items" className="btn btn-secondary">
            Manage catalog
          </Link>
        </div>
      </div>

      {message && <p className="mt-4 text-sm text-accent">{message}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((card) => (
          <div key={card.label} className="panel p-5">
            <p className="font-display text-3xl font-semibold">
              {card.value ?? "—"}
            </p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent users</h2>
            <Link href="/dashboard/admin/users" className="text-sm font-medium text-accent">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {(overview?.recentUsers ?? []).map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 border-b border-line pb-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted">{user.email}</p>
                </div>
                <span
                  className={`badge ${
                    user.blocked
                      ? "badge-danger"
                      : user.role === "admin"
                        ? "badge-accent"
                        : "badge-muted"
                  }`}
                >
                  {user.blocked ? "blocked" : user.role}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Latest listings</h2>
            <Link href="/dashboard/admin/items" className="text-sm font-medium text-accent">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {(overview?.recentItems ?? []).map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted">
                    {item.category} · {item.createdByEmail}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/items/${item.id}`} className="btn btn-secondary btn-sm">
                    View
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteId(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Remove listing"
        description="This permanently deletes the tool from the Lattice catalog."
        confirmLabel="Delete listing"
        danger
        loading={loadingAction}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleGuard allow="admin">
      <AdminHome />
    </RoleGuard>
  );
}
