export function ItemSkeleton() {
  return (
    <div className="card-shell animate-pulse">
      <div className="aspect-[16/10] bg-line" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-line" />
        <div className="h-4 w-full rounded bg-line" />
        <div className="h-4 w-2/3 rounded bg-line" />
        <div className="h-10 w-full rounded-xl bg-line" />
      </div>
    </div>
  );
}

export function ItemGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ItemSkeleton key={index} />
      ))}
    </div>
  );
}
