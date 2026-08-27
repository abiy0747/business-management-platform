import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================================================
// UPDATE PRODUCT
// =========================================================

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const {
      businessId,
      name,
      description,
      price,
      costPrice,
      imageUrl,
      categoryId,
      isAvailable,
    } = body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      !id ||
      typeof id !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof businessId !==
        "string" ||
      !businessId.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Business ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof categoryId !==
        "string" ||
      !categoryId.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Category is required.",
        },
        { status: 400 }
      );
    }

    const numericPrice =
      Number(price);

    const numericCostPrice =
      Number(costPrice);

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Default selling price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(
        numericCostPrice
      ) ||
      numericCostPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cost price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // FIND PRODUCT
    // -----------------------------------------------------

    const existingProduct =
      await prisma.product.findFirst(
        {
          where: {
            id,
            businessId,
          },
        }
      );

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------------------
    // VERIFY CATEGORY
    // -----------------------------------------------------

    const category =
      await prisma.category.findFirst(
        {
          where: {
            id: categoryId,
            businessId,
          },
        }
      );

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Selected category does not belong to this business.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // UPDATE PRODUCT
    // -----------------------------------------------------

    const product =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          name: name.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          price: numericPrice,

          costPrice:
            numericCostPrice,

          // IMPORTANT:
          // Stock is intentionally NOT updated here.
          //
          // Product editing changes product information.
          // Purchases change stock.
          // Sales decrease stock.

          imageUrl:
            typeof imageUrl ===
              "string" &&
            imageUrl.trim()
              ? imageUrl.trim()
              : null,

          isAvailable:
            typeof isAvailable ===
            "boolean"
              ? isAvailable
              : existingProduct.isAvailable,

          categoryId,
        },

        include: {
          category: true,
        },
      });

    return NextResponse.json({
      success: true,

      product: {
        id: product.id,
        name: product.name,
        description:
          product.description,
        price: Number(
          product.price
        ),
        costPrice: Number(
          product.costPrice
        ),
        stock: product.stock,
        imageUrl:
          product.imageUrl,
        isAvailable:
          product.isAvailable,
        businessId:
          product.businessId,
        categoryId:
          product.categoryId,
        category:
          product.category.name,
        updatedAt:
          product.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update product.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// DELETE PRODUCT
// =========================================================

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    if (
      !id ||
      typeof id !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Product ID is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // GET BUSINESS ID FROM QUERY
    // -----------------------------------------------------

    const url = new URL(
      request.url
    );

    const businessId =
      url.searchParams.get(
        "businessId"
      );

    if (!businessId) {
      return NextResponse.json(
        {
          error:
            "Business ID is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // FIND PRODUCT
    // -----------------------------------------------------

    const product =
      await prisma.product.findFirst(
        {
          where: {
            id,
            businessId,
          },

          include: {
            _count: {
              select: {
                purchaseItems: true,
                saleItems: true,
              },
            },
          },
        }
      );

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------------------
    // DON'T DELETE HISTORICAL PRODUCTS
    // -----------------------------------------------------

    if (
      product._count
        .purchaseItems > 0 ||
      product._count.saleItems > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This product has purchase or sales history and cannot be deleted. Edit it or mark it as unavailable instead.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------------
    // DELETE
    // -----------------------------------------------------

    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}