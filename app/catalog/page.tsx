import { Suspense } from "react";
import CatalogHeader from "@/components/catalog/CatalogHeader";
import PromoBanner from "@/components/catalog/PromoBanner";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";
import BottomNav from "@/components/catalog/BottomNav";
import CategoryAutoScroll from "@/components/catalog/CategoryAutoScroll";
import { CatalogPageSkeleton } from "@/components/Skeletons";
import { getCatalogData, getStoreData } from "@/lib/catalog-data";

type CatalogPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  return (
    <Suspense fallback={<CatalogPageSkeleton />}>
      <CatalogView searchParams={searchParams} />
    </Suspense>
  );
}

async function CatalogView({
  searchParams,
}: CatalogPageProps) {
  const params = await searchParams;

  const selectedCategory =
    params.category || "All";

  const data = await getCatalogData();
  const store = await getStoreData();

  const storeName = store?.name || "Our Store";
  const storeLocation = store?.address
    ? store.address.split(",")[0]
    : null;

  return (
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <CatalogHeader
          name={storeName}
          location={storeLocation}
        />

        {/* Automatically scroll to products
            when a category was selected */}
        <CategoryAutoScroll
          selectedCategory={selectedCategory}
        />

        <div className="px-5">

          {/* Hero / Promo */}
          <PromoBanner
            imageUrl={store?.promoImageUrl ?? null}
            description={store?.description ?? null}
          />

          {/* Catalog */}
          <div
            id="products"
            className="mt-8 scroll-mt-4"
          >
            <CatalogBrowser
              products={data.products}
              categories={data.categories}
              selectedCategory={selectedCategory}
            />
          </div>

        </div>

        {/* Bottom navigation */}
        <BottomNav />

      </div>
    </main>
  );
}