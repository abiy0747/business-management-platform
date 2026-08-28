"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const {
    favorites,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  return (
    <main className="min-h-screen overflow-hidden bg-white pb-24 text-[#222022]">
      <div className="relative mx-auto max-w-md">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-[#C3D809]/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 top-[500px] h-64 w-64 rounded-full bg-black/[0.04] blur-3xl" />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center justify-between px-5 pb-4 pt-6"
        >
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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                Your collection
              </p>

              <h1 className="text-xl font-black tracking-tight">
                Favorites
              </h1>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="flex h-9 items-center gap-2 rounded-full border border-black/10 px-3 text-[10px] font-bold text-black/50 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </motion.header>

        {/* Hero */}
        <section className="px-5 pt-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-[30px] bg-[#222022] px-6 py-7 text-white shadow-[0_20px_60px_rgba(34,32,34,0.15)]"
          >
            <motion.div
              animate={{
                x: [0, 25, 0],
                y: [0, -15, 0],
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C3D809]/20 blur-3xl"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full border border-[#C3D809]/20"
            />

            <div className="relative z-10">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022]"
              >
                <Heart
                  size={22}
                  fill="currentColor"
                />
              </motion.div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Saved for later
              </p>

              <h2 className="mt-2 text-[30px] font-black leading-tight">
                {favorites.length === 0
                  ? "Nothing saved yet."
                  : `${favorites.length} ${
                      favorites.length === 1
                        ? "favorite"
                        : "favorites"
                    }`}
              </h2>

              <p className="mt-3 max-w-[280px] text-sm leading-6 text-white/50">
                Keep the accessories you love close
                by saving them to your favorites.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
            className="px-5 pt-10"
          >
            <div className="rounded-[28px] border border-dashed border-black/10 bg-[#f8f8f6] px-6 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C3D809]/20">
                <Heart
                  size={25}
                  className="text-[#222022]"
                />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Your favorites are empty
              </h3>

              <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-black/40">
                Tap the heart on any product you love
                and it will appear here.
              </p>

              <Link
                href="/catalog"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#222022] px-6 py-3 text-xs font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-95"
              >
                <ShoppingBag size={15} />
                Explore products
              </Link>
            </div>
          </motion.section>
        ) : (
          /* Favorite products */
          <section className="px-5 pt-8">
            <div className="grid grid-cols-2 gap-3">
              {favorites.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                  className="group overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={400}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeFavorite(product.id)
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#C3D809] text-[#222022] shadow-sm transition-all hover:scale-110 active:scale-90"
                      aria-label={`Remove ${product.name} from favorites`}
                    >
                      <Heart
                        size={16}
                        fill="currentColor"
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                      {product.category}
                    </p>

                    <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-bold leading-5">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-base font-black">
                      {product.price.toLocaleString()} ETB
                    </p>

                    <Link
                      href={`/products/${product.id}`}
                      className="mt-3 block w-full rounded-xl bg-[#222022] py-2.5 text-center text-xs font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.97]"
                    >
                      View product
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </main>
  );
}