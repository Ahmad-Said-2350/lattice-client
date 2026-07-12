"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import { dashboardPathForRole, getUserRole, signIn, signOut } from "@/lib/auth-client";

const DEMO_CREDENTIALS = {
  email: "user@lattice.app",
  password: "User@12345",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function safeNext(path: string | null): string | null {
    if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
    return path;
  }

  function fillDemoLogin() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  }

  async function redirectAfterLogin() {
    const destination = safeNext(nextPath);
    if (destination) {
      router.push(destination);
      router.refresh();
      return;
    }

    const me = await apiFetch<{
      user: { role: "user" | "admin" };
    }>("/api/me");
    router.push(dashboardPathForRole(me.user.role));
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn.email({ email, password });

    if (result.error) {
      setLoading(false);
      setError(result.error.message ?? "Unable to sign in.");
      return;
    }

    try {
      await redirectAfterLogin();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        await signOut();
        setError("Your account is blocked. Contact Lattice support.");
      } else {
        const role = getUserRole(result.data?.user as { role?: string });
        router.push(safeNext(nextPath) ?? dashboardPathForRole(role));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel w-full max-w-md p-8">
      <p className="font-display text-3xl font-semibold">Lattice</p>
      <h1 className="mt-3 text-2xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to manage listings, leave reviews, and access your workspace.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <Button
        type="button"
        variant="secondary"
        className="mt-3 w-full"
        onClick={fillDemoLogin}
      >
        Demo login (auto-fill)
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        New to Lattice?{" "}
        <Link href="/register" className="font-semibold text-accent">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-pad flex min-h-[70vh] items-center justify-center py-12">
      <Suspense
        fallback={
          <div className="panel w-full max-w-md p-8 text-sm text-muted">
            Loading sign in…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
