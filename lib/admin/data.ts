import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDashboardData } from "@/lib/admin/dashboard";

// =========================================================
// CACHED ADMIN DATA
//
// Admin-side reads are cached with `"use cache"` so
// navigation between admin pages does not hit the database
// on every request. The cache is invalidated on any product /
// category / purchase / sale / expense mutation through the
// admin API via `revalidateTag("admin")`.
//
// Dashboard / analytics data is time-sensitive, so it uses
// the "minutes" profile (5 min stale, background revalidation
// after 1 min). List pages use "hours" and are refreshed on
// mutation.
// =========================================================

const ADMIN_TAG = "admin";

// =========================================================
// BUSINESS
//
// NOTE: The business is NOT resolved here. Admin pages and
// API routes derive the business from the authenticated
// session via `requireAdminSession()` / `getAdminSessionBusiness()`
// in `lib/admin/session.ts`. The cached data functions below
// all accept an explicit `businessId` from that session.
// =========================================================

// =========================================================
// DASHBOARD PAGE
// =========================================================

export async function getAdminDashboardData(businessId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(ADMIN_TAG);

  const raw = await getDashboardData(businessId);

  // Convert Date / Decimal values to plain serializable data.
  return JSON.parse(JSON.stringify(raw));
}

// =========================================================
// ANALYTICS PAGE
// =========================================================

function startOfDayLocal(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export type AdminAnalyticsDates = {
  startOfToday: string;
  startOfTomorrow: string;
  startOfWeek: string;
  startOfNextWeek: string;
  startOfMonth: string;
  startOfNextMonth: string;
  startOfYear: string;
  startOfNextYear: string;
};

export async function getAdminAnalyticsDates(): Promise<AdminAnalyticsDates> {
  "use cache";
  cacheLife("minutes");
  cacheTag(ADMIN_TAG);

  const now = new Date();

  const startOfToday = startOfDayLocal(now);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const startOfWeek = startOfDayLocal(now);
  const day = startOfWeek.getDay();
  const difference = day === 0 ? 6 : day - 1;
  startOfWeek.setDate(startOfWeek.getDate() - difference);

  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfNextMonth = new Date(
    startOfMonth.getFullYear(),
    startOfMonth.getMonth() + 1,
    1
  );

  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const startOfNextYear = new Date(startOfYear.getFullYear() + 1, 0, 1);

  return {
    startOfToday: startOfToday.toISOString(),
    startOfTomorrow: startOfTomorrow.toISOString(),
    startOfWeek: startOfWeek.toISOString(),
    startOfNextWeek: startOfNextWeek.toISOString(),
    startOfMonth: startOfMonth.toISOString(),
    startOfNextMonth: startOfNextMonth.toISOString(),
    startOfYear: startOfYear.toISOString(),
    startOfNextYear: startOfNextYear.toISOString(),
  };
}

export type AdminAnalyticsProduct = {
  id: string;
  name: string;
  stock: number;
  price: number;
  costPrice: number;
  category: { name: string } | null;
};

export type AdminAnalyticsSalesItem = {
  productId: string;
  quantity: number;
  totalAmount: number;
  totalCost: number;
  profit: number;
  product: { id: string; name: string };
};

export type AdminAnalyticsSale = {
  id: string;
  soldAt: string;
  totalAmount: number;
  totalCost: number;
  items: AdminAnalyticsSalesItem[];
};

export type AdminAnalyticsPurchaseItem = {
  productId: string;
  quantity: number;
  totalCost: number;
  unitCost: number;
  product: { id: string; name: string };
};

export type AdminAnalyticsPurchase = {
  id: string;
  supplier: string | null;
  purchasedAt: string;
  totalCost: number;
  items: AdminAnalyticsPurchaseItem[];
};

export type AdminAnalyticsExpense = {
  id: string;
  title: string;
  amount: number;
  expenseDate: string;
};

export type AdminAnalyticsData = {
  sales: AdminAnalyticsSale[];
  expenses: AdminAnalyticsExpense[];
  purchases: AdminAnalyticsPurchase[];
  products: AdminAnalyticsProduct[];
};

export async function getAdminAnalyticsData(
  businessId: string
): Promise<AdminAnalyticsData> {
  "use cache";
  cacheLife("minutes");
  cacheTag(ADMIN_TAG);

  const [sales, expenses, purchases, products] = await Promise.all([
    prisma.sale.findMany({
      where: {
        businessId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },

      orderBy: {
        soldAt: "desc",
      },
    }),

    prisma.expense.findMany({
      where: {
        businessId,
      },

      orderBy: {
        expenseDate: "desc",
      },
    }),

    prisma.purchase.findMany({
      where: {
        businessId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },

      orderBy: {
        purchasedAt: "desc",
      },
    }),

    prisma.product.findMany({
      where: {
        businessId,
      },

      include: {
        category: true,
      },

      orderBy: {
        stock: "asc",
      },
    }),
  ]);

  return {
    sales: sales.map((sale) => ({
      id: sale.id,
      soldAt: sale.soldAt.toISOString(),
      totalAmount: Number(sale.totalAmount),
      totalCost: Number(sale.totalCost),
      items: sale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        totalAmount: Number(item.totalAmount),
        totalCost: Number(item.totalCost),
        profit: Number(item.profit),
        product: {
          id: item.product.id,
          name: item.product.name,
        },
      })),
    })),

    expenses: expenses.map((expense) => ({
      id: expense.id,
      title: expense.title,
      amount: Number(expense.amount),
      expenseDate: expense.expenseDate.toISOString(),
    })),

    purchases: purchases.map((purchase) => ({
      id: purchase.id,
      supplier: purchase.supplier,
      purchasedAt: purchase.purchasedAt.toISOString(),
      totalCost: Number(purchase.totalCost),
      items: purchase.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        totalCost: Number(item.totalCost),
        unitCost: Number(item.unitCost),
        product: {
          id: item.product.id,
          name: item.product.name,
        },
      })),
    })),

    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      price: Number(product.price),
      costPrice: Number(product.costPrice),
      category: product.category
        ? { name: product.category.name }
        : null,
    })),
  };
}

// =========================================================
// PRODUCTS PAGE
// =========================================================

export type AdminProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategoryOption = {
  id: string;
  name: string;
};

export async function getAdminProductsData(
  businessId: string
): Promise<{
  products: AdminProduct[];
  categories: AdminCategoryOption[];
}> {
  "use cache";
  cacheLife("hours");
  cacheTag(ADMIN_TAG);

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        businessId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.category.findMany({
      where: {
        businessId,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

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
      categoryId: product.categoryId,
      categoryName: product.category.name,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    })),

    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  };
}

// =========================================================
// CATEGORIES PAGE
// =========================================================

export type AdminCategory = {
  id: string;
  name: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminCategoriesData(
  businessId: string
): Promise<AdminCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(ADMIN_TAG);

  const categories = await prisma.category.findMany({
    where: {
      businessId,
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
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }));
}

// =========================================================
// PURCHASES PAGE
// =========================================================

export type AdminPurchaseProduct = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  category: string;
};

export async function getAdminPurchasesData(
  businessId: string
): Promise<AdminPurchaseProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(ADMIN_TAG);

  const products = await prisma.product.findMany({
    where: {
      businessId,
    },

    include: {
      category: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    imageUrl: product.imageUrl,
    category: product.category.name,
  }));
}

// =========================================================
// SALES PAGE
// =========================================================

export type AdminSalesProduct = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  category: string;
};

export async function getAdminSalesData(
  businessId: string
): Promise<AdminSalesProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(ADMIN_TAG);

  const products = await prisma.product.findMany({
    where: {
      businessId,
      isAvailable: true,
    },

    include: {
      category: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    imageUrl: product.imageUrl,
    category: product.category.name,
  }));
}

// =========================================================
// EXPENSES PAGE
// =========================================================

export type AdminExpense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminExpensesData(
  businessId: string
): Promise<AdminExpense[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(ADMIN_TAG);

  const expenses = await prisma.expense.findMany({
    where: {
      businessId,
    },
    orderBy: {
      expenseDate: "desc",
    },
  });

  return expenses.map((expense) => ({
    id: expense.id,
    title: expense.title,
    description: expense.description,
    amount: Number(expense.amount),
    expenseDate: expense.expenseDate.toISOString(),
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  }));
}

// =========================================================
// NOTIFICATIONS PAGE
// =========================================================

export type AdminNotificationProduct = {
  id: string;
  name: string;
  stock: number;
  categoryName: string;
};

export async function getAdminNotificationsData(
  businessId: string
): Promise<AdminNotificationProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(ADMIN_TAG);

  const products = await prisma.product.findMany({
    where: {
      businessId,
      isAvailable: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      stock: "asc",
    },
  });

  const lowStockProducts = products.filter(
    (product) => product.stock <= 2
  );

  return lowStockProducts.map((product) => ({
    id: product.id,
    name: product.name,
    stock: product.stock,
    categoryName: product.category.name,
  }));
}

// =========================================================
// REVALIDATION
// =========================================================

export { ADMIN_TAG as adminTag };