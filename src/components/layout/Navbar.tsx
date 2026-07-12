"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { Button } from "@/components/ui/Button";
import { dashboardPathForRole, signOut } from "@/lib/auth-client";
import { PRIMARY_NAV } from "@/lib/nav-links";
import { useAppRole } from "@/lib/use-app-role";

/**
 * Breakpoints:
 * - Mobile:  < 768px  → hamburger + drawer
 * - Tablet+: ≥ 768px  → full nav (no hamburger)
 */
const publicLinks = [...PRIMARY_NAV];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, role, isPending, isAdmin } = useAppRole();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const links = useMemo(() => {
    if (!session || !role) return publicLinks.slice(0, 3);
    if (isAdmin) {
      return [
        { href: "/explore", label: "Explore" },
        { href: "/dashboard/admin", label: "Overview" },
        { href: "/dashboard/admin/users", label: "Users" },
        { href: "/dashboard/admin/items", label: "Catalog" },
      ];
    }
    return [
      ...publicLinks,
      { href: "/dashboard/user", label: "Workspace" },
      { href: "/items/add", label: "List tool" },
      { href: "/items/manage", label: "My tools" },
    ];
  }, [session, role, isAdmin]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled
            ? "border-b border-line bg-white/95 backdrop-blur"
            : "border-b border-transparent bg-white/80 backdrop-blur"
        }`}
      >
        <div className="container-pad flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Lattice
          </Link>

          <nav className="hidden items-center gap-6 md:flex lg:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "font-semibold text-accent"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isPending ? (
              <div className="h-11 w-28 animate-pulse rounded-[12px] bg-line" />
            ) : session && role ? (
              <>
                <span
                  className={`badge ${isAdmin ? "badge-accent" : "badge-muted"}`}
                >
                  {role}
                </span>
                <button
                  type="button"
                  onClick={() => router.push(dashboardPathForRole(role))}
                  className="max-w-[140px] truncate text-sm font-medium text-muted hover:text-ink"
                >
                  {session.user.name}
                </button>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink transition hover:bg-surface md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </header>

      <MobileNavDrawer
        open={open}
        links={links}
        pathname={pathname}
        isLoggedIn={Boolean(session && role)}
        onClose={() => setOpen(false)}
        onSignOut={handleSignOut}
      />
    </>
  );
}
