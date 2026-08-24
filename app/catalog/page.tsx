import CatalogHeader from "@/components/catalog/CatalogHeader";
import SearchBar from "@/components/catalog/SearchBar";
import PromoBanner from "@/components/catalog/PromoBanner";
import CategorySection from "@/components/catalog/CategorySection";
import ProductCard from "@/components/catalog/ProductCard";
import BottomNav from "@/components/catalog/BottomNav";

const products = [
  {
    id: 1,
    name: "Premium iPhone Case",
    price: 450,
    oldPrice: 600,
    category: "Cases",
    image: "/products/iphone-case.jpg",
  },
  {
    id: 2,
    name: "20W Fast Charger",
    price: 750,
    oldPrice: 950,
    category: "Chargers",
    image: "/products/charger.jpg",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 1800,
    oldPrice: 2200,
    category: "Audio",
    image: "/products/earbuds.jpg",
  },
  {
    id: 4,
    name: "20,000mAh Power Bank",
    price: 2400,
    oldPrice: 2900,
    category: "Power",
    image: "/products/powerbank.jpg",
  },
];

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-white pb-24 text-[#222022]">
      <div className="mx-auto max-w-md">
        <CatalogHeader />

        <div className="px-5">
          <SearchBar />

          <PromoBanner />

          <CategorySection />

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                Popular Products
              </h2>

              <button className="text-sm font-semibold text-[#222022]">
                See all →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}