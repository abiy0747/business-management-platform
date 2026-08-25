import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Package,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import CategoriesClient from "@/components/catalog/CategoriesClient";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const categoryData = categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-white pb-24 text-[#222022]">
      <div className="relative mx-auto max-w-md">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full bg-[#C3D809]/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-28 top-[520px] h-72 w-72 rounded-full bg-black/[0.035] blur-3xl" />

        {/* Header */}
        <header className="relative z-10 flex items-center gap-3 px-5 pb-4 pt-6">
          <Link
            href="/catalog"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-[#C3D809] hover:bg-[#C3D809] active:scale-90"
            aria-label="Back to catalog"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </Link>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
              Explore
            </p>

            <h1 className="text-xl font-black tracking-tight">
              Categories
            </h1>
          </div>
        </header>

        {/* Hero */}
        <section className="relative px-5 pt-6">
          <div className="relative overflow-hidden rounded-[30px] bg-[#222022] px-6 py-8 text-white shadow-[0_20px_60px_rgba(34,32,34,0.15)]">
            {/* Animated glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 animate-pulse rounded-full bg-[#C3D809]/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full border border-[#C3D809]/10" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022] shadow-[0_10px_30px_rgba(195,216,9,0.2)]">
                <Package size={22} />
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Find what you need
              </p>

              <h2 className="mt-2 text-[31px] font-black leading-[1.05] tracking-tight">
                Shop by
                <br />
                category.
              </h2>

              <p className="mt-4 max-w-[285px] text-sm leading-6 text-white/50">
                Explore our mobile accessories by category and
                quickly find the products you're looking for.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C3D809]" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  {categories.length} categories
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category title */}
        <section className="px-5 pt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
            Browse collection
          </p>

          <h2 className="mt-2 text-[25px] font-black leading-tight tracking-tight">
            What are you
            <br />
            looking for?
          </h2>
        </section>

        {/* Categories */}
        <CategoriesClient categories={categoryData} />

        {/* Bottom CTA */}
        <section className="px-5 pb-8 pt-10">
          <Link href="/catalog">
            <div className="group relative overflow-hidden rounded-[24px] bg-[#C3D809] px-6 py-5 shadow-[0_15px_40px_rgba(195,216,9,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(195,216,9,0.22)]">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#222022]/50">
                    Browse everything
                  </p>

                  <h3 className="mt-1 text-lg font-black">
                    View all products
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#222022] text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={19} />
                </div>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}