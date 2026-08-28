import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSessionBusiness } from "@/lib/admin/session";

type SaleItemInput = {
  productId: string;
  quantity: number;
  sellingPrice: number;
};

type CreateSaleBody = {
  items: SaleItemInput[];
};

export async function POST(request: Request) {
  try {
    // -----------------------------------------------------
    // AUTHENTICATION
    // -----------------------------------------------------

    const session =
      await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const businessId = session.businessId;

    const body = (await request.json()) as CreateSaleBody;

    const { items } = body;

    // =========================================================
    // VALIDATION
    // =========================================================

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "At least one product is required.",
        },
        {
          status: 400,
        }
      );
    }

    for (const item of items) {
      if (!item.productId) {
        return NextResponse.json(
          {
            error: "Every sale item must have a product.",
          },
          {
            status: 400,
          }
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          {
            error:
              "Product quantity must be a positive whole number.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        typeof item.sellingPrice !== "number" ||
        !Number.isFinite(item.sellingPrice) ||
        item.sellingPrice < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Selling price must be a valid positive number.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // =========================================================
    // COMBINE DUPLICATE PRODUCTS
    // =========================================================

    const normalizedMap = new Map<
      string,
      {
        productId: string;
        quantity: number;
        sellingPrice: number;
      }
    >();

    for (const item of items) {
      const existing = normalizedMap.get(item.productId);

      if (existing) {
        /*
         * If the same product appears twice in the cart,
         * use the latest selling price and combine quantity.
         */
        normalizedMap.set(item.productId, {
          productId: item.productId,
          quantity: existing.quantity + item.quantity,
          sellingPrice: item.sellingPrice,
        });
      } else {
        normalizedMap.set(item.productId, {
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
        });
      }
    }

    const normalizedItems = Array.from(normalizedMap.values());

    // =========================================================
    // DATABASE TRANSACTION
    // =========================================================

    const sale = await prisma.$transaction(async (tx) => {
      // -------------------------------------------------------
      // Get products
      // -------------------------------------------------------

      const products = await tx.product.findMany({
        where: {
          businessId,

          id: {
            in: normalizedItems.map((item) => item.productId),
          },

          isAvailable: true,
        },
      });

      // -------------------------------------------------------
      // Make sure every product exists
      // -------------------------------------------------------

      if (products.length !== normalizedItems.length) {
        throw new Error(
          "One or more selected products could not be found."
        );
      }

      // -------------------------------------------------------
      // Check stock
      // -------------------------------------------------------

      for (const item of normalizedItems) {
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) {
          throw new Error("Product not found.");
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${product.name}. Available: ${product.stock}. Requested: ${item.quantity}.`
          );
        }
      }

      // -------------------------------------------------------
      // Calculate totals
      // -------------------------------------------------------

      let totalAmount = 0;
      let totalCost = 0;
      let totalProfit = 0;

      const saleItems = [];

      for (const item of normalizedItems) {
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) {
          throw new Error("Product not found.");
        }

        // IMPORTANT:
        // Selling price now comes from the actual price
        // entered by the admin during the sale.
        const sellingPrice = item.sellingPrice;

        // Cost price comes from the product's current cost.
        const costPrice = Number(product.costPrice);

        const itemTotalAmount =
          sellingPrice * item.quantity;

        const itemTotalCost =
          costPrice * item.quantity;

        const itemProfit =
          itemTotalAmount - itemTotalCost;

        totalAmount += itemTotalAmount;
        totalCost += itemTotalCost;
        totalProfit += itemProfit;

        saleItems.push({
          productId: product.id,

          quantity: item.quantity,

          sellingPrice,

          costPrice,

          totalAmount: itemTotalAmount,

          totalCost: itemTotalCost,

          profit: itemProfit,
        });
      }

      // -------------------------------------------------------
      // Create sale
      // -------------------------------------------------------

      const createdSale = await tx.sale.create({
        data: {
          businessId,

          totalAmount,

          totalCost,

          profit: totalProfit,

          items: {
            create: saleItems,
          },
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // -------------------------------------------------------
      // Decrease stock
      // -------------------------------------------------------

      for (const item of normalizedItems) {
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) {
          throw new Error("Product not found.");
        }

        const updated = await tx.product.updateMany({
          where: {
            id: product.id,

            businessId,

            stock: {
              gte: item.quantity,
            },
          },

          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count !== 1) {
          throw new Error(
            `Stock changed while processing ${product.name}. Please try again.`
          );
        }
      }

      return createdSale;
    });

    // =========================================================
    // INVALIDATE CACHED CATALOG + ADMIN DATA
    // =========================================================

    revalidateTag("catalog", "max");
    revalidateTag("admin", "max");

    // =========================================================
    // SUCCESS RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,

        message: "Sale completed successfully.",

        sale: {
          id: sale.id,

          totalAmount: Number(sale.totalAmount),

          totalCost: Number(sale.totalCost),

          profit: Number(sale.profit),

          soldAt: sale.soldAt,

          items: sale.items.map((item) => ({
            id: item.id,

            productId: item.productId,

            productName: item.product.name,

            quantity: item.quantity,

            sellingPrice: Number(item.sellingPrice),

            costPrice: Number(item.costPrice),

            totalAmount: Number(item.totalAmount),

            totalCost: Number(item.totalCost),

            profit: Number(item.profit),
          })),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE SALE ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create sale.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}