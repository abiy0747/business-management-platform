"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Headphones,
  Package,
  Smartphone,
  Zap,
  Cable,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

type Category = {
  id: string;
  name: string;
  productCount: number;
};

type CategoriesClientProps = {
  categories: Category[];
};

const icons = [
  Smartphone,
  Zap,
  Headphones,
  Cable,
  ShieldCheck,
  Package,
];

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <section className="grid grid-cols-2 gap-3 px-5 pt-6">
      {categories.map((category, index) => {
        let Icon;

        const categoryName = category.name.trim().toLowerCase();

        // Custom category icons
        if (categoryName === "audio") {
          Icon = Headphones;
        } else if (categoryName === "cases") {
          Icon = Smartphone;
        } else {
          Icon = icons[index % icons.length];
        }

        return (
          <motion.div
            key={category.id}
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -6,
              scale: 1.015,
            }}
          >
            <Link
              href={`/catalog?category=${encodeURIComponent(
                category.name
              )}`}
              className="group relative block overflow-hidden rounded-[25px] border border-black/10 bg-[#f8f8f6] p-5 transition-all duration-300 hover:border-[#C3D809]/60 hover:bg-white hover:shadow-[0_18px_45px_rgba(34,32,34,0.09)]"
            >
              {/* Background glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#C3D809]/0 blur-2xl transition-all duration-500 group-hover:bg-[#C3D809]/20" />

              {/* Icon */}
              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.08,
                }}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#222022] shadow-sm transition-all duration-300 group-hover:bg-[#C3D809]"
              >
                <Icon size={21} strokeWidth={1.8} />
              </motion.div>

              {/* Category info */}
              <div className="relative mt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                  Category
                </p>

                <h3 className="mt-1 line-clamp-2 min-h-[42px] text-base font-black leading-5">
                  {category.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-black/40">
                    {category.productCount}{" "}
                    {category.productCount === 1
                      ? "product"
                      : "products"}
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:bg-[#222022] group-hover:text-white">
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}

      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 rounded-[25px] border border-dashed border-black/10 px-6 py-12 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C3D809]/20">
            <Package size={22} />
          </div>

          <h3 className="mt-4 font-black">
            No categories yet
          </h3>

          <p className="mt-1 text-sm text-black/40">
            Categories will appear here once products are added.
          </p>
        </motion.div>
      )}
    </section>
  );
}