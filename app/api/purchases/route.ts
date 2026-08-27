import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PurchaseItemInput = {
  productId: string;
  quantity: number;
  unitCost: number;
};

type CreatePurchaseBody = {
  businessId: string;
  supplier?: string;
  items: PurchaseItemInput[];
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as CreatePurchaseBody;

    const {
      businessId,
      supplier,
      items,
    } = body;

    // =========================================================
    // VALIDATION
    // =========================================================

    if (!businessId) {
      return NextResponse.json(
        {
          error:
            "Business ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one product is required.",
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
            error:
              "Every purchase item must have a product.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        !Number.isInteger(
          item.quantity
        ) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Quantity must be a positive whole number.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        typeof item.unitCost !==
          "number" ||
        !Number.isFinite(
          item.unitCost
        ) ||
        item.unitCost < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Purchase cost must be a valid number.",
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

    const purchaseMap =
      new Map<
        string,
        {
          productId: string;
          quantity: number;
          unitCost: number;
        }
      >();

    for (const item of items) {
      const existing =
        purchaseMap.get(
          item.productId
        );

      if (existing) {
        purchaseMap.set(
          item.productId,
          {
            productId:
              item.productId,

            quantity:
              existing.quantity +
              item.quantity,

            unitCost:
              item.unitCost,
          }
        );
      } else {
        purchaseMap.set(
          item.productId,
          {
            productId:
              item.productId,

            quantity:
              item.quantity,

            unitCost:
              item.unitCost,
          }
        );
      }
    }

    const normalizedItems =
      Array.from(
        purchaseMap.values()
      );

    // =========================================================
    // DATABASE TRANSACTION
    // =========================================================

    const purchase =
      await prisma.$transaction(
        async (tx) => {
          const products =
            await tx.product.findMany({
              where: {
                businessId,

                id: {
                  in: normalizedItems.map(
                    (item) =>
                      item.productId
                  ),
                },
              },
            });

          if (
            products.length !==
            normalizedItems.length
          ) {
            throw new Error(
              "One or more selected products could not be found."
            );
          }

          let totalCost = 0;

          const purchaseItems =
            [];

          for (const item of normalizedItems) {
            const product =
              products.find(
                (product) =>
                  product.id ===
                  item.productId
              );

            if (!product) {
              throw new Error(
                "Product not found."
              );
            }

            const oldStock =
              product.stock;

            const oldCost =
              Number(
                product.costPrice
              );

            const newStock =
              oldStock +
              item.quantity;

            /*
             * Weighted-average inventory cost.
             *
             * Example:
             * Existing:
             * 10 × 1,800 = 18,000
             *
             * New:
             * 20 × 2,000 = 40,000
             *
             * Total:
             * 30 units = 58,000
             *
             * Average cost:
             * 58,000 / 30 = 1,933.33
             */

            const newAverageCost =
              newStock > 0
                ? (
                    oldStock *
                      oldCost +
                    item.quantity *
                      item.unitCost
                  ) /
                  newStock
                : item.unitCost;

            const itemTotalCost =
              item.quantity *
              item.unitCost;

            totalCost +=
              itemTotalCost;

            purchaseItems.push({
              productId:
                product.id,

              quantity:
                item.quantity,

              unitCost:
                item.unitCost,

              totalCost:
                itemTotalCost,
            });

            await tx.product.update({
              where: {
                id: product.id,
              },

              data: {
                stock: {
                  increment:
                    item.quantity,
                },

                costPrice:
                  newAverageCost,
              },
            });
          }

          const createdPurchase =
            await tx.purchase.create({
              data: {
                businessId,

                supplier:
                  supplier?.trim() ||
                  null,

                totalCost,

                items: {
                  create:
                    purchaseItems,
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

          return createdPurchase;
        }
      );

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Stock purchased successfully.",

        purchase: {
          id: purchase.id,

          supplier:
            purchase.supplier,

          totalCost:
            Number(
              purchase.totalCost
            ),

          purchasedAt:
            purchase.purchasedAt,

          items:
            purchase.items.map(
              (item) => ({
                id: item.id,

                productId:
                  item.productId,

                productName:
                  item.product.name,

                quantity:
                  item.quantity,

                unitCost:
                  Number(
                    item.unitCost
                  ),

                totalCost:
                  Number(
                    item.totalCost
                  ),
              })
            ),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE PURCHASE ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create purchase.";

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