import {
  BatteryCharging,
  Cable,
  CircleUserRound,
  Headphones,
  Smartphone,
} from "lucide-react";

const categories = [
  {
    name: "Cases",
    icon: Smartphone,
  },
  {
    name: "Chargers",
    icon: BatteryCharging,
  },
  {
    name: "Cables",
    icon: Cable,
  },
  {
    name: "Audio",
    icon: Headphones,
  },
  {
    name: "More",
    icon: CircleUserRound,
  },
];

export default function CategorySection() {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Categories
        </h2>

        <button className="text-sm font-semibold text-[#222022]">
          See all →
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.name}
              className="group flex min-w-[64px] flex-col items-center gap-2"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-[#fafafa] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C3D809] group-hover:bg-[#C3D809] group-active:scale-95">
                <Icon
                  size={22}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </span>

              <span className="text-xs font-semibold whitespace-nowrap">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}