import { Suspense } from "react";
import { getAdminProductsData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  const business = await requireAdminSession();

  const { products, categories } = await getAdminProductsData(business.businessId);

  return (
    <ProductsClient
      products={products}
      categories={categories}
    />
  );
}