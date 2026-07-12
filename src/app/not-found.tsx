import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-pad flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-[family-name:var(--font-display)] text-5xl text-accent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">
        The page you requested is not part of Lattice.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-accent"
      >
        Back to home
      </Link>
    </div>
  );
}
