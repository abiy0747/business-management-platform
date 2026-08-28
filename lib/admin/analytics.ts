import { prisma } from "@/lib/prisma";

// =========================================================
// TYPES
// =========================================================

type ProductAnalysis = {
  id: string;
  name: string;
  category: string;
  stock: number;
  sellingPrice: number;
  costPrice: number;
  unitsSold: number;
  revenue: number;
  profit: number;
  profitMargin: number;
  salesVelocity: number;
  daysOfStock: number | null;
  stockValue: number;
  potentialRevenue: number;
  potentialProfit: number;
};

type CategoryAnalysis = {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  profit: number;
  profitMargin: number;
  products: number;
};

// =========================================================
// DATE HELPERS
// =========================================================

function startOfDay(date = new Date()) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function startOfWeek(date = new Date()) {
  const result = startOfDay(date);

  const day = result.getDay();

  const difference = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - difference);

  return result;
}

function startOfMonth(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
}

function startOfYear(date = new Date()) {
  return new Date(
    date.getFullYear(),
    0,
    1
  );
}

function addDays(date: Date, days: number) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function numberValue(value: unknown) {
  return Number(value ?? 0);
}

// =========================================================
// MAIN ANALYTICS FUNCTION
// =========================================================

export async function getAnalyticsData(
  businessId: string
) {
  const now = new Date();

  const today = startOfDay(now);

  const weekStart = startOfWeek(now);

  const monthStart = startOfMonth(now);

  const yearStart = startOfYear(now);

  // Previous month

  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  // Previous year

  const previousYearStart = new Date(
    now.getFullYear() - 1,
    0,
    1
  );

  const previousYearEnd = new Date(
    now.getFullYear(),
    0,
    1
  );

  // =======================================================
  // DATABASE
  // =======================================================

  const [
    sales,
    expenses,
    products,
  ] = await Promise.all([
    prisma.sale.findMany({
      where: {
        businessId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
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

    prisma.product.findMany({
      where: {
        businessId,
      },

      include: {
        category: true,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  // =======================================================
  // FINANCIAL TOTALS
  // =======================================================

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum + numberValue(sale.totalAmount),
    0
  );

  const totalCost = sales.reduce(
    (sum, sale) =>
      sum + numberValue(sale.totalCost),
    0
  );

  const grossProfit =
    totalRevenue - totalCost;

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + numberValue(expense.amount),
    0
  );

  const netProfit =
    grossProfit - totalExpenses;

  const totalSales = sales.length;

  const averageSaleValue =
    totalSales > 0
      ? totalRevenue / totalSales
      : 0;

  const grossMargin =
    totalRevenue > 0
      ? (grossProfit / totalRevenue) * 100
      : 0;

  const netMargin =
    totalRevenue > 0
      ? (netProfit / totalRevenue) * 100
      : 0;

  // =======================================================
  // MONTHLY GROWTH
  // =======================================================

  const currentMonthSales = sales.filter(
    (sale) => {
      const date = new Date(sale.soldAt);

      return (
        date >= monthStart &&
        date <= now
      );
    }
  );

  const previousMonthSales =
    sales.filter((sale) => {
      const date = new Date(sale.soldAt);

      return (
        date >= previousMonthStart &&
        date < previousMonthEnd
      );
    });

  const currentMonthRevenue =
    currentMonthSales.reduce(
      (sum, sale) =>
        sum + numberValue(sale.totalAmount),
      0
    );

  const previousMonthRevenue =
    previousMonthSales.reduce(
      (sum, sale) =>
        sum + numberValue(sale.totalAmount),
      0
    );

  const revenueGrowth =
    previousMonthRevenue > 0
      ? ((currentMonthRevenue -
          previousMonthRevenue) /
          previousMonthRevenue) *
        100
      : currentMonthRevenue > 0
        ? 100
        : 0;

  // =======================================================
  // YEAR GROWTH
  // =======================================================

  const currentYearSales = sales.filter(
    (sale) =>
      new Date(sale.soldAt) >=
      yearStart
  );

  const previousYearSales =
    sales.filter((sale) => {
      const date = new Date(sale.soldAt);

      return (
        date >= previousYearStart &&
        date < previousYearEnd
      );
    });

  const currentYearRevenue =
    currentYearSales.reduce(
      (sum, sale) =>
        sum + numberValue(sale.totalAmount),
      0
    );

  const previousYearRevenue =
    previousYearSales.reduce(
      (sum, sale) =>
        sum + numberValue(sale.totalAmount),
      0
    );

  const yearlyGrowth =
    previousYearRevenue > 0
      ? ((currentYearRevenue -
          previousYearRevenue) /
          previousYearRevenue) *
        100
      : currentYearRevenue > 0
        ? 100
        : 0;

  // =======================================================
  // PRODUCT ANALYSIS
  // =======================================================

  const productMap =
    new Map<string, ProductAnalysis>();

  for (const product of products) {
    productMap.set(product.id, {
      id: product.id,
      name: product.name,
      category:
        product.category?.name ??
        "Uncategorized",
      stock: product.stock,
      sellingPrice:
        numberValue(product.price),
      costPrice:
        numberValue(product.costPrice),
      unitsSold: 0,
      revenue: 0,
      profit: 0,
      profitMargin: 0,
      salesVelocity: 0,
      daysOfStock: null,
      stockValue:
        product.stock *
        numberValue(product.costPrice),
      potentialRevenue:
        product.stock *
        numberValue(product.price),
      potentialProfit:
        product.stock *
        (numberValue(product.price) -
          numberValue(product.costPrice)),
    });
  }

  // Count product sales

  for (const sale of sales) {
    for (const item of sale.items) {
      const product =
        productMap.get(item.productId);

      if (!product) continue;

      product.unitsSold +=
        item.quantity;

      product.revenue +=
        numberValue(
          item.totalAmount
        );

      product.profit +=
        numberValue(
          item.profit
        );
    }
  }

  // Calculate velocity

  const analysisDays = Math.max(
    1,
    Math.ceil(
      (now.getTime() -
        (
          sales.length > 0
            ? new Date(
                sales[sales.length - 1]
                  .soldAt
              ).getTime()
            : now.getTime()
        )) /
        (1000 * 60 * 60 * 24)
    )
  );

  for (const product of productMap.values()) {
    product.profitMargin =
      product.revenue > 0
        ? (product.profit /
            product.revenue) *
          100
        : 0;

    product.salesVelocity =
      product.unitsSold /
      analysisDays;

    product.daysOfStock =
      product.salesVelocity > 0
        ? product.stock /
          product.salesVelocity
        : null;
  }

  const productAnalyses =
    Array.from(productMap.values());

  // =======================================================
  // TOP SELLING PRODUCTS
  // =======================================================

  const topSellingProducts =
    [...productAnalyses]
      .sort(
        (a, b) =>
          b.unitsSold -
          a.unitsSold
      )
      .slice(0, 5);

  // =======================================================
  // MOST PROFITABLE PRODUCTS
  // =======================================================

  const mostProfitableProducts =
    [...productAnalyses]
      .sort(
        (a, b) =>
          b.profit -
          a.profit
      )
      .slice(0, 5);

  // =======================================================
  // SLOW MOVING PRODUCTS
  // =======================================================

  const slowMovingProducts =
    productAnalyses
      .filter(
        (product) =>
          product.stock > 0 &&
          product.unitsSold === 0
      )
      .sort(
        (a, b) =>
          b.stock -
          a.stock
      )
      .slice(0, 5);

  // =======================================================
  // PRODUCTS RUNNING OUT SOON
  // =======================================================

  const productsRunningOut =
    productAnalyses
      .filter(
        (product) =>
          product.stock > 0 &&
          product.daysOfStock !== null &&
          product.daysOfStock <= 7
      )
      .sort(
        (a, b) =>
          (a.daysOfStock ?? Infinity) -
          (b.daysOfStock ?? Infinity)
      )
      .slice(0, 5);

  // =======================================================
  // CATEGORY ANALYSIS
  // =======================================================

  const categoryMap =
    new Map<
      string,
      CategoryAnalysis
    >();

  for (const product of products) {
    const categoryId =
      product.categoryId;

    const categoryName =
      product.category?.name ??
      "Uncategorized";

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: categoryName,
        unitsSold: 0,
        revenue: 0,
        profit: 0,
        profitMargin: 0,
        products: 0,
      });
    }

    const category =
      categoryMap.get(categoryId)!;

    category.products += 1;
  }

  for (const product of productAnalyses) {
    const category =
      Array.from(
        categoryMap.values()
      ).find(
        (item) =>
          item.name === product.category
      );

    if (!category) continue;

    category.unitsSold +=
      product.unitsSold;

    category.revenue +=
      product.revenue;

    category.profit +=
      product.profit;
  }

  for (const category of categoryMap.values()) {
    category.profitMargin =
      category.revenue > 0
        ? (category.profit /
            category.revenue) *
          100
        : 0;
  }

  const categoryAnalyses =
    Array.from(
      categoryMap.values()
    ).sort(
      (a, b) =>
        b.revenue -
        a.revenue
    );

  // =======================================================
  // INVENTORY
  // =======================================================

  const totalStockUnits =
    products.reduce(
      (sum, product) =>
        sum + product.stock,
      0
    );

  const inventoryCostValue =
    productAnalyses.reduce(
      (sum, product) =>
        sum + product.stockValue,
      0
    );

  const inventorySellingValue =
    productAnalyses.reduce(
      (sum, product) =>
        sum + product.potentialRevenue,
      0
    );

  const inventoryPotentialProfit =
    productAnalyses.reduce(
      (sum, product) =>
        sum + product.potentialProfit,
      0
    );

  const outOfStockCount =
    products.filter(
      (product) =>
        product.stock === 0
    ).length;

  const lowStockCount =
    products.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 5
    ).length;

  // =======================================================
  // SALES BY DAY OF WEEK
  // =======================================================

  const daySales = [
    {
      day: "Monday",
      revenue: 0,
      sales: 0,
    },
    {
      day: "Tuesday",
      revenue: 0,
      sales: 0,
    },
    {
      day: "Wednesday",
      revenue: 0,
      sales: 0,
    },
    {
      day: "Thursday",
      revenue: 0,
      sales: 0,
    },
    {
      day: "Friday",
      revenue: 0,
      sales: 0,
    },
    {
      day: "Saturday",
      revenue: 0,
      sales: 0,
    },
    {
      day: "Sunday",
      revenue: 0,
      sales: 0,
    },
  ];

  for (const sale of sales) {
    const day =
      new Date(
        sale.soldAt
      ).getDay();

    const index =
      day === 0
        ? 6
        : day - 1;

    daySales[index].revenue +=
      numberValue(
        sale.totalAmount
      );

    daySales[index].sales += 1;
  }

  const bestSalesDay =
    [...daySales].sort(
      (a, b) =>
        b.revenue -
        a.revenue
    )[0] ?? null;

  // =======================================================
  // EXPENSE RATIO
  // =======================================================

  const expenseRatio =
    totalRevenue > 0
      ? (totalExpenses /
          totalRevenue) *
        100
      : 0;

  // =======================================================
  // BUSINESS SCORE
  // =======================================================

  let businessScore = 50;

  if (grossMargin >= 30) {
    businessScore += 15;
  } else if (grossMargin >= 15) {
    businessScore += 8;
  } else if (
    totalRevenue > 0
  ) {
    businessScore -= 10;
  }

  if (netMargin >= 20) {
    businessScore += 15;
  } else if (netMargin >= 10) {
    businessScore += 8;
  } else if (
    totalRevenue > 0
  ) {
    businessScore -= 10;
  }

  if (lowStockCount > 0) {
    businessScore -= Math.min(
      lowStockCount * 2,
      10
    );
  }

  if (outOfStockCount > 0) {
    businessScore -= Math.min(
      outOfStockCount * 3,
      10
    );
  }

  businessScore = Math.max(
    0,
    Math.min(100, businessScore)
  );

  // =======================================================
  // AUTOMATIC INSIGHTS
  // =======================================================

  const insights: Array<{
    type:
      | "success"
      | "warning"
      | "danger"
      | "info";
    title: string;
    message: string;
  }> = [];

  const fastestProduct =
    [...productAnalyses]
      .filter(
        (product) =>
          product.unitsSold > 0
      )
      .sort(
        (a, b) =>
          b.salesVelocity -
          a.salesVelocity
      )[0];

  if (fastestProduct) {
    insights.push({
      type: "success",
      title: "Fastest mover",
      message:
        `${fastestProduct.name} is your fastest-moving product, averaging ` +
        `${fastestProduct.salesVelocity.toFixed(1)} units per day.`,
    });
  }

  if (productsRunningOut.length > 0) {
    const product =
      productsRunningOut[0];

    insights.push({
      type: "warning",
      title: "Stock running low",
      message:
        `${product.name} may run out in approximately ` +
        `${Math.max(
          1,
          Math.round(
            product.daysOfStock ?? 0
          )
        )} days based on its current sales velocity.`,
    });
  }

  if (slowMovingProducts.length > 0) {
    const product =
      slowMovingProducts[0];

    insights.push({
      type: "danger",
      title: "Dead stock detected",
      message:
        `${product.name} has ${product.stock} units in stock but has recorded no sales.`,
    });
  }

  if (bestSalesDay) {
    insights.push({
      type: "info",
      title: "Best sales day",
      message:
        `${bestSalesDay.day} generates the highest revenue based on your sales history.`,
    });
  }

  if (revenueGrowth > 0) {
    insights.push({
      type: "success",
      title: "Revenue is growing",
      message:
        `Revenue is up ${revenueGrowth.toFixed(
          1
        )}% compared with the previous month.`,
    });
  } else if (revenueGrowth < 0) {
    insights.push({
      type: "warning",
      title: "Revenue declined",
      message:
        `Revenue is down ${Math.abs(
          revenueGrowth
        ).toFixed(
          1
        )}% compared with the previous month.`,
    });
  }

  if (expenseRatio > 30) {
    insights.push({
      type: "warning",
      title: "High expense ratio",
      message:
        `Operating expenses consume ${expenseRatio.toFixed(
          1
        )}% of your total revenue.`,
    });
  }

  // =======================================================
  // RETURN
  // =======================================================

  return {
    summary: {
      totalRevenue,
      totalCost,
      grossProfit,
      totalExpenses,
      netProfit,
      totalSales,
      averageSaleValue,
      grossMargin,
      netMargin,
    },

    growth: {
      currentMonthRevenue,
      previousMonthRevenue,
      revenueGrowth,
      currentYearRevenue,
      previousYearRevenue,
      yearlyGrowth,
    },

    periods: {
      today: {
        revenue: sales
          .filter(
            (sale) =>
              new Date(
                sale.soldAt
              ) >= today
          )
          .reduce(
            (sum, sale) =>
              sum +
              numberValue(
                sale.totalAmount
              ),
            0
          ),
      },

      week: {
        revenue: sales
          .filter(
            (sale) =>
              new Date(
                sale.soldAt
              ) >= weekStart
          )
          .reduce(
            (sum, sale) =>
              sum +
              numberValue(
                sale.totalAmount
              ),
            0
          ),
      },

      month: {
        revenue: currentMonthRevenue,
      },

      year: {
        revenue: currentYearRevenue,
      },
    },

    products: {
      all: productAnalyses,
      topSelling:
        topSellingProducts,
      mostProfitable:
        mostProfitableProducts,
      slowMoving:
        slowMovingProducts,
      runningOut:
        productsRunningOut,
    },

    categories:
      categoryAnalyses,

    inventory: {
      totalProducts:
        products.length,
      totalStockUnits,
      inventoryCostValue,
      inventorySellingValue,
      inventoryPotentialProfit,
      lowStockCount,
      outOfStockCount,
    },

    salesPatterns: {
      byDay: daySales,
      bestSalesDay,
    },

    expenses: {
      total: totalExpenses,
      expenseRatio,
    },

    businessHealth: {
      score: businessScore,
    },

    insights,
  };
}