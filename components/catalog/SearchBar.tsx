"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="group flex h-12 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 shadow-[0_8px_30px_rgba(34,32,34,0.04)] transition-all duration-300 focus-within:border-[#C3D809] focus-within:shadow-[0_8px_30px_rgba(195,216,9,0.12)]">
      <Search
        size={20}
        className="text-black/40 transition-colors duration-300 group-focus-within:text-[#222022]"
      />

      <input
        type="text"
        placeholder="Search accessories..."
        className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
      />
    </div>
  );
}