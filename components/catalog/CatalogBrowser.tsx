"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  costPrice: number | string;
  stock: number;
  imageUrl: string | null;
  isAvailable: boolean;
  category: {
    id: string;
    name: string;
  };
};

type CatalogBrowserProps = {
  products: Product[];
  categories: string[];
};



export default function CatalogBrowser({
  products,
  categories,
}: CatalogBrowserProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
  product.name.toLowerCase().includes(searchTerm) ||
  product.category.name.toLowerCase().includes(searchTerm);

const matchesCategory =
  category === "All" || product.category.name === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <section>
      {/* Search */}
      <div className="group flex h-12 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 shadow-[0_8px_30px_rgba(34,32,34,0.04)] transition-all duration-300 focus-within:border-[#C3D809]">
        <Search
          size={19}
          className="shrink-0 text-black/40 group-focus-within:text-[#222022]"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search accessories..."
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 transition-transform active:scale-90"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["All", ...categories].map((item) => {
          const active = category === item;

          return (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                active
                  ? "bg-[#C3D809] text-[#222022] shadow-sm"
                  : "border border-black/10 bg-white text-black/50 hover:border-black/20 hover:text-[#222022]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Products
          </h2>

          <p className="mt-1 text-xs text-black/40">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-black/10 px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C3D809]/20">
            <Search size={22} />
          </div>

          <h3 className="mt-4 font-bold">
            No products found
          </h3>

          <p className="mt-1 text-sm text-black/40">
            Try another search or category.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="mt-5 rounded-full bg-[#222022] px-5 py-2.5 text-xs font-bold text-white transition-transform active:scale-95"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}