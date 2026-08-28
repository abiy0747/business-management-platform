import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // =========================================================
  // CREATE BUSINESS
  // =========================================================

  const business = await prisma.business.create({
    data: {
      name: "Power Mobile",
      slug: "power-mobile",
      address: "Wereta, Ethiopia",
      phone: "+251 92 049 9857",
      telegram: "@Abiy0747",
      instagram: "@abiy_abena",
      openingHours: "Every day • 8:00 AM – 8:00 PM",
      description:
        "Quality mobile accessories and useful everyday tech.",
      aboutImageUrl: "/images/pp.jpg",
      promoImageUrl: "/images/store.jpg",
      categoryImageUrl: "/images/store.jpg",
    },
  });

  console.log("Business created:", business.name);

  // =========================================================
  // CREATE CATEGORIES
  // =========================================================

  const cases = await prisma.category.create({
    data: {
      name: "Cases",
      businessId: business.id,
    },
  });

  const chargers = await prisma.category.create({
    data: {
      name: "Chargers",
      businessId: business.id,
    },
  });

  const cables = await prisma.category.create({
    data: {
      name: "Cables",
      businessId: business.id,
    },
  });

  const audio = await prisma.category.create({
    data: {
      name: "Audio",
      businessId: business.id,
    },
  });

  console.log("Categories created");

  // =========================================================
  // CREATE PRODUCTS
  // =========================================================

  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15 Silicone Case",
        description: "Premium protective silicone case",
        price: 500,
        costPrice: 300,
        stock: 20,
        isAvailable: true,
        businessId: business.id,
        categoryId: cases.id,
      },

      {
        name: "Samsung S24 Protective Case",
        description: "Slim shock-resistant case",
        price: 600,
        costPrice: 350,
        stock: 15,
        isAvailable: true,
        businessId: business.id,
        categoryId: cases.id,
      },

      {
        name: "20W Fast Charger",
        description: "Fast USB-C wall charger",
        price: 900,
        costPrice: 550,
        stock: 12,
        isAvailable: true,
        businessId: business.id,
        categoryId: chargers.id,
      },

      {
        name: "USB-C Fast Charging Cable",
        description: "Durable USB-C charging cable",
        price: 350,
        costPrice: 180,
        stock: 30,
        isAvailable: true,
        businessId: business.id,
        categoryId: cables.id,
      },

      {
        name: "Wireless Earbuds",
        description: "Compact wireless Bluetooth earbuds",
        price: 1500,
        costPrice: 950,
        stock: 10,
        isAvailable: true,
        businessId: business.id,
        categoryId: audio.id,
      },
    ],
  });

  console.log("Products created successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });