import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// =========================================================
// CACHED CATALOG DATA
//
// Customer-facing reads are cached with `"use cache"` so
// navigation between pages does not hit the database on
// every request. The cache is invalidated on any product /
// category / purchase / sale mutation through the admin API
// via `revalidateTag("catalog")`.
// =========================================================

const CATALOG_TAG = "catalog";

// =========================================================
// STORE DATA
// =========================================================

export type StoreData = {
  name: string;
  address: string | null;
  phone: string | null;
  telegram: string | null;
  instagram: string | null;
  openingHours: string | null;
  description: string | null;
  logoUrl: string | null;
  aboutImageUrl: string | null;
  promoImageUrl: string | null;
  categoryImageUrl: string | null;
};

export type StorePublic = StoreData & {
  id: string;
  slug: string;
};

export async function getStoreData(): Promise<StoreData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findFirst();

  if (!business) {
    return null;
  }

  return {
    name: business.name,
    address: business.address,
    phone: business.phone,
    telegram: business.telegram,
    instagram: business.instagram,
    openingHours: business.openingHours,
    description: business.description,
    logoUrl: business.logoUrl,
    aboutImageUrl: business.aboutImageUrl,
    promoImageUrl: business.promoImageUrl,
    categoryImageUrl: business.categoryImageUrl,
  };
}

// =========================================================
// STORE BY SLUG (MULTI-SELLER)
//
// Public storefront for a single business, resolved by its
// unique slug at `/store/<slug>`. Returns null for unknown
// slugs so the page can render a 404 without ever exposing
// another store's data.
// =========================================================

export async function getStoreBySlug(
  slug: string
): Promise<StorePublic | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  if (!slug || typeof slug !== "string") {
    return null;
  }

  const business = await prisma.business.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      phone: true,
      telegram: true,
      instagram: true,
      openingHours: true,
      description: true,
      logoUrl: true,
      aboutImageUrl: true,
      promoImageUrl: true,
      categoryImageUrl: true,
    },
  });

  if (!business) {
    return null;
  }

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    address: business.address,
    phone: business.phone,
    telegram: business.telegram,
    instagram: business.instagram,
    openingHours: business.openingHours,
    description: business.description,
    logoUrl: business.logoUrl,
    aboutImageUrl: business.aboutImageUrl,
    promoImageUrl: business.promoImageUrl,
    categoryImageUrl: business.categoryImageUrl,
  };
}

export async function getStoreCatalogData(
  slug: string
): Promise<CatalogData> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    return { products: [], categories: [] };
  }

  const products = await prisma.product.findMany({
    where: {
      businessId: business.id,
      isAvailable: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      costPrice: Number(product.costPrice),
      stock: product.stock,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      category: product.category.name,
    })),

    categories: Array.from(
      new Set(products.map((product) => product.category.name))
    ),
  };
}

export async function getStoreProductData(
  slug: string,
  productId: string
): Promise<CatalogProductDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    return null;
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      businessId: business.id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    category: product.category.name,
  };
}

// =========================================================
// CATALOG PAGE
// =========================================================

export type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  isAvailable: boolean;
  category: string;
};

export type CatalogData = {
  products: CatalogProduct[];
  categories: string[];
};

export async function getCatalogData(): Promise<CatalogData> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findFirst();

  if (!business) {
    return { products: [], categories: [] };
  }

  const products = await prisma.product.findMany({
    where: {
      businessId: business.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      costPrice: Number(product.costPrice),
      stock: product.stock,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      category: product.category.name,
    })),

    categories: Array.from(
      new Set(products.map((product) => product.category.name))
    ),
  };
}

// =========================================================
// CATEGORIES PAGE
// =========================================================

export type CatalogCategory = {
  id: string;
  name: string;
  productCount: number;
};

export async function getCategoriesData(): Promise<CatalogCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findFirst();

  if (!business) {
    return [];
  }

  const categories = await prisma.category.findMany({
    where: {
      businessId: business.id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
  }));
}

// =========================================================
// PRODUCT DETAIL PAGE
// =========================================================

export type CatalogProductDetail = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  isAvailable: boolean;
  category: string;
};

export async function getProductData(
  id: string
): Promise<CatalogProductDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findFirst();

  if (!business) {
    return null;
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId: business.id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    category: product.category.name,
  };
}

// =========================================================
// NOTIFICATIONS PAGE
// =========================================================

export type CatalogNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
};

export async function getNotificationsData(): Promise<
  CatalogNotification[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const business = await prisma.business.findFirst();

  if (!business) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: {
      businessId: business.id,
      isActive: true,
      OR: [
        {
          startDate: null,
        },
        {
          startDate: {
            lte: new Date(),
          },
        },
      ],
      AND: [
        {
          OR: [
            {
              endDate: null,
            },
            {
              endDate: {
                gte: new Date(),
              },
            },
          ],
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
  }));
}

// =========================================================
// REVALIDATION
// =========================================================

export { CATALOG_TAG as catalogTag };