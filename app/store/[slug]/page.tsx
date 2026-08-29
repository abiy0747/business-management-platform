import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  MapPin,
  Package,
} from "lucide-react";
import {
  getStoreBySlug,
  getStoreCatalogData,
} from "@/lib/catalog-data";
import StoreBottomNav from "@/components/catalog/StoreBottomNav";
import StoreCatalogProducts from "@/components/catalog/StoreCatalogProducts";

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
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
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
            CATEGORY PREVIEW
        =================================================== */}

        {data.categories.length > 0 && (
          <section className="mt-7 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                  Browse collection
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight">
                  Categories
                </h2>
              </div>

              <Link
                href={`/store/${store.slug}/categories`}
                className="group flex items-center gap-1 text-sm font-bold transition-all duration-300 hover:text-[#222022]"
              >
                See all
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
          </section>
        )}

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <section className="px-5 pb-4 pt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black">
              {selectedCategory === "All"
                ? store.name
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C3D809]/20">
                <Package size={22} />
              </div>

              <p className="mt-4 text-sm font-bold text-black/40">
                No products in this category yet.
              </p>
            </div>
          ) : (
            <StoreCatalogProducts
              products={filteredProducts}
              slug={store.slug}
            />
          )}
        </section>

        {/* Bottom navigation */}
        <StoreBottomNav slug={store.slug} />

      </div>
    </main>
  );
}
