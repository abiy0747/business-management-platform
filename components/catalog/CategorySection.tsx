"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Cable,
  Headphones,
  Package,
  PlugZap,
  Smartphone,
} from "lucide-react";

type CategorySectionProps = {
  categories: string[];
  selectedCategory: string;
};

const categoryIcons: Record<
  string,
  ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  Cases: Smartphone,
  Chargers: PlugZap,
  Cables: Cable,
  Audio: Headphones,
};

export default function CategorySection({
  categories,
  selectedCategory,
}: CategorySectionProps) {
  const visibleCategories = categories.slice(0, 4);

  return (
    <section
      id="categories"
      className="mt-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">
          Categories
        </h2>

        <Link
          href="/categories"
          className="group flex items-center gap-1 text-sm font-bold transition-all duration-300 hover:text-[#C3D809]"
        >
          See all
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Category list */}
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {visibleCategories.map((category) => {
          const Icon =
            categoryIcons[category] || Package;

          const isActive =
            selectedCategory.toLowerCase() ===
            category.toLowerCase();

          return (
            <Link
              key={category}
              href={`/catalog?category=${encodeURIComponent(
                category
              )}`}
              className="group shrink-0"
            >
              <div
                className={`flex h-[84px] w-[84px] items-center justify-center rounded-[24px] border transition-all duration-300 ${
                  isActive
                    ? "border-[#C3D809] bg-[#C3D809] shadow-[0_12px_30px_rgba(195,216,9,0.18)]"
                    : "border-black/10 bg-white hover:-translate-y-1 hover:border-[#C3D809]/50 hover:shadow-[0_12px_30px_rgba(34,32,34,0.07)]"
                }`}
              >
                <Icon
                  size={25}
                  strokeWidth={1.7}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-[#222022] scale-110"
                      : "text-[#222022] group-hover:scale-110"
                  }`}
                />
              </div>

              <p
                className={`mt-2 text-center text-xs font-bold transition-colors duration-300 ${
                  isActive
                    ? "text-[#222022]"
                    : "text-black/60 group-hover:text-[#222022]"
                }`}
              >
                {category}
              </p>
            </Link>
          );
        })}

        {/* More */}
        <Link
          href="/categories"
          className="group shrink-0"
        >
          <div className="flex h-[84px] w-[84px] items-center justify-center rounded-[24px] border border-black/10 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C3D809]/50 group-hover:shadow-[0_12px_30px_rgba(34,32,34,0.07)]">
            <Package
              size={25}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <p className="mt-2 text-center text-xs font-bold text-black/60">
            More
          </p>
        </Link>
      </div>
    </section>
  );
}