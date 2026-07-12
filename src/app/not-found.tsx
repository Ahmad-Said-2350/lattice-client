import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="container-pad flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-lg">
        <EmptyState
          title="Page not found"
          description="The page you requested is not part of Lattice."
          action={
            <Link href="/" className="btn btn-primary">
              Back to home
            </Link>
          }
        />
      </div>
    </div>
  );
}
