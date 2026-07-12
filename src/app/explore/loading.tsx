export default function ExploreLoading() {
  return (
    <div className="container-pad py-10">
      <div className="h-8 w-40 animate-pulse rounded bg-line/70" />
      <div className="mt-4 h-10 w-72 animate-pulse rounded bg-line/60" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-[16px] bg-line/50"
          />
        ))}
      </div>
    </div>
  );
}
