import { prisma } from "@/lib/prisma";
import PurchasesClient from "./PurchasesClient";

export default async function PurchasesPage() {
  const business =
    await prisma.business.findFirst();

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

  const products =
    await prisma.product.findMany({
      where: {
        businessId:
          business.id,
      },

      include: {
        category: true,
      },

      orderBy: {
        name: "asc",
      },
    });

  const safeProducts =
    products.map(
      (product) => ({
        id: product.id,

        name: product.name,

        price:
          Number(
            product.price
          ),

        costPrice:
          Number(
            product.costPrice
          ),

        stock:
          product.stock,

        imageUrl:
          product.imageUrl,

        category:
          product.category.name,
      })
    );

  return (
    <PurchasesClient
      businessId={
        business.id
      }
      products={
        safeProducts
      }
    />
  );
}