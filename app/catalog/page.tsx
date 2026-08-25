import CatalogHeader from "@/components/catalog/CatalogHeader";
import PromoBanner from "@/components/catalog/PromoBanner";
import CategorySection from "@/components/catalog/CategorySection";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";
import BottomNav from "@/components/catalog/BottomNav";
import { prisma } from "@/lib/prisma";

export default async function CatalogPage() {
  // Get products from the database
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Prisma Decimal values to normal JavaScript numbers
  // so they can safely be passed to the Client Component.
  const catalogProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
  }));

  // Get all categories directly from the Category table
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Convert category objects into category names
  const categoryNames = categories.map(
    (category) => category.name
  );

  return (
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
      <div className="mx-auto max-w-md">
        <CatalogHeader />

        <div className="px-5">
          <PromoBanner />

          <CategorySection />

          <div className="mt-8">
            <CatalogBrowser
              products={catalogProducts}
              categories={categoryNames}
            />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}