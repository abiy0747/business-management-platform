import { notFound } from "next/navigation";
import AboutClient from "@/app/about/AboutClient";
import StoreBottomNav from "@/components/catalog/StoreBottomNav";
import { getStoreBySlug } from "@/lib/catalog-data";

type StoreAboutPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Render as a blocking, on-demand route so an unknown slug
// returns a real HTTP 404.
export const instant = false;

export default async function StoreAboutPage({
  params,
}: StoreAboutPageProps) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <>
      <AboutClient store={store} slug={store.slug} />
      <StoreBottomNav slug={store.slug} />
    </>
  );
}
