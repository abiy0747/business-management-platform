import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Package,
  Sparkles,
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
    <main className="min-h-screen overflow-hidden bg-[#F8F8F6] pb-24 text-[#222022]">
      <div className="relative mx-auto max-w-md">

        {/* ========================================================= */}
        {/* BACKGROUND DECORATION */}
        {/* ========================================================= */}

        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-[#C3D809]/15 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 top-[550px] h-80 w-80 rounded-full bg-black/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-[900px] h-56 w-56 rounded-full bg-[#C3D809]/10 blur-3xl" />

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <header className="relative z-20 flex items-center justify-between px-5 pb-4 pt-6">

          <div className="flex items-center gap-3">

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
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/35">
                Explore collection
              </p>

              <h1 className="mt-0.5 text-xl font-black tracking-tight">
                Categories
              </h1>
            </div>

          </div>

          {/* Category count */}
          <div className="rounded-full border border-black/10 bg-white px-3 py-2 shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-wider text-black/50">
              {categories.length} total
            </span>
          </div>

        </header>

        {/* ========================================================= */}
        {/* LUXURY HERO */}
        {/* ========================================================= */}

        <section className="relative px-5 pt-6">

          <div className="group relative h-[310px] overflow-hidden rounded-[32px] bg-[#222022] shadow-[0_25px_70px_rgba(34,32,34,0.18)]">

            {/* ===================================================== */}
            {/* RIGHT IMAGE */}
            {/* ===================================================== */}

            <div className="absolute inset-y-0 right-0 w-[58%] overflow-hidden">

              <img
                src="/images/store.jpg"
                alt="Mobile accessories collection"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Image darkening */}
              <div className="absolute inset-0 bg-black/[0.08]" />

              {/* Cinematic image gradient */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#222022]/50 to-transparent" />

            </div>

            {/* ===================================================== */}
            {/* LEFT CONTENT */}
            {/* ===================================================== */}

            <div className="absolute inset-y-0 left-0 z-20 flex w-[63%] flex-col justify-center px-6">

              {/* Glow */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#C3D809]/15 blur-3xl" />

              {/* Icon */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022] shadow-[0_12px_35px_rgba(195,216,9,0.22)]">
                <Package size={21} />
              </div>

              <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">
                Find what you need
              </p>

              <h2 className="mt-2 text-[31px] font-black leading-[0.98] tracking-tight text-white">
                Shop by
                <br />
                category.
              </h2>

              <p className="mt-4 max-w-[175px] text-[11px] leading-5 text-white/45">
                Explore our collection and discover the perfect accessories
                for your everyday tech.
              </p>

              {/* Status */}
              <div className="mt-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-md">

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C3D809] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C3D809]" />
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/55">
                  {categories.length} categories available
                </span>

              </div>

            </div>

            {/* ===================================================== */}
            {/* SMOOTH CURVED SEPARATION */}
            {/* ===================================================== */}

            <div className="pointer-events-none absolute inset-y-0 left-[37%] z-10 w-[31%]">

              <svg
                viewBox="0 0 160 310"
                preserveAspectRatio="none"
                className="h-full w-full"
              >

                <path
                  d="
                    M 0 0
                    C 72 18, 110 60, 84 100
                    C 55 143, 48 175, 84 211
                    C 118 247, 105 286, 0 310
                    L 0 310
                    Z
                  "
                  fill="#222022"
                />

              </svg>

            </div>

            {/* ===================================================== */}
            {/* CURVE HIGHLIGHT */}
            {/* ===================================================== */}

            <div className="pointer-events-none absolute inset-y-0 left-[50%] z-20 w-2 opacity-20 blur-md">
              <div className="h-full w-full rounded-full bg-black/40" />
            </div>

            {/* ===================================================== */}
            {/* TOP LABEL */}
            {/* ===================================================== */}

            <div className="absolute right-4 top-4 z-30">

              <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 backdrop-blur-md">

                <Sparkles
                  size={10}
                  className="text-[#C3D809]"
                />

                <span className="text-[7px] font-bold uppercase tracking-[0.16em] text-white/70">
                  Premium
                </span>

              </div>

            </div>

            {/* ===================================================== */}
            {/* BOTTOM IMAGE LABEL */}
            {/* ===================================================== */}

            <div className="absolute bottom-4 right-4 z-30">

              <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.16em] text-white/65 backdrop-blur-md">
                Power Mobile
              </span>

            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* CATEGORY INTRO */}
        {/* ========================================================= */}

        <section className="px-5 pb-2 pt-12">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/35">
                Browse collection
              </p>

              <h2 className="mt-2 text-[27px] font-black leading-[1.02] tracking-tight">
                What are you
                <br />
                looking for?
              </h2>

            </div>

            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white">
              <Package
                size={16}
                className="text-black/50"
              />
            </div>

          </div>

          <p className="mt-4 max-w-[310px] text-xs leading-5 text-black/40">
            Browse accessories by category and find exactly what you need.
          </p>

        </section>

        {/* ========================================================= */}
        {/* CATEGORIES */}
        {/* ========================================================= */}

        <section className="relative mt-5">
          <CategoriesClient categories={categoryData} />
        </section>

        {/* ========================================================= */}
        {/* BOTTOM CTA */}
        {/* ========================================================= */}

        <section className="px-5 pb-8 pt-12">

          <Link href="/catalog">

            <div className="group relative overflow-hidden rounded-[28px] bg-[#C3D809] px-6 py-6 shadow-[0_15px_40px_rgba(195,216,9,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(195,216,9,0.24)]">

              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/20 blur-3xl" />

              {/* Decorative circle */}
              <div className="pointer-events-none absolute -bottom-14 -right-10 h-32 w-32 rounded-full border-[12px] border-white/20" />

              <div className="relative z-10 flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#222022]/45">
                    Browse everything
                  </p>

                  <h3 className="mt-1 text-[19px] font-black tracking-tight text-[#222022]">
                    View all products
                  </h3>

                  <p className="mt-1 text-[10px] text-[#222022]/50">
                    Explore the complete collection
                  </p>

                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#222022] text-white shadow-lg transition-transform duration-500 group-hover:rotate-45">

                  <ArrowUpRight size={20} />

                </div>

              </div>

            </div>

          </Link>

        </section>

      </div>
    </main>
  );
}