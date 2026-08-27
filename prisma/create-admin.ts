import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Find the existing Power Mobile business
  const business = await prisma.business.findUnique({
    where: {
      slug: "power-mobile",
    },
  });

  if (!business) {
    throw new Error(
      'Power Mobile business was not found. Make sure your original seed has already been run.'
    );
  }

  console.log("Business found:", business.name);

  // Hash admin password
  const passwordHash = await bcrypt.hash("mulat123", 12);

  // Create admin if it doesn't exist,
  // or update it if it already exists
  const admin = await prisma.admin.upsert({
    where: {
      email: "mulat@gmail.com",
    },

    update: {
      name: "Mulat",
      passwordHash,
      isActive: true,
      businessId: business.id,
    },

    create: {
      name: "Mulat",
      email: "mulat@gmail.com",
      passwordHash,
      isActive: true,
      businessId: business.id,
    },
  });

  console.log("");
  console.log("=================================");
  console.log("Admin created successfully!");
  console.log("=================================");
  console.log("Name:", admin.name);
  console.log("Email:", admin.email);
  console.log("Business:", business.name);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ Failed to create admin:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });