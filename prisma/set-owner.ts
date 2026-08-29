import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Primary platform-owner admin. Set OWNER_EMAIL in your environment
// to promote a different admin as the platform owner.
const OWNER_EMAIL = (process.env.OWNER_EMAIL as string) || "mulat@gmail.com";

async function main() {
  const admin = await prisma.admin.findUnique({ where: { email: OWNER_EMAIL } });

  if (!admin) {
    throw new Error(`Owner admin not found for email: ${OWNER_EMAIL}`);
  }

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: { isOwner: true },
  });

  console.log("Platform owner set:");
  console.log("Name:", updated.name);
  console.log("Email:", updated.email);
  console.log("isOwner:", updated.isOwner);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
