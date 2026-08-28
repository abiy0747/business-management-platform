"use client";

import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  category: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { isFavorite, toggleFavorite } =
    useFavorites();

  const favorite = isFavorite(product.id);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-black/25">
            No image
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={() =>
            toggleFavorite({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.imageUrl ?? "",
              category: product.category,
            })
          }
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-all duration-300 active:scale-90 ${
            favorite
              ? "bg-[#C3D809] text-[#222022] scale-105"
              : "bg-white/90 hover:bg-[#C3D809]"
          }`}
          aria-label={
            favorite
              ? `Remove ${product.name} from favorites`
              : `Add ${product.name} to favorites`
          }
        >
          <Heart
            size={16}
            strokeWidth={1.8}
            fill={favorite ? "currentColor" : "none"}
            className="transition-all duration-300"
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

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star
            size={13}
            fill="currentColor"
            className="text-[#C3D809]"
          />

          <span className="text-xs font-semibold">
            4.9
          </span>

          <span className="text-[10px] text-black/35">
            (30)
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <span className="text-base font-black">
            {product.price.toLocaleString()} ETB
          </span>
        </div>

        {/* Product link */}
        <Link
          href={`/products/${product.id}`}
          className="mt-3 block w-full rounded-xl bg-[#222022] py-2.5 text-center text-xs font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.97]"
        >
          View product
        </Link>
      </div>
    </article>
  );
}