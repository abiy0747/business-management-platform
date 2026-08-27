import { prisma } from "@/lib/prisma";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getStartOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function getStartOfWeek(date: Date) {
  const result = getStartOfDay(date);

  const day = result.getDay();

  const difference =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() - difference
  );

  return result;
}

function getStartOfMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
}

function getStartOfYear(date: Date) {
  return new Date(
    date.getFullYear(),
    0,
    1
  );
}

export default async function AnalyticsPage() {
  const business =
    await prisma.business.findFirst();

  if (!business) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="text-center">
          <h2 className="text-lg font-black text-[#222022]">
            No business found
          </h2>

          <p className="mt-2 text-sm text-black/40">
            Please run the seed script first.
          </p>
        </div>
      </div>
    );
  }

  const now = new Date();

  const startOfToday =
    getStartOfDay(now);

  const startOfWeek =
    getStartOfWeek(now);

  const startOfMonth =
    getStartOfMonth(now);

  const startOfYear =
    getStartOfYear(now);

  // =========================================================
  // GET SALES
  // =========================================================

  const sales =
    await prisma.sale.findMany({
      where: {
        businessId:
          business.id,
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
    });

  // =========================================================
  // GET EXPENSES
  // =========================================================

  const expenses =
    await prisma.expense.findMany({
      where: {
        businessId:
          business.id,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

  // =========================================================
  // GET PURCHASES
  // =========================================================

  const purchases =
    await prisma.purchase.findMany({
      where: {
        businessId:
          business.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });

  // =========================================================
  // GET PRODUCTS
  // =========================================================

  const products =
    await prisma.product.findMany({
      where: {
        businessId:
          business.id,
      },
      orderBy: {
        stock: "desc",
      },
    });

  // =========================================================
  // ALL-TIME SALES
  // =========================================================

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalAmount
        ),
      0
    );

  const totalCost =
    sales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalCost
        ),
      0
    );

  const grossProfit =
    totalRevenue - totalCost;

  // =========================================================
  // ALL-TIME EXPENSES
  // =========================================================

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(
          expense.amount
        ),
      0
    );

  const netProfit =
    grossProfit -
    totalExpenses;

  const totalSales =
    sales.length;

  // =========================================================
  // TODAY
  // =========================================================

  const todaySales =
    sales.filter(
      (sale) =>
        new Date(
          sale.soldAt
        ) >= startOfToday
    );

  const todayRevenue =
    todaySales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalAmount
        ),
      0
    );

  const todayCost =
    todaySales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalCost
        ),
      0
    );

  const todayGrossProfit =
    todayRevenue -
    todayCost;

  const todayExpenses =
    expenses
      .filter(
        (expense) =>
          new Date(
            expense.expenseDate
          ) >= startOfToday
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount
          ),
        0
      );

  const todayNetProfit =
    todayGrossProfit -
    todayExpenses;

  // =========================================================
  // THIS WEEK
  // =========================================================

  const weekSales =
    sales.filter(
      (sale) =>
        new Date(
          sale.soldAt
        ) >= startOfWeek
    );

  const weekRevenue =
    weekSales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalAmount
        ),
      0
    );

  const weekCost =
    weekSales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalCost
        ),
      0
    );

  const weekGrossProfit =
    weekRevenue -
    weekCost;

  const weekExpenses =
    expenses
      .filter(
        (expense) =>
          new Date(
            expense.expenseDate
          ) >= startOfWeek
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount
          ),
        0
      );

  const weekNetProfit =
    weekGrossProfit -
    weekExpenses;

  // =========================================================
  // THIS MONTH
  // =========================================================

  const monthSales =
    sales.filter(
      (sale) =>
        new Date(
          sale.soldAt
        ) >= startOfMonth
    );

  const monthRevenue =
    monthSales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalAmount
        ),
      0
    );

  const monthCost =
    monthSales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalCost
        ),
      0
    );

  const monthGrossProfit =
    monthRevenue -
    monthCost;

  const monthExpenses =
    expenses
      .filter(
        (expense) =>
          new Date(
            expense.expenseDate
          ) >= startOfMonth
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount
          ),
        0
      );

  const monthNetProfit =
    monthGrossProfit -
    monthExpenses;

  // =========================================================
  // THIS YEAR
  // =========================================================

  const yearSales =
    sales.filter(
      (sale) =>
        new Date(
          sale.soldAt
        ) >= startOfYear
    );

  const yearRevenue =
    yearSales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalAmount
        ),
      0
    );

  const yearCost =
    yearSales.reduce(
      (sum, sale) =>
        sum + Number(
          sale.totalCost
        ),
      0
    );

  const yearGrossProfit =
    yearRevenue -
    yearCost;

  const yearExpenses =
    expenses
      .filter(
        (expense) =>
          new Date(
            expense.expenseDate
          ) >= startOfYear
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount
          ),
        0
      );

  const yearNetProfit =
    yearGrossProfit -
    yearExpenses;

  // =========================================================
  // BEST SELLING PRODUCTS
  // =========================================================

  const productSales =
    new Map<
      string,
      {
        name: string;
        quantity: number;
        revenue: number;
        profit: number;
      }
    >();

  for (const sale of sales) {
    for (const item of sale.items) {
      const existing =
        productSales.get(
          item.productId
        );

      const quantity =
        item.quantity;

      const revenue =
        Number(
          item.totalAmount
        );

      const profit =
        Number(
          item.profit
        );

      if (existing) {
        existing.quantity +=
          quantity;

        existing.revenue +=
          revenue;

        existing.profit +=
          profit;
      } else {
        productSales.set(
          item.productId,
          {
            name:
              item.product.name,

            quantity,

            revenue,

            profit,
          }
        );
      }
    }
  }

  const bestSellingProducts =
    Array.from(
      productSales.values()
    )
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )
      .slice(0, 5);

  // =========================================================
  // EXPENSE BREAKDOWN
  // =========================================================

  const expenseBreakdown =
    new Map<
      string,
      number
    >();

  for (const expense of expenses) {
    const current =
      expenseBreakdown.get(
        expense.title
      ) ?? 0;

    expenseBreakdown.set(
      expense.title,
      current +
        Number(
          expense.amount
        )
    );
  }

  const topExpenses =
    Array.from(
      expenseBreakdown.entries()
    )
      .map(
        ([title, amount]) => ({
          title,
          amount,
        })
      )
      .sort(
        (a, b) =>
          b.amount -
          a.amount
      )
      .slice(0, 5);

  // =========================================================
  // STOCK
  // =========================================================

  const totalStockUnits =
    products.reduce(
      (sum, product) =>
        sum + product.stock,
      0
    );

  const stockValue =
    products.reduce(
      (sum, product) =>
        sum +
        product.stock *
          Number(
            product.costPrice
          ),
      0
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 5
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        product.stock === 0
    ).length;

  // =========================================================
  // PROFIT MARGIN
  // =========================================================

  const profitMargin =
    totalRevenue > 0
      ? (grossProfit /
          totalRevenue) *
        100
      : 0;

  const netProfitMargin =
    totalRevenue > 0
      ? (netProfit /
          totalRevenue) *
        100
      : 0;

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
            Business intelligence
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-black/40">
            Understand sales, profit, expenses and
            inventory performance.
          </p>
        </div>

        {/* ===================================================
            MAIN FINANCIAL CARDS
        =================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-[24px] bg-[#222022] p-5 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
              Total revenue
            </p>

            <p className="mt-3 text-2xl font-black">
              {formatCurrency(
                totalRevenue
              )}
            </p>

            <p className="mt-2 text-xs text-white/35">
              {totalSales} total sales
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Gross profit
            </p>

            <p className="mt-3 text-2xl font-black">
              {formatCurrency(
                grossProfit
              )}
            </p>

            <p className="mt-2 text-xs text-black/35">
              {profitMargin.toFixed(1)}% margin
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Total expenses
            </p>

            <p className="mt-3 text-2xl font-black">
              {formatCurrency(
                totalExpenses
              )}
            </p>

            <p className="mt-2 text-xs text-black/35">
              Business operating costs
            </p>
          </div>

          <div className="rounded-[24px] bg-[#C3D809] p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
              Net profit
            </p>

            <p className="mt-3 text-2xl font-black text-[#222022]">
              {formatCurrency(
                netProfit
              )}
            </p>

            <p className="mt-2 text-xs text-black/45">
              {netProfitMargin.toFixed(1)}% net margin
            </p>
          </div>

        </div>

        {/* ===================================================
            PERIOD PERFORMANCE
        =================================================== */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Performance
            </p>

            <h2 className="mt-1 text-lg font-black">
              Period overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-xs font-bold text-black/40">
                Today
              </p>

              <p className="mt-2 text-lg font-black">
                {formatCurrency(
                  todayNetProfit
                )}
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Revenue{" "}
                {formatCurrency(
                  todayRevenue
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-xs font-bold text-black/40">
                This week
              </p>

              <p className="mt-2 text-lg font-black">
                {formatCurrency(
                  weekNetProfit
                )}
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Revenue{" "}
                {formatCurrency(
                  weekRevenue
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-xs font-bold text-black/40">
                This month
              </p>

              <p className="mt-2 text-lg font-black">
                {formatCurrency(
                  monthNetProfit
                )}
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Revenue{" "}
                {formatCurrency(
                  monthRevenue
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-xs font-bold text-black/40">
                This year
              </p>

              <p className="mt-2 text-lg font-black">
                {formatCurrency(
                  yearNetProfit
                )}
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Revenue{" "}
                {formatCurrency(
                  yearRevenue
                )}
              </p>
            </div>

          </div>
        </section>

        {/* ===================================================
            SALES + STOCK
        =================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* BEST SELLING */}

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Product performance
              </p>

              <h2 className="mt-1 text-lg font-black">
                Best-selling products
              </h2>
            </div>

            {bestSellingProducts.length ===
            0 ? (
              <div className="rounded-2xl bg-[#F8F8F6] px-5 py-12 text-center">
                <p className="text-sm font-bold text-black/40">
                  No sales yet
                </p>

                <p className="mt-1 text-xs text-black/25">
                  Product performance will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bestSellingProducts.map(
                  (
                    product,
                    index
                  ) => (
                    <div
                      key={
                        product.name
                      }
                      className="flex items-center justify-between rounded-2xl bg-[#F8F8F6] p-4"
                    >
                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#222022] text-xs font-black text-[#C3D809]">
                          {index +
                            1}
                        </div>

                        <div>
                          <p className="text-sm font-bold">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 text-[10px] text-black/35">
                            {
                              product.quantity
                            }{" "}
                            units sold
                          </p>
                        </div>

                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black">
                          {formatCurrency(
                            product.revenue
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-emerald-600">
                          +{formatCurrency(
                            product.profit
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          </section>

          {/* STOCK */}

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Inventory
              </p>

              <h2 className="mt-1 text-lg font-black">
                Stock overview
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-[#F8F8F6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                  Products
                </p>

                <p className="mt-2 text-xl font-black">
                  {products.length}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8F8F6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                  Stock units
                </p>

                <p className="mt-2 text-xl font-black">
                  {totalStockUnits}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8F8F6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                  Stock value
                </p>

                <p className="mt-2 text-xl font-black">
                  {formatCurrency(
                    stockValue
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8F8F6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                  Low stock
                </p>

                <p className="mt-2 text-xl font-black">
                  {lowStockProducts}
                </p>

                <p className="mt-1 text-[10px] text-black/30">
                  {outOfStockProducts} out of stock
                </p>
              </div>

            </div>

          </section>

        </div>

        {/* ===================================================
            EXPENSE BREAKDOWN
        =================================================== */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Expense analysis
            </p>

            <h2 className="mt-1 text-lg font-black">
              Largest expenses
            </h2>
          </div>

          {topExpenses.length ===
          0 ? (
            <div className="rounded-2xl bg-[#F8F8F6] px-5 py-12 text-center">
              <p className="text-sm font-bold text-black/40">
                No expenses recorded
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topExpenses.map(
                (expense) => {

                  const percentage =
                    totalExpenses >
                    0
                      ? (expense.amount /
                          totalExpenses) *
                        100
                      : 0;

                  return (
                    <div
                      key={
                        expense.title
                      }
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">

                        <p className="truncate text-sm font-bold">
                          {
                            expense.title
                          }
                        </p>

                        <p className="shrink-0 text-sm font-black">
                          {formatCurrency(
                            expense.amount
                          )}
                        </p>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                        <div
                          className="h-full rounded-full bg-[#C3D809]"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-[9px] text-black/30">
                        {percentage.toFixed(
                          1
                        )}
                        % of total expenses
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          )}

        </section>

        {/* ===================================================
            PURCHASE OVERVIEW
        =================================================== */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Purchasing
            </p>

            <h2 className="mt-1 text-lg font-black">
              Stock purchasing overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Total purchases
              </p>

              <p className="mt-2 text-xl font-black">
                {purchases.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Purchase cost
              </p>

              <p className="mt-2 text-xl font-black">
                {formatCurrency(
                  purchases.reduce(
                    (sum, purchase) =>
                      sum +
                      Number(
                        purchase.totalCost
                      ),
                    0
                  )
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Inventory value
              </p>

              <p className="mt-2 text-xl font-black">
                {formatCurrency(
                  stockValue
                )}
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}