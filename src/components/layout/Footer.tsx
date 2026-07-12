import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const footerLinks = [
  {
    title: "Product",
    links: [
      { href: "/explore", label: "Explore tools" },
      { href: "/items/add", label: "List a tool" },
      { href: "/about", label: "About Lattice" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/about#mission", label: "Mission" },
      { href: "/contact#support", label: "Support" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Create account" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-white">
      <div className="container-pad grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-display text-2xl font-semibold">Lattice</p>
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            A calm marketplace for software that teams actually keep. Discover,
            compare, and list digital tools with clarity.
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://x.com", icon: <FaXTwitter size={16} />, label: "X" },
              { href: "https://github.com", icon: <FiGithub size={16} />, label: "GitHub" },
              {
                href: "https://linkedin.com",
                icon: <FiLinkedin size={16} />,
                label: "LinkedIn",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="rounded-[12px] border border-white/15 p-2.5 hover:bg-white/10"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title}>
            <p className="mb-4 text-sm font-semibold tracking-wide">{group.title}</p>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-pad flex flex-col gap-4 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <FiMail /> hello@lattice.app
            </span>
            <span className="inline-flex items-center gap-2">
              <FiPhone /> +1 (415) 555-0190
            </span>
            <span className="inline-flex items-center gap-2">
              <FiMapPin /> San Francisco, CA
            </span>
          </div>
          <p>© {new Date().getFullYear()} Lattice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
