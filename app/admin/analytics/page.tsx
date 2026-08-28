import { Suspense } from "react";
import { getAdminAnalyticsData, getAdminAnalyticsDates } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";

// =========================================================
// HELPERS
// =========================================================

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function percentage(
  value: number,
  total: number
) {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

// =========================================================
// PAGE
// =========================================================

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
}

async function AnalyticsContent() {
  // =======================================================
  // BUSINESS
  // =======================================================

  const business =
    await requireAdminSession();

  // =======================================================
  // DATES
  // =======================================================

  const dates =
    await getAdminAnalyticsDates();

  const startOfToday =
    new Date(dates.startOfToday);

  const startOfTomorrow =
    new Date(dates.startOfTomorrow);

  const startOfWeek =
    new Date(dates.startOfWeek);

  const startOfNextWeek =
    new Date(dates.startOfNextWeek);

  const startOfMonth =
    new Date(dates.startOfMonth);

  const startOfNextMonth =
    new Date(dates.startOfNextMonth);

  const startOfYear =
    new Date(dates.startOfYear);

  const startOfNextYear =
    new Date(dates.startOfNextYear);

  // =======================================================
  // DATABASE
  // =======================================================

  const {
    sales,
    expenses,
    purchases,
    products,
  } = await getAdminAnalyticsData(
    business.businessId
  );

  // =======================================================
  // ALL-TIME FINANCIALS
  // =======================================================

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.totalAmount),
      0
    );

  const totalCost =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.totalCost),
      0
    );

  const grossProfit =
    totalRevenue - totalCost;

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(expense.amount),
      0
    );

  const netProfit =
    grossProfit - totalExpenses;

  const totalSales =
    sales.length;

  const averageSale =
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
  // PERIOD ANALYSIS
  // =======================================================

  function calculatePeriod(
    from: Date,
    to: Date
  ) {
    const periodSales =
      sales.filter(
        (sale) =>
          new Date(sale.soldAt) >=
            from &&
          new Date(sale.soldAt) < to
      );

    const periodExpenses =
      expenses.filter(
        (expense) =>
          new Date(
            expense.expenseDate
          ) >= from &&
          new Date(
            expense.expenseDate
          ) < to
      );

    const revenue =
      periodSales.reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.totalAmount
          ),
        0
      );

    const cost =
      periodSales.reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.totalCost
          ),
        0
      );

    const profit =
      revenue - cost;

    const expense =
      periodExpenses.reduce(
        (sum, item) =>
          sum +
          Number(item.amount),
        0
      );

    const net =
      profit - expense;

    return {
      revenue,
      cost,
      profit,
      expense,
      net,
      salesCount:
        periodSales.length,
      averageSale:
        periodSales.length > 0
          ? revenue /
            periodSales.length
          : 0,
      margin:
        revenue > 0
          ? (profit / revenue) *
            100
          : 0,
    };
  }

  const today =
    calculatePeriod(
      startOfToday,
      startOfTomorrow
    );

  const week =
    calculatePeriod(
      startOfWeek,
      startOfNextWeek
    );

  const month =
    calculatePeriod(
      startOfMonth,
      startOfNextMonth
    );

  const year =
    calculatePeriod(
      startOfYear,
      startOfNextYear
    );

  // =======================================================
  // PRODUCT SALES ANALYSIS
  // =======================================================

  const productSales =
    new Map<
      string,
      {
        id: string;
        name: string;
        quantity: number;
        revenue: number;
        cost: number;
        profit: number;
        category: string;
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

      const cost =
        Number(
          item.totalCost
        );

      const profit =
        Number(item.profit);

      if (existing) {
        existing.quantity +=
          quantity;

        existing.revenue +=
          revenue;

        existing.cost += cost;

        existing.profit +=
          profit;
      } else {
        productSales.set(
          item.productId,
          {
            id: item.productId,

            name:
              item.product.name,

            quantity,

            revenue,

            cost,

            profit,

            category:
              products.find(
                (product) =>
                  product.id ===
                  item.productId
              )?.category
                ?.name ??
              "Uncategorized",
          }
        );
      }
    }
  }

  const productPerformance =
    Array.from(
      productSales.values()
    );

  // =======================================================
  // BEST SELLING
  // =======================================================

  const bestSellingProducts =
    [...productPerformance]
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )
      .slice(0, 5);

  // =======================================================
  // MOST PROFITABLE
  // =======================================================

  const mostProfitableProducts =
    [...productPerformance]
      .sort(
        (a, b) =>
          b.profit -
          a.profit
      )
      .slice(0, 5);

  // =======================================================
  // LOW STOCK / OUT OF STOCK
  // =======================================================

  const outOfStockProducts =
    products.filter(
      (product) =>
        product.stock === 0
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 5
    );

  // =======================================================
  // INVENTORY ANALYSIS
  // =======================================================

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

  const potentialRevenue =
    products.reduce(
      (sum, product) =>
        sum +
        product.stock *
          Number(product.price),
      0
    );

  const potentialProfit =
    products.reduce(
      (sum, product) =>
        sum +
        product.stock *
          (Number(
            product.price
          ) -
            Number(
              product.costPrice
            )),
      0
    );

  // =======================================================
  // PURCHASE ANALYSIS
  // =======================================================

  const totalPurchaseCost =
    purchases.reduce(
      (sum, purchase) =>
        sum +
        Number(
          purchase.totalCost
        ),
      0
    );

  const totalPurchaseUnits =
    purchases.reduce(
      (sum, purchase) =>
        sum +
        purchase.items.reduce(
          (
            itemSum,
            item
          ) =>
            itemSum +
            item.quantity,
          0
        ),
      0
    );

  const purchaseProductMap =
    new Map<
      string,
      {
        id: string;
        name: string;
        quantity: number;
        totalCost: number;
        unitCost: number;
        supplier: string;
      }
    >();

  for (const purchase of purchases) {
    for (const item of purchase.items) {
      const existing =
        purchaseProductMap.get(
          item.productId
        );

      if (existing) {
        existing.quantity +=
          item.quantity;

        existing.totalCost +=
          Number(
            item.totalCost
          );
      } else {
        purchaseProductMap.set(
          item.productId,
          {
            id: item.productId,

            name:
              item.product.name,

            quantity:
              item.quantity,

            totalCost:
              Number(
                item.totalCost
              ),

            unitCost:
              Number(
                item.unitCost
              ),

            supplier:
              purchase.supplier ??
              "Unknown supplier",
          }
        );
      }
    }
  }

  const purchaseProducts =
    Array.from(
      purchaseProductMap.values()
    )
      .map((item) => ({
        ...item,

        averageCost:
          item.quantity > 0
            ? item.totalCost /
              item.quantity
            : 0,
      }))
      .sort(
        (a, b) =>
          b.totalCost -
          a.totalCost
      );

  // =======================================================
  // EXPENSE ANALYSIS
  // =======================================================

  const expenseMap =
    new Map<
      string,
      number
    >();

  for (const expense of expenses) {
    const existing =
      expenseMap.get(
        expense.title
      ) ?? 0;

    expenseMap.set(
      expense.title,
      existing +
        Number(
          expense.amount
        )
    );
  }

  const expenseBreakdown =
    Array.from(
      expenseMap.entries()
    )
      .map(
        ([title, amount]) => ({
          title,
          amount,
          percentage:
            percentage(
              amount,
              totalExpenses
            ),
        })
      )
      .sort(
        (a, b) =>
          b.amount -
          a.amount
      )
      .slice(0, 6);

  // =======================================================
  // CATEGORY PERFORMANCE
  // =======================================================

  const categoryMap =
    new Map<
      string,
      {
        revenue: number;
        profit: number;
        quantity: number;
      }
    >();

  for (const item of productPerformance) {
    const existing =
      categoryMap.get(
        item.category
      );

    if (existing) {
      existing.revenue +=
        item.revenue;

      existing.profit +=
        item.profit;

      existing.quantity +=
        item.quantity;
    } else {
      categoryMap.set(
        item.category,
        {
          revenue:
            item.revenue,

          profit:
            item.profit,

          quantity:
            item.quantity,
        }
      );
    }
  }

  const categoryPerformance =
    Array.from(
      categoryMap.entries()
    )
      .map(
        ([name, values]) => ({
          name,
          ...values,
        })
      )
      .sort(
        (a, b) =>
          b.revenue -
          a.revenue
      )
      .slice(0, 5);

  // =======================================================
  // TOP PRODUCT PROFITABILITY
  // =======================================================

  const highestMarginProducts =
    [...productPerformance]
      .map((product) => ({
        ...product,

        margin:
          product.revenue >
          0
            ? (product.profit /
                product.revenue) *
              100
            : 0,
      }))
      .sort(
        (a, b) =>
          b.margin -
          a.margin
      )
      .slice(0, 5);

  // =======================================================
  // RECENT PURCHASES
  // =======================================================

  const recentPurchases =
    purchases.slice(0, 5);

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
            Business intelligence
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Analytics
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-black/40">
            Deep analysis of your sales,
            profitability, inventory,
            purchasing and business
            performance.
          </p>
        </div>

        {/* =================================================
            MAIN CARDS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

          {/* REVENUE */}

          <div className="rounded-[24px] bg-[#222022] p-4 text-white sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
              Total revenue
            </p>

            <p className="mt-3 text-xl font-black sm:text-2xl">
              {formatCurrency(
                totalRevenue
              )}
            </p>

            <p className="mt-2 text-[10px] text-white/40 sm:text-xs">
              {totalSales} completed
              sales
            </p>
          </div>

          {/* GROSS PROFIT */}

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Gross profit
            </p>

            <p className="mt-3 text-xl font-black sm:text-2xl">
              {formatCurrency(
                grossProfit
              )}
            </p>

            <p className="mt-2 text-[10px] text-emerald-600 sm:text-xs">
              {grossMargin.toFixed(
                1
              )}
              % margin
            </p>
          </div>

          {/* EXPENSES */}

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Total expenses
            </p>

            <p className="mt-3 text-xl font-black sm:text-2xl">
              {formatCurrency(
                totalExpenses
              )}
            </p>

            <p className="mt-2 text-[10px] text-black/35 sm:text-xs">
              Operating costs
            </p>
          </div>

          {/* NET PROFIT */}

          <div className="rounded-[24px] bg-[#C3D809] p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
              Net profit
            </p>

            <p className="mt-3 text-xl font-black text-[#222022] sm:text-2xl">
              {formatCurrency(
                netProfit
              )}
            </p>

            <p className="mt-2 text-[10px] text-black/50 sm:text-xs">
              {netMargin.toFixed(
                1
              )}
              % net margin
            </p>
          </div>
        </div>

        {/* =================================================
            KEY BUSINESS METRICS
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Business intelligence
            </p>

            <h2 className="mt-1 text-lg font-black">
              Key performance metrics
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Average sale
              </p>

              <p className="mt-2 text-xl font-black">
                {formatCurrency(
                  averageSale
                )}
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Revenue per sale
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Gross margin
              </p>

              <p className="mt-2 text-xl font-black">
                {grossMargin.toFixed(
                  1
                )}
                %
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Before expenses
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Net margin
              </p>

              <p className="mt-2 text-xl font-black">
                {netMargin.toFixed(
                  1
                )}
                %
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                After expenses
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Inventory potential
              </p>

              <p className="mt-2 text-xl font-black">
                {formatCurrency(
                  potentialProfit
                )}
              </p>

              <p className="mt-1 text-[10px] text-black/30">
                Estimated profit
              </p>
            </div>

          </div>
        </section>

        {/* =================================================
            PERIOD PERFORMANCE
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Performance
            </p>

            <h2 className="mt-1 text-lg font-black">
              Period comparison
            </h2>

            <p className="mt-1 text-xs text-black/35">
              See how your business is
              performing across different
              periods.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

            {[
              {
                name: "Today",
                data: today,
              },
              {
                name: "This week",
                data: week,
              },
              {
                name: "This month",
                data: month,
              },
              {
                name: "This year",
                data: year,
              },
            ].map((period) => (
              <div
                key={period.name}
                className="rounded-2xl bg-[#F8F8F6] p-4"
              >
                <p className="text-xs font-bold text-black/40">
                  {period.name}
                </p>

                <p className="mt-3 text-lg font-black">
                  {formatCurrency(
                    period.data.net
                  )}
                </p>

                <p className="mt-1 text-[10px] text-black/35">
                  Net profit
                </p>

                <div className="mt-4 space-y-2 border-t border-black/[0.05] pt-3">

                  <div className="flex justify-between">
                    <span className="text-[10px] text-black/35">
                      Revenue
                    </span>

                    <span className="text-[10px] font-bold">
                      {formatCurrency(
                        period.data.revenue
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] text-black/35">
                      Expenses
                    </span>

                    <span className="text-[10px] font-bold">
                      {formatCurrency(
                        period.data.expense
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] text-black/35">
                      Sales
                    </span>

                    <span className="text-[10px] font-bold">
                      {period.data.salesCount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] text-black/35">
                      Margin
                    </span>

                    <span className="text-[10px] font-bold">
                      {period.data.margin.toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* =================================================
            PROFIT ANALYSIS
        ================================================= */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Profit analysis
              </p>

              <h2 className="mt-1 text-lg font-black">
                Where your money goes
              </h2>
            </div>

            <div className="space-y-4">

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-xs font-bold text-black/50">
                    Revenue
                  </span>

                  <span className="text-xs font-black">
                    {formatCurrency(
                      totalRevenue
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className="h-full rounded-full bg-[#222022]"
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-xs font-bold text-black/50">
                    Product cost
                  </span>

                  <span className="text-xs font-black">
                    {formatCurrency(
                      totalCost
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className="h-full rounded-full bg-[#999]"
                    style={{
                      width: `${Math.min(
                        percentage(
                          totalCost,
                          totalRevenue
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="text-xs font-bold text-black/50">
                    Operating expenses
                  </span>

                  <span className="text-xs font-black">
                    {formatCurrency(
                      totalExpenses
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className="h-full rounded-full bg-[#C3D809]"
                    style={{
                      width: `${Math.min(
                        percentage(
                          totalExpenses,
                          totalRevenue
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="border-t border-black/[0.05] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">
                    Net profit
                  </span>

                  <span className="text-lg font-black">
                    {formatCurrency(
                      netProfit
                    )}
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* EXPENSES */}

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Expense intelligence
              </p>

              <h2 className="mt-1 text-lg font-black">
                Largest expenses
              </h2>
            </div>

            {expenseBreakdown.length ===
            0 ? (
              <div className="rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
                <p className="text-sm font-bold text-black/40">
                  No expenses recorded
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenseBreakdown.map(
                  (expense) => (
                    <div
                      key={
                        expense.title
                      }
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="truncate text-xs font-bold">
                          {
                            expense.title
                          }
                        </p>

                        <p className="shrink-0 text-xs font-black">
                          {formatCurrency(
                            expense.amount
                          )}
                        </p>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                        <div
                          className="h-full rounded-full bg-[#C3D809]"
                          style={{
                            width: `${Math.min(
                              expense.percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-[9px] text-black/30">
                        {expense.percentage.toFixed(
                          1
                        )}
                        % of all expenses
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

          </section>
        </div>

        {/* =================================================
            BEST SELLING + MOST PROFITABLE
        ================================================= */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* BEST SELLING */}

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Sales intelligence
              </p>

              <h2 className="mt-1 text-lg font-black">
                Best-selling products
              </h2>

              <p className="mt-1 text-xs text-black/35">
                Products generating the
                highest sales volume.
              </p>
            </div>

            {bestSellingProducts.length ===
            0 ? (
              <div className="rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
                <p className="text-sm font-bold text-black/40">
                  No sales yet
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
                        product.id
                      }
                      className="flex items-center justify-between rounded-2xl bg-[#F8F8F6] p-3 sm:p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#222022] text-xs font-black text-[#C3D809]">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
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

                      <div className="ml-3 text-right">
                        <p className="text-xs font-black">
                          {formatCurrency(
                            product.revenue
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-emerald-600">
                          +
                          {formatCurrency(
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

          {/* MOST PROFITABLE */}

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Profit intelligence
              </p>

              <h2 className="mt-1 text-lg font-black">
                Most profitable products
              </h2>

              <p className="mt-1 text-xs text-black/35">
                Products creating the most
                actual profit.
              </p>
            </div>

            {mostProfitableProducts.length ===
            0 ? (
              <div className="rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
                <p className="text-sm font-bold text-black/40">
                  No product profit data
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mostProfitableProducts.map(
                  (
                    product,
                    index
                  ) => (
                    <div
                      key={
                        product.id
                      }
                      className="flex items-center justify-between rounded-2xl bg-[#F8F8F6] p-3 sm:p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C3D809] text-xs font-black text-[#222022]">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
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

                      <div className="ml-3 text-right">
                        <p className="text-xs font-black">
                          {formatCurrency(
                            product.profit
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-black/35">
                          Profit
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          </section>
        </div>

        {/* =================================================
            STOCK ANALYSIS
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Inventory intelligence
            </p>

            <h2 className="mt-1 text-lg font-black">
              Stock analysis
            </h2>

            <p className="mt-1 text-xs text-black/35">
              See exactly which products need
              attention instead of only seeing
              stock numbers.
            </p>
          </div>

          {/* INVENTORY SUMMARY */}

          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

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
                Potential profit
              </p>

              <p className="mt-2 text-xl font-black">
                {formatCurrency(
                  potentialProfit
                )}
              </p>
            </div>

          </div>

          {/* STOCK PROBLEMS */}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* OUT OF STOCK */}

            <div className="rounded-2xl border border-red-500/10 bg-red-50/50 p-4">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-red-600">
                    Out of stock
                  </p>

                  <p className="mt-1 text-[10px] text-red-600/50">
                    Products that cannot currently
                    be sold.
                  </p>
                </div>

                <div className="rounded-xl bg-red-100 px-3 py-2 text-xs font-black text-red-600">
                  {
                    outOfStockProducts.length
                  }
                </div>
              </div>

              {outOfStockProducts.length ===
              0 ? (
                <div className="rounded-xl bg-white/70 p-4">
                  <p className="text-xs font-bold text-black/40">
                    ✓ No products are out of
                    stock.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {outOfStockProducts.map(
                    (product) => (
                      <div
                        key={
                          product.id
                        }
                        className="flex items-center justify-between rounded-xl bg-white p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 text-[9px] text-black/35">
                            Selling price:{" "}
                            {formatCurrency(
                              Number(
                                product.price
                              )
                            )}
                          </p>
                        </div>

                        <span className="ml-3 shrink-0 rounded-lg bg-red-100 px-2 py-1 text-[9px] font-black text-red-600">
                          OUT
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}

            </div>

            {/* LOW STOCK */}

            <div className="rounded-2xl border border-amber-500/10 bg-amber-50/50 p-4">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-amber-700">
                    Low stock
                  </p>

                  <p className="mt-1 text-[10px] text-amber-700/50">
                    Products with 1–5 units
                    remaining.
                  </p>
                </div>

                <div className="rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-700">
                  {
                    lowStockProducts.length
                  }
                </div>
              </div>

              {lowStockProducts.length ===
              0 ? (
                <div className="rounded-xl bg-white/70 p-4">
                  <p className="text-xs font-bold text-black/40">
                    ✓ No products have low
                    stock.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.map(
                    (product) => (
                      <div
                        key={
                          product.id
                        }
                        className="flex items-center justify-between rounded-xl bg-white p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 text-[9px] text-black/35">
                            Price:{" "}
                            {formatCurrency(
                              Number(
                                product.price
                              )
                            )}{" "}
                            · Cost:{" "}
                            {formatCurrency(
                              Number(
                                product.costPrice
                              )
                            )}
                          </p>
                        </div>

                        <span className="ml-3 shrink-0 rounded-lg bg-amber-100 px-2 py-1 text-[9px] font-black text-amber-700">
                          {
                            product.stock
                          }{" "}
                          LEFT
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}

            </div>

          </div>

          {/* ALL PRODUCTS STOCK TABLE */}

          <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.05]">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="bg-[#F8F8F6] text-left">
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Product
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Selling price
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Cost price
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Value
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(
                    (product) => {
                      const value =
                        product.stock *
                        Number(
                          product.costPrice
                        );

                      const status =
                        product.stock ===
                        0
                          ? "Out"
                          : product.stock <=
                            5
                          ? "Low"
                          : "Healthy";

                      return (
                        <tr
                          key={
                            product.id
                          }
                          className="border-t border-black/[0.05]"
                        >

                          <td className="px-4 py-3">
                            <p className="text-xs font-bold">
                              {
                                product.name
                              }
                            </p>

                            <p className="mt-1 text-[9px] text-black/30">
                              {
                                product.category
                                  ?.name ??
                                "No category"
                              }
                            </p>
                          </td>

                          <td className="px-4 py-3 text-xs font-bold">
                            {formatCurrency(
                              Number(
                                product.price
                              )
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs font-bold">
                            {formatCurrency(
                              Number(
                                product.costPrice
                              )
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs font-black">
                            {
                              product.stock
                            }
                          </td>

                          <td className="px-4 py-3 text-xs font-bold">
                            {formatCurrency(
                              value
                            )}
                          </td>

                          <td className="px-4 py-3">

                            <span
                              className={`rounded-lg px-2 py-1 text-[9px] font-black ${
                                status ===
                                "Out"
                                  ? "bg-red-100 text-red-600"
                                  : status ===
                                    "Low"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {status}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </section>

        {/* =================================================
            PURCHASE EFFICIENCY
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Purchasing intelligence
            </p>

            <h2 className="mt-1 text-lg font-black">
              Purchase efficiency
            </h2>

            <p className="mt-1 max-w-2xl text-xs text-black/35">
              Understand exactly what you are
              buying, how much you spend on each
              product and where your inventory
              investment is going.
            </p>
          </div>

          {/* PURCHASE SUMMARY */}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Purchase orders
              </p>

              <p className="mt-2 text-xl font-black">
                {
                  purchases.length
                }
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Products purchased
              </p>

              <p className="mt-2 text-xl font-black">
                {
                  purchaseProducts.length
                }
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8F8F6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                Units purchased
              </p>

              <p className="mt-2 text-xl font-black">
                {
                  totalPurchaseUnits
                }
              </p>
            </div>

            <div className="rounded-2xl bg-[#C3D809] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/45">
                Total investment
              </p>

              <p className="mt-2 text-xl font-black text-[#222022]">
                {formatCurrency(
                  totalPurchaseCost
                )}
              </p>
            </div>

          </div>

          {/* PURCHASE PRODUCTS */}

          <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.05]">

            <div className="border-b border-black/[0.05] bg-[#F8F8F6] px-4 py-3">
              <p className="text-xs font-black">
                Purchased product analysis
              </p>

              <p className="mt-1 text-[9px] text-black/35">
                Products ranked by total purchasing
                investment.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">

                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Product
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Supplier
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Unit cost
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Total cost
                    </th>

                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-black/30">
                      Current stock
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {purchaseProducts.map(
                    (item) => {
                      const currentProduct =
                        products.find(
                          (
                            product
                          ) =>
                            product.id ===
                            item.id
                        );

                      return (
                        <tr
                          key={
                            item.id
                          }
                          className="border-t border-black/[0.05]"
                        >

                          <td className="px-4 py-4">
                            <p className="text-xs font-bold">
                              {
                                item.name
                              }
                            </p>

                            <p className="mt-1 text-[9px] text-black/30">
                              Average cost
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-xs font-bold">
                              {
                                item.supplier
                              }
                            </p>
                          </td>

                          <td className="px-4 py-4 text-xs font-black">
                            {
                              item.quantity
                            }
                          </td>

                          <td className="px-4 py-4 text-xs font-bold">
                            {formatCurrency(
                              item.averageCost
                            )}
                          </td>

                          <td className="px-4 py-4 text-xs font-black">
                            {formatCurrency(
                              item.totalCost
                            )}
                          </td>

                          <td className="px-4 py-4">

                            <span
                              className={`rounded-lg px-2 py-1 text-[9px] font-black ${
                                !currentProduct ||
                                currentProduct.stock ===
                                  0
                                  ? "bg-red-100 text-red-600"
                                  : currentProduct.stock <=
                                    5
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {currentProduct
                                ?.stock ??
                                0}{" "}
                              units
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}
                </tbody>

              </table>
            </div>
          </div>

          {purchaseProducts.length ===
            0 && (
            <div className="mt-5 rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
              <p className="text-sm font-bold text-black/40">
                No purchases recorded
              </p>

              <p className="mt-1 text-xs text-black/25">
                Purchase analysis will appear
                here after you add purchases.
              </p>
            </div>
          )}

        </section>

        {/* =================================================
            CATEGORY PERFORMANCE
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Category intelligence
            </p>

            <h2 className="mt-1 text-lg font-black">
              Category performance
            </h2>
          </div>

          {categoryPerformance.length ===
          0 ? (
            <div className="rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
              <p className="text-sm font-bold text-black/40">
                No category sales yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              {categoryPerformance.map(
                (category) => (
                  <div
                    key={
                      category.name
                    }
                    className="rounded-2xl bg-[#F8F8F6] p-4"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <div>
                        <p className="text-sm font-black">
                          {
                            category.name
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-black/35">
                          {
                            category.quantity
                          }{" "}
                          units sold
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black">
                          {formatCurrency(
                            category.revenue
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-emerald-600">
                          +
                          {formatCurrency(
                            category.profit
                          )}{" "}
                          profit
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/[0.05]">
                      <div
                        className="h-full rounded-full bg-[#C3D809]"
                        style={{
                          width: `${Math.min(
                            percentage(
                              category.revenue,
                              totalRevenue
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[9px] text-black/30">
                      {percentage(
                        category.revenue,
                        totalRevenue
                      ).toFixed(
                        1
                      )}
                      % of total revenue
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =================================================
            HIGHEST MARGIN PRODUCTS
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Pricing intelligence
            </p>

            <h2 className="mt-1 text-lg font-black">
              Highest-margin products
            </h2>

            <p className="mt-1 text-xs text-black/35">
              Products that keep the largest
              percentage of their selling price
              as gross profit.
            </p>
          </div>

          {highestMarginProducts.length ===
          0 ? (
            <div className="rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
              <p className="text-sm font-bold text-black/40">
                No margin data available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">

              {highestMarginProducts.map(
                (product) => (
                  <div
                    key={
                      product.id
                    }
                    className="rounded-2xl bg-[#F8F8F6] p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {
                            product.name
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-black/35">
                          Selling price{" "}
                          {formatCurrency(
                            product.revenue /
                              product.quantity
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-xl bg-[#C3D809] px-3 py-2">
                        <p className="text-xs font-black">
                          {product.margin.toFixed(
                            1
                          )}
                          %
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 flex justify-between border-t border-black/[0.05] pt-3">

                      <div>
                        <p className="text-[9px] text-black/30">
                          Revenue
                        </p>

                        <p className="mt-1 text-xs font-black">
                          {formatCurrency(
                            product.revenue
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] text-black/30">
                          Profit
                        </p>

                        <p className="mt-1 text-xs font-black text-emerald-600">
                          {formatCurrency(
                            product.profit
                          )}
                        </p>
                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =================================================
            RECENT PURCHASES
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Purchasing activity
            </p>

            <h2 className="mt-1 text-lg font-black">
              Recent purchases
            </h2>
          </div>

          {recentPurchases.length ===
          0 ? (
            <div className="rounded-2xl bg-[#F8F8F6] px-5 py-10 text-center">
              <p className="text-sm font-bold text-black/40">
                No purchases yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">

              {recentPurchases.map(
                (purchase) => (
                  <div
                    key={
                      purchase.id
                    }
                    className="flex items-center justify-between rounded-2xl bg-[#F8F8F6] p-4"
                  >

                    <div className="min-w-0">

                      <p className="text-sm font-bold">
                        {purchase.supplier ??
                          "Unknown supplier"}
                      </p>

                      <p className="mt-1 text-[10px] text-black/35">
                        {
                          purchase.items
                            .length
                        }{" "}
                        products ·{" "}
                        {new Date(
                          purchase.purchasedAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month:
                              "short",
                            day: "numeric",
                            year:
                              "numeric",
                          }
                        )}
                      </p>

                    </div>

                    <div className="ml-3 shrink-0 text-right">

                      <p className="text-sm font-black">
                        {formatCurrency(
                          Number(
                            purchase.totalCost
                          )
                        )}
                      </p>

                      <p className="mt-1 text-[9px] text-black/30">
                        Purchase cost
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =================================================
            FINAL BUSINESS INSIGHT
        ================================================= */}

        <section className="mt-5 rounded-[24px] bg-[#222022] p-5 text-white sm:p-6">

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
            Business snapshot
          </p>

          <h2 className="mt-2 text-xl font-black">
            Your business at a glance
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/30">
                Revenue
              </p>

              <p className="mt-1 text-sm font-black">
                {formatCurrency(
                  totalRevenue
                )}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/30">
                Net profit
              </p>

              <p className="mt-1 text-sm font-black text-[#C3D809]">
                {formatCurrency(
                  netProfit
                )}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/30">
                Inventory value
              </p>

              <p className="mt-1 text-sm font-black">
                {formatCurrency(
                  stockValue
                )}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/30">
                Potential revenue
              </p>

              <p className="mt-1 text-sm font-black">
                {formatCurrency(
                  potentialRevenue
                )}
              </p>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}