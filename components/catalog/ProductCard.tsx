import { Heart, Star } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  category: string;
  image: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[22px] border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]">
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all duration-200 hover:bg-[#C3D809] active:scale-90"
          aria-label={`Add ${product.name} to favorites`}
        >
          <Heart size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
          {product.category}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-bold leading-5">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <Star
            size={13}
            fill="currentColor"
            className="text-[#C3D809]"
          />

          <span className="text-xs font-semibold">4.9</span>

          <span className="text-[10px] text-black/35">
            (30)
          </span>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-base font-black">
            {product.price.toLocaleString()} ETB
          </span>

          <span className="text-xs text-black/35 line-through">
            {product.oldPrice.toLocaleString()} ETB
          </span>
        </div>

        <button className="mt-3 w-full rounded-xl bg-[#222022] py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.97]">
          View product
        </button>
      </div>
    </article>
  );
}