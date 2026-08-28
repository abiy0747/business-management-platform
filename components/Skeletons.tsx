import {
  ArrowLeft,
  MapPin,
} from "lucide-react";

export function CatalogHeaderSkeleton() {
  return (
    <header className="px-5 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-20 animate-pulse rounded-full bg-black/[0.07]" />

          <div className="mt-3 h-7 w-40 animate-pulse rounded-lg bg-black/[0.07]" />

          <div className="mt-3 flex items-center gap-1.5">
            <MapPin size={14} className="text-black/20" />
            <div className="h-3 w-16 animate-pulse rounded-full bg-black/[0.07]" />
          </div>
        </div>

        <div className="h-10 w-10 animate-pulse rounded-full bg-black/[0.07]" />
      </div>
    </header>
  );
}

export function PromoBannerSkeleton() {
  return (
    <div className="mt-5 h-[185px] animate-pulse rounded-[28px] bg-black/[0.06]" />
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="mt-8">
      <div className="h-12 animate-pulse rounded-2xl bg-black/[0.06]" />

      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 animate-pulse rounded-full bg-black/[0.06]" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-black/[0.06]" />
        <div className="h-8 w-16 animate-pulse rounded-full bg-black/[0.06]" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[22px] border border-black/[0.05]"
          >
            <div className="aspect-square animate-pulse bg-black/[0.06]" />
            <div className="space-y-2.5 p-3.5">
              <div className="h-2.5 w-14 animate-pulse rounded-full bg-black/[0.06]" />
              <div className="h-3.5 w-full animate-pulse rounded bg-black/[0.06]" />
              <div className="h-3.5 w-2/3 animate-pulse rounded bg-black/[0.06]" />
              <div className="h-8 w-full animate-pulse rounded-xl bg-black/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CatalogPageSkeleton() {
  return (
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
      <div className="mx-auto max-w-md">
        <CatalogHeaderSkeleton />
        <div className="px-5">
          <PromoBannerSkeleton />
          <ProductGridSkeleton />
        </div>
      </div>
    </main>
  );
}

export function SimplePageSkeleton() {
  return (
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
      <div className="mx-auto max-w-md px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-black/[0.07]" />
          <div className="space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-black/[0.07]" />
            <div className="h-5 w-28 animate-pulse rounded bg-black/[0.07]" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="h-64 animate-pulse rounded-[28px] bg-black/[0.07]" />
          <div className="h-24 animate-pulse rounded-[24px] bg-black/[0.07]" />
          <div className="h-24 animate-pulse rounded-[24px] bg-black/[0.07]" />
        </div>
      </div>
    </main>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="space-y-2">
          <div className="h-2.5 w-32 animate-pulse rounded-full bg-black/[0.06]" />
          <div className="h-8 w-56 animate-pulse rounded bg-black/[0.08]" />
          <div className="h-4 w-80 animate-pulse rounded bg-black/[0.06]" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-black/[0.06]"
            />
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div className="h-64 animate-pulse rounded-3xl bg-black/[0.06]" />
          <div className="h-72 animate-pulse rounded-3xl bg-black/[0.06]" />
        </div>
      </div>
    </div>
  );
}