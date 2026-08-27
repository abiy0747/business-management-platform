import { prisma } from "@/lib/prisma";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
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

  const categories = await prisma.category.findMany({
    where: {
      businessId: business.id,
    },

    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  const safeCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }));

  return (
    <CategoriesClient
      businessId={business.id}
      categories={safeCategories}
    />
  );
}