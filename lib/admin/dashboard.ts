import { prisma } from "@/lib/prisma";

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
  const result = startOfDay(date);

  result.setDate(1);

  return result;
}

function startOfYear(date = new Date()) {
  const result = startOfDay(date);

  result.setMonth(0, 1);

  return result;
}

// =========================================================
// YESTERDAY
// =========================================================

function getYesterday() {
  const yesterday = startOfDay();

  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday;
}

// =========================================================
// MONEY
// =========================================================

function numberValue(value: unknown) {
  return Number(value ?? 0);
}

// =========================================================
// SALES SUMMARY
// =========================================================

async function getSalesSummary(
  businessId: string,
  from: Date,
  to: Date
) {
  const result = await prisma.sale.aggregate({
    where: {
      businessId,

      soldAt: {
        gte: from,
        lt: to,
      },
    },

    _sum: {
      totalAmount: true,
      totalCost: true,
      profit: true,
    },

    _count: {
      id: true,
    },
  });

  return {
    revenue: numberValue(result._sum.totalAmount),

    cost: numberValue(result._sum.totalCost),

    profit: numberValue(result._sum.profit),

    salesCount: result._count.id,
  };
}

// =========================================================
// EXPENSE SUMMARY
// =========================================================

async function getExpenseSummary(
  businessId: string,
  from: Date,
  to: Date
) {
  const result = await prisma.expense.aggregate({
    where: {
      businessId,

      expenseDate: {
        gte: from,
        lt: to,
      },
    },

    _sum: {
      amount: true,
    },
  });

  return numberValue(result._sum.amount);
}

// =========================================================
// BUILD SUMMARY
// =========================================================

function buildSummary(
  sales: {
    revenue: number;
    cost: number;
    profit: number;
    salesCount: number;
  },
  expenses: number
) {
  const netProfit = sales.profit - expenses;

  const profitMargin =
    sales.revenue > 0
      ? (sales.profit / sales.revenue) * 100
      : 0;

  return {
    revenue: sales.revenue,
    cost: sales.cost,
    profit: sales.profit,
    expenses,
    netProfit,
    profitMargin,
    salesCount: sales.salesCount,
  };
}

// =========================================================
// DAILY CHART
// =========================================================

async function getDailyChart(
  businessId: string,
  days: number
) {
  const today = startOfDay();

  const from = new Date(today);

  from.setDate(
    from.getDate() - (days - 1)
  );

  const to = new Date(today);

  to.setDate(to.getDate() + 1);

  const [sales, expenses] =
    await Promise.all([
      prisma.sale.findMany({
        where: {
          businessId,

          soldAt: {
            gte: from,
            lt: to,
          },
        },

        select: {
          totalAmount: true,
          totalCost: true,
          profit: true,
          soldAt: true,
        },
      }),

      prisma.expense.findMany({
        where: {
          businessId,

          expenseDate: {
            gte: from,
            lt: to,
          },
        },

        select: {
          amount: true,
          expenseDate: true,
        },
      }),
    ]);

  const chart = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(from);

    date.setDate(
      date.getDate() + i
    );

    const nextDate = new Date(date);

    nextDate.setDate(
      nextDate.getDate() + 1
    );

    const daySales = sales.filter(
      (sale) =>
        sale.soldAt >= date &&
        sale.soldAt < nextDate
    );

    const dayExpenses =
      expenses.filter(
        (expense) =>
          expense.expenseDate >= date &&
          expense.expenseDate < nextDate
      );

    const revenue =
      daySales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.totalAmount
          ),
        0
      );

    const cost =
      daySales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.totalCost
          ),
        0
      );

    const profit =
      daySales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.profit
          ),
        0
      );

    const expensesAmount =
      dayExpenses.reduce(
        (sum, expense) =>
          sum +
          numberValue(
            expense.amount
          ),
        0
      );

    chart.push({
      label: date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      ),

      date: date.toISOString(),

      revenue,
      cost,
      profit,
      expenses: expensesAmount,

      netProfit:
        profit - expensesAmount,
    });
  }

  return chart;
}

// =========================================================
// MONTHLY CHART
// =========================================================

async function getMonthlyChart(
  businessId: string
) {
  const today = new Date();

  const from = new Date(
    today.getFullYear(),
    today.getMonth() - 11,
    1
  );

  const to = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  const [sales, expenses] =
    await Promise.all([
      prisma.sale.findMany({
        where: {
          businessId,

          soldAt: {
            gte: from,
            lt: to,
          },
        },

        select: {
          totalAmount: true,
          totalCost: true,
          profit: true,
          soldAt: true,
        },
      }),

      prisma.expense.findMany({
        where: {
          businessId,

          expenseDate: {
            gte: from,
            lt: to,
          },
        },

        select: {
          amount: true,
          expenseDate: true,
        },
      }),
    ]);

  const chart = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      from.getFullYear(),
      from.getMonth() + i,
      1
    );

    const nextDate = new Date(
      from.getFullYear(),
      from.getMonth() + i + 1,
      1
    );

    const monthSales =
      sales.filter(
        (sale) =>
          sale.soldAt >= date &&
          sale.soldAt < nextDate
      );

    const monthExpenses =
      expenses.filter(
        (expense) =>
          expense.expenseDate >= date &&
          expense.expenseDate < nextDate
      );

    const revenue =
      monthSales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.totalAmount
          ),
        0
      );

    const cost =
      monthSales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.totalCost
          ),
        0
      );

    const profit =
      monthSales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.profit
          ),
        0
      );

    const expensesAmount =
      monthExpenses.reduce(
        (sum, expense) =>
          sum +
          numberValue(
            expense.amount
          ),
        0
      );

    chart.push({
      label: date.toLocaleDateString(
        "en-US",
        {
          month: "short",
        }
      ),

      date: date.toISOString(),

      revenue,
      cost,
      profit,
      expenses: expensesAmount,

      netProfit:
        profit - expensesAmount,
    });
  }

  return chart;
}

// =========================================================
// YEARLY CHART
// =========================================================

async function getYearlyChart(
  businessId: string
) {
  const currentYear =
    new Date().getFullYear();

  const from = new Date(
    currentYear - 4,
    0,
    1
  );

  const to = new Date(
    currentYear + 1,
    0,
    1
  );

  const [sales, expenses] =
    await Promise.all([
      prisma.sale.findMany({
        where: {
          businessId,

          soldAt: {
            gte: from,
            lt: to,
          },
        },

        select: {
          totalAmount: true,
          totalCost: true,
          profit: true,
          soldAt: true,
        },
      }),

      prisma.expense.findMany({
        where: {
          businessId,

          expenseDate: {
            gte: from,
            lt: to,
          },
        },

        select: {
          amount: true,
          expenseDate: true,
        },
      }),
    ]);

  const chart = [];

  for (let i = 0; i < 5; i++) {
    const year =
      currentYear - 4 + i;

    const yearStart =
      new Date(year, 0, 1);

    const yearEnd =
      new Date(year + 1, 0, 1);

    const yearSales =
      sales.filter(
        (sale) =>
          sale.soldAt >= yearStart &&
          sale.soldAt < yearEnd
      );

    const yearExpenses =
      expenses.filter(
        (expense) =>
          expense.expenseDate >=
            yearStart &&
          expense.expenseDate <
            yearEnd
      );

    const revenue =
      yearSales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.totalAmount
          ),
        0
      );

    const cost =
      yearSales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.totalCost
          ),
        0
      );

    const profit =
      yearSales.reduce(
        (sum, sale) =>
          sum +
          numberValue(
            sale.profit
          ),
        0
      );

    const expensesAmount =
      yearExpenses.reduce(
        (sum, expense) =>
          sum +
          numberValue(
            expense.amount
          ),
        0
      );

    chart.push({
      label: String(year),

      date: yearStart.toISOString(),

      revenue,
      cost,
      profit,
      expenses: expensesAmount,

      netProfit:
        profit - expensesAmount,
    });
  }

  return chart;
}

// =========================================================
// MAIN DASHBOARD
// =========================================================

export async function getDashboardData(
  businessId: string
) {
  const today = startOfDay();

  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  // =======================================================
  // YESTERDAY
  // =======================================================

  const yesterday =
    getYesterday();

  const yesterdayEnd =
    new Date(today);

  // =======================================================
  // WEEK
  // =======================================================

  const weekStart =
    startOfWeek();

  const nextWeek =
    new Date(weekStart);

  nextWeek.setDate(
    nextWeek.getDate() + 7
  );

  // =======================================================
  // MONTH
  // =======================================================

  const monthStart =
    startOfMonth();

  const nextMonth =
    new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      1
    );

  // =======================================================
  // YEAR
  // =======================================================

  const yearStart =
    startOfYear();

  const nextYear =
    new Date(
      yearStart.getFullYear() + 1,
      0,
      1
    );

  // =======================================================
  // FETCH EVERYTHING
  // =======================================================

  const [
    todaySales,
    yesterdaySales,
    weekSales,
    monthSales,
    yearSales,

    todayExpenses,
    yesterdayExpenses,
    weekExpenses,
    monthExpenses,
    yearExpenses,

    productCount,

    lowStockProducts,

    inventoryProducts,

    recentSales,

    weeklyChart,
    monthlyChart,
    yearlyChart,
  ] = await Promise.all([

    // TODAY
    getSalesSummary(
      businessId,
      today,
      tomorrow
    ),

    // YESTERDAY
    getSalesSummary(
      businessId,
      yesterday,
      yesterdayEnd
    ),

    // WEEK
    getSalesSummary(
      businessId,
      weekStart,
      nextWeek
    ),

    // MONTH
    getSalesSummary(
      businessId,
      monthStart,
      nextMonth
    ),

    // YEAR
    getSalesSummary(
      businessId,
      yearStart,
      nextYear
    ),

    // TODAY EXPENSES
    getExpenseSummary(
      businessId,
      today,
      tomorrow
    ),

    // YESTERDAY EXPENSES
    getExpenseSummary(
      businessId,
      yesterday,
      yesterdayEnd
    ),

    // WEEK EXPENSES
    getExpenseSummary(
      businessId,
      weekStart,
      nextWeek
    ),

    // MONTH EXPENSES
    getExpenseSummary(
      businessId,
      monthStart,
      nextMonth
    ),

    // YEAR EXPENSES
    getExpenseSummary(
      businessId,
      yearStart,
      nextYear
    ),

    // PRODUCT COUNT
    prisma.product.count({
      where: {
        businessId,
      },
    }),

    // LOW STOCK
    prisma.product.findMany({
      where: {
        businessId,

        stock: {
          lte: 5,
        },
      },

      include: {
        category: true,
      },

      orderBy: {
        stock: "asc",
      },

      take: 5,
    }),

    // INVENTORY PRODUCTS
    prisma.product.findMany({
      where: {
        businessId,
      },

      include: {
        category: true,
      },

      orderBy: {
        updatedAt: "desc",
      },

      take: 8,
    }),

    // RECENT SALES
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

      take: 8,
    }),

    // WEEK CHART
    getDailyChart(
      businessId,
      7
    ),

    // MONTH CHART
    getMonthlyChart(
      businessId
    ),

    // YEAR CHART
    getYearlyChart(
      businessId
    ),
  ]);

  // =======================================================
  // SUMMARIES
  // =======================================================

  const todaySummary =
    buildSummary(
      todaySales,
      todayExpenses
    );

  const yesterdaySummary =
    buildSummary(
      yesterdaySales,
      yesterdayExpenses
    );

  const weekSummary =
    buildSummary(
      weekSales,
      weekExpenses
    );

  const monthSummary =
    buildSummary(
      monthSales,
      monthExpenses
    );

  const yearSummary =
    buildSummary(
      yearSales,
      yearExpenses
    );

  // =======================================================
  // RETURN
  // =======================================================

  return {
    stats: {
      // TODAY
      todayRevenue:
        todaySummary.revenue,

      todayCost:
        todaySummary.cost,

      todayProfit:
        todaySummary.profit,

      todayExpenses:
        todaySummary.expenses,

      todayNetProfit:
        todaySummary.netProfit,

      todaySalesCount:
        todaySummary.salesCount,

      todayProfitMargin:
        todaySummary.profitMargin,

      // YESTERDAY
      yesterdayRevenue:
        yesterdaySummary.revenue,

      yesterdayCost:
        yesterdaySummary.cost,

      yesterdayProfit:
        yesterdaySummary.profit,

      yesterdayExpenses:
        yesterdaySummary.expenses,

      yesterdayNetProfit:
        yesterdaySummary.netProfit,

      yesterdaySalesCount:
        yesterdaySummary.salesCount,

      yesterdayProfitMargin:
        yesterdaySummary.profitMargin,

      // WEEK
      weekRevenue:
        weekSummary.revenue,

      weekCost:
        weekSummary.cost,

      weekProfit:
        weekSummary.profit,

      weekExpenses:
        weekSummary.expenses,

      weekNetProfit:
        weekSummary.netProfit,

      weekProfitMargin:
        weekSummary.profitMargin,

      weekSalesCount:
        weekSummary.salesCount,

      // MONTH
      monthRevenue:
        monthSummary.revenue,

      monthCost:
        monthSummary.cost,

      monthProfit:
        monthSummary.profit,

      monthExpenses:
        monthSummary.expenses,

      monthNetProfit:
        monthSummary.netProfit,

      monthProfitMargin:
        monthSummary.profitMargin,

      monthSalesCount:
        monthSummary.salesCount,

      // YEAR
      yearRevenue:
        yearSummary.revenue,

      yearCost:
        yearSummary.cost,

      yearProfit:
        yearSummary.profit,

      yearExpenses:
        yearSummary.expenses,

      yearNetProfit:
        yearSummary.netProfit,

      yearProfitMargin:
        yearSummary.profitMargin,

      yearSalesCount:
        yearSummary.salesCount,

      // INVENTORY
      productCount,

      lowStockCount:
        lowStockProducts.length,
    },

    lowStockProducts,

    inventoryProducts,

    recentSales,

    charts: {
      weekly: weeklyChart,
      monthly: monthlyChart,
      yearly: yearlyChart,
    },
  };
}