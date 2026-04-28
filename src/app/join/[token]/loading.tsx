import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-3">
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-xl border bg-card p-6">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="mt-2 h-4 w-80" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="mt-5 h-28 w-full" />
          <Skeleton className="mt-5 h-28 w-full" />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-4 h-20 w-full" />
          <Skeleton className="mt-4 h-11 w-full" />
        </div>
      </div>
    </div>
  );
}

