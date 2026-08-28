
import Link from "next/link";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================

  if (!product) {
    return (
      <main className="min-h-screen bg-white text-[#222022]">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">
          <div className="w-full text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F7F7F7]">
              <span className="text-2xl">📦</span>
            </div>

            <h1 className="mt-5 text-xl font-black">
              Product not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/40">
              This product may have been removed or is no
              longer available.
            </p>

            <Link
              href="/catalog"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#222022] px-5 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.97]"
            >
              <ArrowLeft size={16} />
              Back to Catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    product.stock > 0 && product.stock <= 5;

  return (
    <main className="min-h-screen bg-white text-[#222022]">
      <div className="mx-auto max-w-md">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex items-center justify-between px-5 py-5">
          <Link
            href="/catalog"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-transform active:scale-90"
            aria-label="Back to catalog"
          >
            <ArrowLeft size={19} />
          </Link>

          <span className="text-sm font-bold">
            Product Details
          </span>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-all active:scale-90"
            aria-label="Add to favorites"
          >
            <Heart size={18} />
          </button>
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

            {/* Stock badge */}

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
          {/* Category */}

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
            {product.category.name}
          </p>

          {/* Name */}

          <h1 className="mt-2 text-2xl font-black tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}

          <div className="mt-3 flex items-center gap-2">
            <Star
              size={15}
              fill="currentColor"
              className="text-[#C3D809]"
            />

            <span className="text-sm font-semibold">
              4.9
            </span>

            <span className="text-xs text-black/40">
              (30 reviews)
            </span>
          </div>

          {/* Price */}

          <div className="mt-5">
            <span className="text-2xl font-black">
              {formatCurrency(
                Number(product.price)
              )}{" "}
              ETB
            </span>
          </div>

          {/* Description */}

          {product.description && (
            <div className="mt-6 rounded-2xl bg-[#F7F7F7] p-4">
              <p className="text-sm leading-6 text-black/60">
                {product.description}
              </p>
            </div>
          )}

          {/* =================================================
              AVAILABILITY
          ================================================= */}

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
              CONTACT SELLER
          ================================================= */}

          <button
            type="button"
            disabled={
              isOutOfStock ||
              !product.isAvailable
            }
            className="mt-6 w-full rounded-2xl bg-[#222022] py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/30"
          >
            {isOutOfStock
              ? "Out of Stock"
              : !product.isAvailable
                ? "Currently Unavailable"
                : "Contact Seller"}
          </button>

          {/* Product ID */}

          <p className="mt-3 text-center text-xs text-black/25">
            Product ID: {product.id}
          </p>
        </section>
      </div>
    </main>
  );
}
