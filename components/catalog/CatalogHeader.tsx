import Link from "next/link";
import {  Heart, MapPin } from "lucide-react";

type CatalogHeaderProps = {
  name: string;
  location: string | null;
};

export default function CatalogHeader({
  name,
  location,
}: CatalogHeaderProps) {
  return (
    <header className="px-5 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/45">
            Welcome to
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight">
            {name}
          </h1>

          {location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-black/50">
              <MapPin size={14} strokeWidth={1.8} />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Favorites */}
          <Link
            href="/favorites"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition-transform duration-200 active:scale-90"
            aria-label="Favorites"
          >
            <Heart size={19} strokeWidth={1.8} />
          </Link>

          
        </div>
      </div>
    </header>
  );
}