export function SessionCardSkeleton() {
  return (
    <div className="flex items-center gap-2 w-full p-2">
      <div className="h-10 w-10 bg-zinc-300 animate-pulse rounded-lg" />

      <div className="space-y-1 max-w-40">
        <div className="h-4 w-30 bg-zinc-300 animate-pulse rounded-lg" />
        <div className="h-4 w-30 bg-zinc-300 animate-pulse rounded-lg" />
      </div>

      <div className="h-3 w-10 bg-zinc-300 animate-pulse rounded-lg mb-auto" />
    </div>
  );
}
