import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const business = await prisma.business.findFirst();

  if (!business) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="text-center">
          <h2 className="text-lg font-black text-[#222022]">
            No business found
          </h2>

          <p className="mt-2 text-sm text-black/40">
            Please run the seed script first.
          </p>
        </div>
      </div>
    );
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        businessId: business.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.category.findMany({
      where: {
        businessId: business.id,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const safeProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  const safeCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <ProductsClient
      businessId={business.id}
      products={safeProducts}
      categories={safeCategories}
    />
  );
}