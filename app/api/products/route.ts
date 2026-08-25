import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}