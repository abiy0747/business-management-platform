import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Send, Phone } from "lucide-react";
import {
  getStoreBySlug,
  getStoreProductData,
} from "@/lib/catalog-data";

type StoreProductPageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Render as a blocking, on-demand route so unknown slugs or
// products return a real HTTP 404 (a streaming shell would lock
// the response at 200 before notFound() streams). Data fetching
// below is still cached per-slug via "use cache" and
// revalidated on catalog mutations.
export const instant = false;

export default async function StoreProductPage({
  params,
}: StoreProductPageProps) {
  const { slug, id } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const product = await getStoreProductData(slug, id);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const storeHref = `/store/${store.slug}`;

  return (
    <main className="min-h-screen bg-white text-[#222022]">
      <div className="mx-auto max-w-md">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex items-center justify-between px-5 py-5">
          <Link
            href={storeHref}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-transform active:scale-90"
            aria-label="Back to store"
          >
            <ArrowLeft size={19} />
          </Link>

          <span className="text-sm font-bold">
            {store.name}
          </span>

          <div className="h-10 w-10" />
        </header>

        {/* ===================================================
            PRODUCT IMAGE
        =================================================== */}

        <div className="mx-5 overflow-hidden rounded-[28px] bg-[#F5F5F5]">
          <div className="relative flex aspect-square items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                width={500}
                height={500}
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl">📦</div>

                <span className="mt-3 text-sm text-black/30">
                  No product image
                </span>
              </div>
            )}

            <div className="absolute left-4 top-4">
              {isOutOfStock ? (
                <span className="rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-bold text-black shadow-sm">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="rounded-full bg-[#C3D809] px-3 py-1.5 text-[10px] font-bold text-[#222022] shadow-sm">
                  In Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            PRODUCT INFORMATION
        =================================================== */}

        <section className="px-5 pb-10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
            {product.category}
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <Star
              size={15}
              fill="currentColor"
              className="text-[#C3D809]"
            />

            <span className="text-sm font-semibold">4.9</span>

            <span className="text-xs text-black/40">
              (30 reviews)
            </span>
          </div>

          <div className="mt-5">
            <span className="text-2xl font-black">
              {formatCurrency(Number(product.price))} ETB
            </span>
          </div>

          {product.description && (
            <div className="mt-6 rounded-2xl bg-[#F7F7F7] p-4">
              <p className="text-sm leading-6 text-black/60">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-black/10 p-4">
            <div>
              <span className="text-sm font-semibold">
                Availability
              </span>

              {!isOutOfStock && (
                <p className="mt-1 text-[10px] text-black/35">
                  {product.stock} units available
                </p>
              )}
            </div>

            {isOutOfStock ? (
              <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">
                Low Stock
              </span>
            ) : (
              <span className="rounded-full bg-[#C3D809]/20 px-3 py-1.5 text-xs font-bold text-[#4D5A00]">
                In Stock
              </span>
            )}
          </div>

          {/* =================================================
              CONTACT THIS STORE
          ================================================= */}

          {isOutOfStock || !product.isAvailable ? (
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-2xl bg-black/10 py-4 text-sm font-bold text-black/30"
            >
              {isOutOfStock
                ? "Out of Stock"
                : "Currently Unavailable"}
            </button>
          ) : (
            <>
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#222022] py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.98]"
                >
                  <Phone size={16} />
                  Call {store.name}
                </a>
              )}

              {store.telegram ? (
                <a
                  href={`https://t.me/${store.telegram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 py-4 text-sm font-bold text-[#222022] transition-all duration-300 hover:border-[#C3D809] hover:bg-[#C3D809]/10 active:scale-[0.98]"
                >
                  <Send size={16} />
                  Message on Telegram
                </a>
              ) : (
                <Link
                  href={storeHref}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 py-4 text-sm font-bold text-[#222022] transition-all duration-300 hover:border-[#C3D809] hover:bg-[#C3D809]/10 active:scale-[0.98]"
                >
                  Visit {store.name}
                </Link>
              )}
            </>
          )}

          <p className="mt-3 text-center text-xs text-black/25">
            Product ID: {product.id}
          </p>
        </section>
      </div>
    </main>
  );
}