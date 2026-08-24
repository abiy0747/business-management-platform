"use client";

import {
  Grid2X2,
  Home,
  Search,
  UserRound,
} from "lucide-react";

const navigation = [
  {
    label: "Home",
    icon: Home,
    active: true,
  },
  {
    label: "Categories",
    icon: Grid2X2,
    active: false,
  },
  {
    label: "Search",
    icon: Search,
    active: false,
  },
  {
    label: "Profile",
    icon: UserRound,
    active: false,
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-black/10 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-3 backdrop-blur-xl">
      <div className="grid grid-cols-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`group flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 ${
                item.active
                  ? "text-[#222022]"
                  : "text-black/40"
              }`}
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                  item.active
                    ? "bg-[#C3D809]"
                    : "group-hover:bg-black/5"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
              </span>

              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}