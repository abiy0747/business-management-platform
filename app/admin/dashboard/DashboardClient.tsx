"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  Package,
  Receipt,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period =
  | "today"
  | "tomorrow"
  | "week"
  | "month"
  | "year";

type ChartItem = {
  label: string;
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  expenses: number;
  netProfit: number;
};

type DashboardData = {
  stats: {
    todayRevenue: number;
    todayCost: number;
    todayProfit: number;
    todayExpenses: number;
    todayNetProfit: number;
    todaySalesCount: number;
    todayProfitMargin: number;

    tomorrowRevenue: number;
    tomorrowCost: number;
    tomorrowProfit: number;
    tomorrowExpenses: number;
    tomorrowNetProfit: number;
    tomorrowSalesCount: number;

    weekRevenue: number;
    weekCost: number;
    weekProfit: number;
    weekExpenses: number;
    weekNetProfit: number;
    weekProfitMargin: number;
    weekSalesCount: number;

    monthRevenue: number;
    monthCost: number;
    monthProfit: number;
    monthExpenses: number;
    monthNetProfit: number;
    monthProfitMargin: number;
    monthSalesCount: number;

    yearRevenue: number;
    yearCost: number;
    yearProfit: number;
    yearExpenses: number;
    yearNetProfit: number;
    yearProfitMargin: number;
    yearSalesCount: number;

    productCount: number;
    lowStockCount: number;
  };

  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    category?: {
      name: string;
    } | null;
  }>;

  recentProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: unknown;
    category?: {
      name: string;
    } | null;
  }>;

  recentSales: Array<{
    id: string;
    totalAmount: unknown;
    profit: unknown;
    soldAt: string | Date;
    items: Array<{
      id: string;
      quantity: number;
      product: {
        name: string;
      };
    }>;
  }>;

  charts: {
    weekly: ChartItem[];
    monthly: ChartItem[];
    yearly: ChartItem[];
  };
};

type Props = {
  data: DashboardData;
};

const periods: Array<{
  id: Period;
  label: string;
}> = [
  {
    id: "today",
    label: "Today",
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
  },
  {
    id: "week",
    label: "Week",
  },
  {
    id: "month",
    label: "Month",
  },
  {
    id: "year",
    label: "Year",
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function numberValue(value: unknown) {
  return Number(value ?? 0);
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatChartValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return `${Math.round(value)}`;
}

export default function DashboardClient({
  data,
}: Props) {
  const [period, setPeriod] =
    useState<Period>("today");

  // =========================================================
  // CURRENT PERIOD STATS
  // =========================================================

  const currentStats = useMemo(() => {
    switch (period) {
      case "tomorrow":
        return {
          revenue: data.stats.tomorrowRevenue,
          cost: data.stats.tomorrowCost,
          profit: data.stats.tomorrowProfit,
          expenses: data.stats.tomorrowExpenses,
          netProfit: data.stats.tomorrowNetProfit,
          salesCount:
            data.stats.tomorrowSalesCount,
          margin: 0,
        };

      case "week":
        return {
          revenue: data.stats.weekRevenue,
          cost: data.stats.weekCost,
          profit: data.stats.weekProfit,
          expenses: data.stats.weekExpenses,
          netProfit: data.stats.weekNetProfit,
          salesCount:
            data.stats.weekSalesCount,
          margin:
            data.stats.weekProfitMargin,
        };

      case "month":
        return {
          revenue: data.stats.monthRevenue,
          cost: data.stats.monthCost,
          profit: data.stats.monthProfit,
          expenses: data.stats.monthExpenses,
          netProfit: data.stats.monthNetProfit,
          salesCount:
            data.stats.monthSalesCount,
          margin:
            data.stats.monthProfitMargin,
        };

      case "year":
        return {
          revenue: data.stats.yearRevenue,
          cost: data.stats.yearCost,
          profit: data.stats.yearProfit,
          expenses: data.stats.yearExpenses,
          netProfit: data.stats.yearNetProfit,
          salesCount:
            data.stats.yearSalesCount,
          margin:
            data.stats.yearProfitMargin,
        };

      default:
        return {
          revenue: data.stats.todayRevenue,
          cost: data.stats.todayCost,
          profit: data.stats.todayProfit,
          expenses: data.stats.todayExpenses,
          netProfit: data.stats.todayNetProfit,
          salesCount:
            data.stats.todaySalesCount,
          margin:
            data.stats.todayProfitMargin,
        };
    }
  }, [period, data]);

  // =========================================================
  // GRAPH DATA
  // =========================================================

  const chartData = useMemo(() => {
    if (period === "week") {
      return data.charts.weekly;
    }

    if (period === "month") {
      return data.charts.monthly;
    }

    if (period === "year") {
      return data.charts.yearly;
    }

    return [];
  }, [period, data]);

  // =========================================================
  // PIE DATA
  // =========================================================

  const pieData = useMemo(() => {
    return [
      {
        name: "Profit",
        value: Math.max(
          currentStats.profit,
          0
        ),
      },
      {
        name: "Cost",
        value: Math.max(
          currentStats.cost,
          0
        ),
      },
      {
        name: "Expenses",
        value: Math.max(
          currentStats.expenses,
          0
        ),
      },
    ].filter((item) => item.value > 0);
  }, [currentStats]);

  // =========================================================
  // TOTAL PIE VALUE
  // =========================================================

  const pieTotal = pieData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // =========================================================
  // PERIOD TITLE
  // =========================================================

  const periodTitle = {
    today: "Today's performance",
    tomorrow: "Tomorrow's performance",
    week: "This week's performance",
    month: "This month's performance",
    year: "This year's performance",
  }[period];

  return (
    <div className="px-4 pb-28 pt-6 sm:px-7 lg:px-10 lg:pb-10">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-[#C3D809]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/35">
              Business overview
            </p>

          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Good morning, Mulat.
          </h1>

          <p className="mt-1 text-sm text-black/40">
            Here&apos;s how your business is performing.
          </p>

        </div>

        {/* Date */}

        <div className="flex items-center gap-2 self-start rounded-2xl border border-black/[0.06] bg-white px-4 py-3 lg:self-auto">

          <CalendarDays
            size={16}
            className="text-black/40"
          />

          <span className="text-xs font-semibold">
            {new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </span>

        </div>

      </div>

      {/* =====================================================
          PERIOD NAVIGATION
      ===================================================== */}

      <div className="mb-7 overflow-x-auto">

        <div className="flex min-w-max rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-sm">

          {periods.map((item) => {

            const active =
              period === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setPeriod(item.id)
                }
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-[#222022] text-white shadow-sm"
                    : "text-black/40 hover:bg-black/[0.04] hover:text-black"
                }`}
              >
                {item.label}
              </button>
            );

          })}

        </div>

      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

        {/* Revenue */}

        <StatCard
          title="Revenue"
          value={currentStats.revenue}
          icon={CircleDollarSign}
          description={periodTitle}
          positive
        />

        {/* Profit */}

        <StatCard
          title="Profit"
          value={currentStats.profit}
          icon={TrendingUp}
          description={`${currentStats.margin.toFixed(1)}% margin`}
          positive
        />

        {/* Expenses */}

        <StatCard
          title="Expenses"
          value={currentStats.expenses}
          icon={WalletCards}
          description="Operating expenses"
        />

        {/* Net Profit */}

        <StatCard
          title="Net Profit"
          value={currentStats.netProfit}
          icon={Activity}
          description={`${currentStats.salesCount} sales`}
          positive={
            currentStats.netProfit >= 0
          }
        />

      </div>

      {/* =====================================================
          MAIN ANALYTICS
      ===================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">

        {/* ===================================================
            GRAPH
        =================================================== */}

        <section className="rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                Financial analysis
              </p>

              <h2 className="mt-1 text-lg font-black">
                Revenue & profit
              </h2>

            </div>

            <div className="flex flex-wrap gap-4 text-[10px] font-semibold text-black/45">

              <Legend
                label="Revenue"
                className="bg-[#222022]"
              />

              <Legend
                label="Profit"
                className="bg-[#C3D809]"
              />

              <Legend
                label="Expenses"
                className="bg-black/25"
              />

            </div>

          </div>

          {chartData.length > 0 ? (

            <div className="h-[320px] w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    strokeOpacity={0.08}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: "#222022",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={18}
                  />

                  <YAxis
                    tickFormatter={
                      formatChartValue
                    }
                    tick={{
                      fontSize: 10,
                      fill: "#222022",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow:
                        "0 12px 40px rgba(0,0,0,0.08)",
                    }}
                    formatter={(
                      value,
                      name
                    ) => [
                      money(
                        Number(value ?? 0)
                      ),
                      String(name),
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#222022"
                    fill="#222022"
                    fillOpacity={0.08}
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#C3D809"
                    fill="#C3D809"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#999999"
                    fill="#999999"
                    fillOpacity={0.06}
                    strokeWidth={2}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[#F6F6F3]">

              <div className="text-center">

                <Activity
                  size={28}
                  className="mx-auto mb-3 text-black/20"
                />

                <p className="text-sm font-bold text-black/45">
                  No chart data yet
                </p>

                <p className="mt-1 text-xs text-black/30">
                  Sales data will appear here.
                </p>

              </div>

            </div>

          )}

        </section>

        {/* ===================================================
            PIE CHART
        =================================================== */}

        <section className="rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-2">

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
              Breakdown
            </p>

            <h2 className="mt-1 text-lg font-black">
              Profit analysis
            </h2>

          </div>

          {pieData.length > 0 ? (

            <>

              <div className="relative mx-auto h-[245px] w-full max-w-[300px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={0}
                    >

                      {pieData.map(
                        (entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={
                              index === 0
                                ? "#C3D809"
                                : index === 1
                                  ? "#222022"
                                  : "#999999"
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(
                        value,
                        name
                      ) => [
                        money(
                          Number(value ?? 0)
                        ),
                        String(name),
                      ]}
                    />

                  </PieChart>

                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30">
                    Total
                  </span>

                  <span className="mt-1 text-lg font-black">
                    {money(pieTotal)}
                  </span>

                </div>

              </div>

              <div className="space-y-3">

                {pieData.map(
                  (item, index) => {

                    const percentage =
                      pieTotal > 0
                        ? (item.value /
                            pieTotal) *
                          100
                        : 0;

                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >

                        <div className="flex items-center gap-2.5">

                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background:
                                index === 0
                                  ? "#C3D809"
                                  : index === 1
                                    ? "#222022"
                                    : "#999999",
                            }}
                          />

                          <span className="text-xs font-semibold">
                            {item.name}
                          </span>

                        </div>

                        <div className="text-right">

                          <p className="text-xs font-black">
                            {money(item.value)}
                          </p>

                          <p className="text-[9px] text-black/30">
                            {percentage.toFixed(
                              1
                            )}
                            %
                          </p>

                        </div>

                      </div>
                    );

                  }
                )}

              </div>

            </>

          ) : (

            <div className="flex h-[330px] items-center justify-center">

              <div className="text-center">

                <CircleDollarSign
                  size={30}
                  className="mx-auto mb-3 text-black/15"
                />

                <p className="text-sm font-bold text-black/40">
                  No financial data
                </p>

                <p className="mt-1 text-xs text-black/25">
                  Add sales or expenses to see
                  the breakdown.
                </p>

              </div>

            </div>

          )}

        </section>

      </div>

      {/* =====================================================
          SECONDARY STATS
      ===================================================== */}

      <div className="mt-5 grid gap-5 lg:grid-cols-3">

        {/* Cost */}

        <div className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                Product cost
              </p>

              <h3 className="mt-1 text-base font-black">
                Cost of goods
              </h3>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04]">

              <Package
                size={18}
                className="text-black/50"
              />

            </div>

          </div>

          <p className="text-2xl font-black">
            {money(currentStats.cost)}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/[0.05]">

            <div
              className="h-full rounded-full bg-[#222022]"
              style={{
                width: `${
                  currentStats.revenue > 0
                    ? Math.min(
                        (currentStats.cost /
                          currentStats.revenue) *
                          100,
                        100
                      )
                    : 0
                }%`,
              }}
            />

          </div>

        </div>

        {/* Sales */}

        <div className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                Transactions
              </p>

              <h3 className="mt-1 text-base font-black">
                Sales completed
              </h3>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C3D809]/20">

              <Receipt
                size={18}
                className="text-[#222022]"
              />

            </div>

          </div>

          <p className="text-2xl font-black">
            {currentStats.salesCount}
          </p>

          <p className="mt-2 text-xs text-black/35">
            Transactions during{" "}
            {period}.
          </p>

        </div>

        {/* Margin */}

        <div className="rounded-[26px] border border-black/[0.06] bg-[#222022] p-5 text-white shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Profitability
              </p>

              <h3 className="mt-1 text-base font-black">
                Profit margin
              </h3>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C3D809] text-[#222022]">

              <TrendingUp size={18} />

            </div>

          </div>

          <p className="text-2xl font-black">
            {currentStats.margin.toFixed(1)}%
          </p>

          <p className="mt-2 text-xs text-white/35">
            Gross profit margin for{" "}
            {period}.
          </p>

        </div>

      </div>

      {/* =====================================================
          LOWER CONTENT
      ===================================================== */}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">

        {/* LOW STOCK */}

        <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                Inventory
              </p>

              <h2 className="mt-1 text-lg font-black">
                Low stock
              </h2>

            </div>

            <div className="rounded-xl bg-red-50 px-3 py-2 text-[10px] font-black text-red-500">

              {data.lowStockProducts.length} items

            </div>

          </div>

          {data.lowStockProducts.length > 0 ? (

            <div className="space-y-2">

              {data.lowStockProducts.map(
                (product) => (

                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl bg-[#F6F6F3] px-4 py-3"
                  >

                    <div className="min-w-0">

                      <p className="truncate text-xs font-bold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[9px] text-black/30">
                        {product.category?.name ??
                          "Uncategorized"}
                      </p>

                    </div>

                    <div className="ml-3 shrink-0 text-right">

                      <p className="text-xs font-black text-red-500">
                        {product.stock}
                      </p>

                      <p className="text-[8px] text-black/30">
                        remaining
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptyState
              icon={Boxes}
              text="Inventory is healthy"
            />

          )}

        </section>

        {/* RECENT SALES */}

        <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-black">
                Recent sales
              </h2>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.04]">

              <Receipt
                size={16}
                className="text-black/45"
              />

            </div>

          </div>

          {data.recentSales.length > 0 ? (

            <div className="space-y-2">

              {data.recentSales.map(
                (sale) => {

                  const amount =
                    numberValue(
                      sale.totalAmount
                    );

                  const profit =
                    numberValue(
                      sale.profit
                    );

                  const itemCount =
                    sale.items.reduce(
                      (
                        sum,
                        item
                      ) =>
                        sum +
                        item.quantity,
                      0
                    );

                  return (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between rounded-2xl bg-[#F6F6F3] px-4 py-3"
                    >

                      <div className="min-w-0">

                        <p className="text-xs font-bold">
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </p>

                        <p className="mt-1 text-[9px] text-black/30">
                          {formatDate(
                            sale.soldAt
                          )}
                        </p>

                      </div>

                      <div className="ml-3 text-right">

                        <p className="text-xs font-black">
                          {money(amount)}
                        </p>

                        <p className="mt-1 text-[9px] text-[#5d7600]">
                          +{money(profit)} profit
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <EmptyState
              icon={Receipt}
              text="No sales yet"
            />

          )}

        </section>

      </div>

      {/* =====================================================
          INVENTORY SUMMARY
      ===================================================== */}

      <div className="mt-5 rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3D809]">

              <Boxes
                size={21}
                className="text-[#222022]"
              />

            </div>

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                Inventory overview
              </p>

              <p className="mt-1 text-sm font-black">
                {data.stats.productCount} products
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">

            <MiniMetric
              label="Products"
              value={data.stats.productCount}
            />

            <MiniMetric
              label="Low stock"
              value={data.stats.lowStockCount}
            />

            <MiniMetric
              label="Sales"
              value={data.stats.todaySalesCount}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  positive,
}: {
  title: string;
  value: number;
  icon: typeof CircleDollarSign;
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F6F6F3]">

          <Icon
            size={17}
            className="text-black/50"
          />

        </div>

        {positive !== undefined && (
          <div
            className={`flex items-center gap-1 text-[9px] font-bold ${
              positive
                ? "text-[#5d7600]"
                : "text-red-500"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}

            {positive
              ? "Positive"
              : "Negative"}
          </div>
        )}

      </div>

      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30">
        {title}
      </p>

      <p className="mt-1 truncate text-xl font-black sm:text-2xl">
        {money(value)}
      </p>

      <p className="mt-1 truncate text-[9px] text-black/30">
        {description}
      </p>

    </div>
  );
}

// =========================================================
// LEGEND
// =========================================================

function Legend({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span className="flex items-center gap-1.5">

      <span
        className={`h-2 w-2 rounded-full ${className}`}
      />

      {label}

    </span>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: typeof Boxes;
  text: string;
}) {
  return (
    <div className="flex min-h-[150px] items-center justify-center rounded-2xl bg-[#F6F6F3]">

      <div className="text-center">

        <Icon
          size={25}
          className="mx-auto mb-2 text-black/15"
        />

        <p className="text-xs font-bold text-black/35">
          {text}
        </p>

      </div>

    </div>
  );
}

// =========================================================
// MINI METRIC
// =========================================================

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-black/25">
        {label}
      </p>

      <p className="mt-1 text-sm font-black">
        {value}
      </p>

    </div>
  );
}