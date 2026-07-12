"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dashboardPathForRole } from "@/lib/auth-client";
import { useAppRole } from "@/lib/use-app-role";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { role, isPending, session } = useAppRole();

  useEffect(() => {
    if (isPending) return;
    if (!session || !role) {
      router.replace("/login");
      return;
    }
    router.replace(dashboardPathForRole(role));
  }, [isPending, session, role, router]);

  return (
    <div className="container-pad py-20 text-center text-muted">
      Redirecting to your dashboard…
    </div>
  );
}
