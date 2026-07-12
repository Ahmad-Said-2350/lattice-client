"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getUserRole, useSession, type AppRole } from "@/lib/auth-client";

interface MeResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: AppRole;
  };
}

/** Resolves role from session + /api/me fallback (MongoDB role field). */
export function useAppRole() {
  const { data: session, isPending } = useSession();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (isPending) return;

      if (!session?.user) {
        if (active) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      const sessionRole = getUserRole(
        session.user as { role?: string | null }
      );

      // Prefer live role from API (source of truth in MongoDB)
      try {
        const me = await apiFetch<MeResponse>("/api/me");
        if (!active) return;
        setRole(me.user.role);
      } catch {
        if (!active) return;
        setRole(sessionRole);
      } finally {
        if (active) setLoading(false);
      }
    }

    setLoading(true);
    load();

    return () => {
      active = false;
    };
  }, [session, isPending]);

  return {
    session,
    role,
    isAdmin: role === "admin",
    isUser: role === "user",
    isPending: isPending || loading,
  };
}
