import { notFound } from "next/navigation";
import StoreFavorites from "@/components/catalog/StoreFavorites";
import { getStoreBySlug } from "@/lib/catalog-data";

type StoreFavoritesPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Render as a blocking, on-demand route so an unknown slug
// returns a real HTTP 404.
export const instant = false;

export default async function StoreFavoritesPage({
  params,
}: StoreFavoritesPageProps) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return <StoreFavorites slug={store.slug} />;
}
