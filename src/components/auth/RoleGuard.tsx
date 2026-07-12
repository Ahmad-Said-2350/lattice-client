"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppRole } from "@/lib/use-app-role";
import type { AppRole } from "@/lib/auth-client";

export function RoleGuard({
  allow,
  children,
}: {
  allow: AppRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { role, isPending, session } = useAppRole();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (role && role !== allow) {
      router.replace(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    }
  }, [isPending, session, role, allow, router]);

  if (isPending || !session || role !== allow) {
    return (
      <div className="container-pad py-20 text-center text-muted">
        Checking {allow} access…
      </div>
    );
  }

  return <>{children}</>;
}
