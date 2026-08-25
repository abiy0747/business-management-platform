import Link from "next/link";
import { ArrowLeft, Heart, Star } from "lucide-react";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-white text-[#222022]">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-5">
          <Link
            href="/catalog"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-transform active:scale-90"
          >
            <ArrowLeft size={19} />
          </Link>

          <span className="text-sm font-bold">
            Product Details
          </span>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-all active:scale-90"
            aria-label="Add to favorites"
          >
            <Heart size={18} />
          </button>
        </header>

        {/* Product Image */}
        <div className="mx-5 overflow-hidden rounded-[28px] bg-[#f5f5f5]">
          <div className="flex aspect-square items-center justify-center">
            <span className="text-sm text-black/30">
              Product image
            </span>
          </div>
        </div>

        {/* Product Information */}
        <section className="px-5 pb-10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
            Mobile Accessories
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Premium Product
          </h1>

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

          <div className="mt-5">
            <span className="text-2xl font-black">
              1,200 ETB
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-[#f7f7f7] p-4">
            <p className="text-sm leading-6 text-black/60">
              Premium mobile accessory designed for everyday
              use. High-quality materials, modern design, and
              reliable performance.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-black/10 p-4">
            <span className="text-sm font-semibold">
              Availability
            </span>

            <span className="rounded-full bg-[#C3D809]/20 px-3 py-1.5 text-xs font-bold">
              In Stock
            </span>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-[#222022] py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.98]">
            Contact Seller
          </button>

          <p className="mt-3 text-center text-xs text-black/35">
            Product ID: {id}
          </p>
        </section>
      </div>
    </main>
  );
}