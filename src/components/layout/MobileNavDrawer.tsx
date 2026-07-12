"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiCompass,
  FiFolder,
  FiGrid,
  FiHome,
  FiInfo,
  FiLayers,
  FiMail,
  FiPlusCircle,
  FiUsers,
} from "react-icons/fi";

export type MobileNavLink = {
  href: string;
  label: string;
};

const iconByHref: Record<string, IconType> = {
  "/": FiHome,
  "/explore": FiCompass,
  "/about": FiInfo,
  "/contact": FiMail,
  "/dashboard/user": FiBriefcase,
  "/dashboard/admin": FiGrid,
  "/dashboard/admin/users": FiUsers,
  "/dashboard/admin/items": FiLayers,
  "/items/add": FiPlusCircle,
  "/items/manage": FiFolder,
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface MobileNavDrawerProps {
  open: boolean;
  links: MobileNavLink[];
  pathname: string;
  isLoggedIn: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export function MobileNavDrawer({
  open,
  links,
  pathname,
  isLoggedIn,
  onClose,
  onSignOut,
}: MobileNavDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 top-16 z-[55] bg-ink/15 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-0 top-16 z-[56] border-b border-line bg-white md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="container-pad py-3">
              <ul className="space-y-0.5">
                {links.map((link, index) => {
                  const Icon = iconByHref[link.href] ?? FiCompass;
                  const active = isActivePath(pathname, link.href);

                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * index, duration: 0.18 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition ${
                          active
                            ? "bg-accent-soft font-semibold text-accent"
                            : "font-medium text-ink/80 hover:bg-surface"
                        }`}
                      >
                        <Icon size={16} className="shrink-0 opacity-70" />
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-3 border-t border-line pt-3">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="btn btn-secondary w-full"
                  >
                    Sign out
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="btn btn-secondary"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="btn btn-primary"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
