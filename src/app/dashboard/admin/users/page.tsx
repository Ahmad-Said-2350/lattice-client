"use client";

import { useEffect, useMemo, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { apiFetch, ApiError } from "@/lib/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  blocked: boolean;
  createdAt?: string;
}

type ModalKind = "role" | "block" | null;

function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load(query = search) {
    setLoading(true);
    try {
      const data = await apiFetch<{ users: AdminUser[] }>(
        `/api/admin/users?search=${encodeURIComponent(query.trim())}`
      );
      setUsers(data.users);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredHint = useMemo(
    () => `${users.length} account${users.length === 1 ? "" : "s"}`,
    [users.length]
  );

  async function applyRole() {
    if (!selected) return;
    setBusy(true);
    const nextRole = selected.role === "admin" ? "user" : "admin";
    try {
      await apiFetch(`/api/admin/users/${selected.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });
      setMessage(`${selected.email} is now ${nextRole}.`);
      setModal(null);
      setSelected(null);
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Role update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyBlock() {
    if (!selected) return;
    setBusy(true);
    try {
      await apiFetch(`/api/admin/users/${selected.id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ blocked: !selected.blocked }),
      });
      setMessage(
        selected.blocked
          ? `${selected.email} has been unblocked.`
          : `${selected.email} has been blocked.`
      );
      setModal(null);
      setSelected(null);
      await load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Status update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-pad py-10">
      <p className="section-label">Governance</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Users</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Promote roles, block abusive accounts, and keep Lattice membership clean.
        Every action opens a confirmation modal.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          className="input-field sm:max-w-sm"
        />
        <Button
          variant="secondary"
          onClick={() => load(search)}
        >
          Search
        </Button>
      </div>

      <p className="mt-3 text-sm text-muted">{filteredHint}</p>
      {message && <p className="mt-2 text-sm text-accent">{message}</p>}

      <div className="panel mt-6">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading users…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin" ? "badge-accent" : "badge-muted"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.blocked ? "badge-danger" : "badge-success"
                        }`}
                      >
                        {user.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelected(user);
                            setModal("role");
                          }}
                        >
                          Change role
                        </Button>
                        <Button
                          size="sm"
                          variant={user.blocked ? "accent" : "danger"}
                          disabled={user.role === "admin"}
                          onClick={() => {
                            setSelected(user);
                            setModal("block");
                          }}
                        >
                          {user.blocked ? "Unblock" : "Block"}
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

      <Modal
        open={modal === "role" && Boolean(selected)}
        title="Change member role"
        description={
          selected
            ? `Update access level for ${selected.email}`
            : undefined
        }
        onClose={() => {
          setModal(null);
          setSelected(null);
        }}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setModal(null);
                setSelected(null);
              }}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={applyRole} disabled={busy}>
              {busy
                ? "Saving…"
                : `Make ${selected?.role === "admin" ? "user" : "admin"}`}
            </Button>
          </>
        }
      >
        <div className="rounded-[12px] bg-surface p-4 text-sm leading-relaxed text-muted">
          <p>
            Current role:{" "}
            <strong className="text-ink">{selected?.role}</strong>
          </p>
          <p className="mt-2">
            Admins can govern users and the full catalog. Users manage only their
            own listings.
          </p>
        </div>
      </Modal>

      <ConfirmModal
        open={modal === "block" && Boolean(selected)}
        title={selected?.blocked ? "Unblock member" : "Block member"}
        description={
          selected?.blocked
            ? `${selected.email} will regain access to Lattice immediately.`
            : `${selected?.email} will be signed out and cannot use Lattice until unblocked.`
        }
        confirmLabel={selected?.blocked ? "Unblock user" : "Block user"}
        danger={!selected?.blocked}
        loading={busy}
        onClose={() => {
          setModal(null);
          setSelected(null);
        }}
        onConfirm={applyBlock}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RoleGuard allow="admin">
      <UsersManager />
    </RoleGuard>
  );
}
