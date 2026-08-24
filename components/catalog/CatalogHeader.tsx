import { Bell, Heart, MapPin } from "lucide-react";

export default function CatalogHeader() {
  return (
    <header className="px-5 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/45">
            Welcome to
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight">
            Power Mobile
          </h1>

          <div className="mt-2 flex items-center gap-1 text-xs text-black/50">
            <MapPin size={14} strokeWidth={1.8} />
            <span>Bahir Dar</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition-transform duration-200 active:scale-90"
            aria-label="Favorites"
          >
            <Heart size={19} strokeWidth={1.8} />
          </button>

          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition-transform duration-200 active:scale-90"
            aria-label="Notifications"
          >
            <Bell size={19} strokeWidth={1.8} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C3D809]" />
          </button>
        </div>
      </div>
    </header>
  );
}