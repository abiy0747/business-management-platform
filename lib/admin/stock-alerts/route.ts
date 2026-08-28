import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const business = await prisma.business.findFirst();

    if (!business) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        businessId: business.id,
        stock: {
          lte: 5,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
      orderBy: {
        stock: "asc",
      },
    });

    const alerts = products.map((product) => {
      let type: "out" | "very-low" | "low";
      let message: string;

      if (product.stock <= 0) {
        type = "out";
        message = "Out of stock";
      } else if (product.stock <= 2) {
        type = "very-low";
        message = `Only ${product.stock} left`;
      } else {
        type = "low";
        message = `${product.stock} left in stock`;
      }

      return {
        id: product.id,
        name: product.name,
        stock: product.stock,
        type,
        message,
      };
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("STOCK ALERTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch stock alerts.",
      },
      {
        status: 500,
      }
    );
  }
}