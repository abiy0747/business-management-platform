import CatalogHeader from "@/components/catalog/CatalogHeader";
import PromoBanner from "@/components/catalog/PromoBanner";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";
import BottomNav from "@/components/catalog/BottomNav";
import CategoryAutoScroll from "@/components/catalog/CategoryAutoScroll";
import { prisma } from "@/lib/prisma";

type CatalogPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const params = await searchParams;

  const selectedCategory = params.category || "All";

  // Get products from PostgreSQL
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Prisma Decimal values to normal JavaScript numbers
  const catalogProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    category: product.category.name,
  }));

  // Get categories automatically from PostgreSQL
  const categories = Array.from(
    new Set(
      products.map((product) => product.category.name)
    )
  );

  return (
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <CatalogHeader />

        {/* Automatically scroll to products
            when a category was selected */}
        <CategoryAutoScroll
          selectedCategory={selectedCategory}
        />

        <div className="px-5">

          {/* Hero / Promo */}
          <PromoBanner />

          {/* Catalog */}
          <div
            id="products"
            className="mt-8 scroll-mt-4"
          >
            <CatalogBrowser
              products={catalogProducts}
              categories={categories}
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