import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Camera,
  Clock,
  MapPin,
  Phone,
  Send,
  Star,
} from "lucide-react";
import {
  getStoreBySlug,
  getStoreCatalogData,
  type CatalogProduct,
} from "@/lib/catalog-data";

type StorePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
};

// Render as a blocking, on-demand route so an unknown slug
// returns a real HTTP 404 (a streaming shell would lock the
// response at 200 before notFound() streams). Data fetching
// below is still cached per-slug via "use cache" and
// revalidated on catalog mutations.
export const instant = false;

export default async function StorePage({
  params,
  searchParams,
}: StorePageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const data = await getStoreCatalogData(store.slug);

  const selectedCategory = search.category || "All";

  const filteredProducts =
    selectedCategory === "All"
      ? data.products
      : data.products.filter(
          (product) => product.category === selectedCategory
        );

  const location = store.address
    ? store.address.split(",")[0]
    : null;

  return (
    <main className="min-h-screen bg-white text-[#222022]">
      <div className="mx-auto max-w-md">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="px-5 pb-3 pt-6">
          <div className="flex items-center gap-4">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-3xl border border-black/5 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#222022] text-lg font-black text-[#C3D809]">
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/45">
                Welcome to
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                {store.name}
              </h1>

              {location && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-black/50">
                  <MapPin size={14} strokeWidth={1.8} />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===================================================
            PROMO
        =================================================== */}

        <div className="px-5">
          {store.promoImageUrl || store.description ? (
            <section className="mt-4 overflow-hidden rounded-[28px] bg-[#222022] text-white">
              {store.promoImageUrl && (
                <div className="relative h-40 w-full">
                  <img
                    src={store.promoImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C3D809]">
                  {store.name}
                </p>

                {store.description && (
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {store.description}
                  </p>
                )}
              </div>
            </section>
          ) : (
            <section className="mt-4 rounded-[28px] bg-[#222022] p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C3D809]">
                {store.name}
              </p>

              <p className="mt-2 text-sm leading-6 text-white/80">
                Welcome to our store. Browse the catalog below
                or contact us directly.
              </p>
            </section>
          )}
        </div>

        {/* ===================================================
            CATEGORIES
        =================================================== */}

        <div className="mt-7 overflow-x-auto px-5 pb-1">
          <div className="flex gap-2">

            <Link
              href={`/store/${store.slug}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                selectedCategory === "All"
                  ? "border-[#222022] bg-[#222022] text-white"
                  : "border-black/10 bg-white text-black/50"
              }`}
            >
              All
            </Link>

            {data.categories.map((category) => (
              <Link
                key={category}
                href={`/store/${store.slug}?category=${encodeURIComponent(
                  category
                )}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  selectedCategory === category
                    ? "border-[#222022] bg-[#222022] text-white"
                    : "border-black/10 bg-white text-black/50"
                }`}
              >
                {category}
              </Link>
            ))}

          </div>
        </div>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <section className="px-5 pb-4 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black">
              {selectedCategory === "All"
                ? "All Products"
                : selectedCategory}
            </h2>

            <span className="text-xs font-bold text-black/35">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-[24px] border border-black/[0.06] bg-[#F8F8F6] p-10 text-center">
              <p className="text-sm font-bold text-black/40">
                No products in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  slug={store.slug}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            STORE INFO
        =================================================== */}

        {(store.address ||
          store.phone ||
          store.telegram ||
          store.instagram ||
          store.openingHours) && (
          <section className="px-5 pb-6 pt-2">
            <div className="rounded-[28px] border border-black/[0.06] bg-[#F8F8F6] p-5">
              <h2 className="mb-4 text-sm font-black">
                Visit {store.name}
              </h2>

              <div className="grid grid-cols-1 gap-2.5">
                {store.address && (
                  <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-black/40" />
                    <span className="text-xs font-semibold text-black/60">
                      {store.address}
                    </span>
                  </div>
                )}

                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3.5 transition hover:bg-[#C3D809]/10"
                  >
                    <Phone size={16} className="shrink-0 text-black/40" />
                    <span className="text-xs font-semibold text-black/60">
                      {store.phone}
                    </span>
                  </a>
                )}

                {store.telegram && (
                  <a
                    href={`https://t.me/${store.telegram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-white p-3.5 transition hover:bg-[#C3D809]/10"
                  >
                    <Send size={16} className="shrink-0 text-black/40" />
                    <span className="text-xs font-semibold text-black/60">
                      {store.telegram}
                    </span>
                  </a>
                )}

                {store.instagram && (
                  <a
                    href={`https://instagram.com/${store.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-white p-3.5 transition hover:bg-[#C3D809]/10"
                  >
                    <Camera size={16} className="shrink-0 text-black/40" />
                    <span className="text-xs font-semibold text-black/60">
                      {store.instagram}
                    </span>
                  </a>
                )}

                {store.openingHours && (
                  <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5">
                    <Clock size={16} className="shrink-0 text-black/40" />
                    <span className="text-xs font-semibold text-black/60">
                      {store.openingHours}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// =========================================================
// STORE PRODUCT CARD
//
// A static, self-contained card so each seller's catalog
// stays cleanly isolated (no shared favorites context).
// =========================================================

function StoreProductCard({
  product,
  slug,
}: {
  product: CatalogProduct;
  slug: string;
}) {
  const href = `/store/${slug}/products/${product.id}`;

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]">
      <Link href={href} className="block">
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

          {isOutOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold text-white">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
          {product.category}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-bold leading-5">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <Star size={13} fill="currentColor" className="text-[#C3D809]" />
          <span className="text-xs font-semibold">4.9</span>
        </div>

        <div className="mt-3">
          <span className="text-base font-black">
            {product.price.toLocaleString()} ETB
          </span>
        </div>

        <Link
          href={href}
          className="mt-3 block w-full rounded-xl bg-[#222022] py-2.5 text-center text-xs font-bold text-white transition-all duration-300 hover:bg-[#C3D809] hover:text-[#222022] active:scale-[0.97]"
        >
          View product
        </Link>
      </div>
    </article>
  );
}