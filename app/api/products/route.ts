import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================================================
// GET PRODUCTS
// =========================================================

export async function GET() {
  try {
    const products =
      await prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const safeProducts =
      products.map((product) => ({
        id: product.id,
        name: product.name,
        description:
          product.description,
        price: Number(product.price),
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
        createdAt:
          product.createdAt,
        updatedAt:
          product.updatedAt,
      }));

    return NextResponse.json(
      safeProducts
    );
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch products.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// CREATE PRODUCT
// =========================================================

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

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
    // VERIFY BUSINESS
    // -----------------------------------------------------

    const business =
      await prisma.business.findUnique(
        {
          where: {
            id: businessId,
          },
        }
      );

    if (!business) {
      return NextResponse.json(
        {
          error:
            "Business not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------------------
    // VERIFY CATEGORY BELONGS TO BUSINESS
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
    // CREATE PRODUCT
    // -----------------------------------------------------

    const product =
      await prisma.product.create({
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
          // New products start with zero stock.
          // Stock is added through purchases.
          stock: 0,

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
              : true,

          businessId,

          categoryId,
        },

        include: {
          category: true,
        },
      });

    return NextResponse.json(
      {
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
          createdAt:
            product.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create product.",
      },
      {
        status: 500,
      }
    );
  }
}