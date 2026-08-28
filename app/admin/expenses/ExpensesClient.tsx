
"use client";

import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Plus,
  Receipt,
  Trash2,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

type Expense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
};

type ExpensesClientProps = {
  initialExpenses: Expense[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

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

function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function ExpensesClient({
  initialExpenses,
}: ExpensesClientProps) {
  const [expenses, setExpenses] =
    useState<Expense[]>(initialExpenses);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // =========================================================
  // DATE REFERENCES
  // =========================================================

  const today = useMemo(
    () => startOfDay(),
    [expenses]
  );

  const yesterday = useMemo(() => {
    const date = startOfDay();

    date.setDate(date.getDate() - 1);

    return date;
  }, [expenses]);

  const weekStart = useMemo(
    () => startOfWeek(),
    [expenses]
  );

  const monthStart = useMemo(
    () => startOfMonth(),
    [expenses]
  );

  const yearStart = useMemo(
    () => startOfYear(),
    [expenses]
  );

  // =========================================================
  // TOTAL EXPENSES
  // =========================================================

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }, [expenses]);

  // =========================================================
  // TODAY
  // =========================================================

  const todayData = useMemo(() => {
    const filtered = expenses.filter((expense) =>
      isSameDay(
        new Date(expense.expenseDate),
        today
      )
    );

    return {
      amount: filtered.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
      count: filtered.length,
    };
  }, [expenses, today]);

  // =========================================================
  // YESTERDAY
  // =========================================================

  const yesterdayData = useMemo(() => {
    const filtered = expenses.filter((expense) =>
      isSameDay(
        new Date(expense.expenseDate),
        yesterday
      )
    );

    return {
      amount: filtered.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
      count: filtered.length,
    };
  }, [expenses, yesterday]);

  // =========================================================
  // THIS WEEK
  // =========================================================

  const weekData = useMemo(() => {
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.expenseDate) >= weekStart
    );

    return {
      amount: filtered.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
      count: filtered.length,
    };
  }, [expenses, weekStart]);

  // =========================================================
  // THIS MONTH
  // =========================================================

  const monthData = useMemo(() => {
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.expenseDate) >= monthStart
    );

    return {
      amount: filtered.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
      count: filtered.length,
    };
  }, [expenses, monthStart]);

  // =========================================================
  // THIS YEAR
  // =========================================================

  const yearData = useMemo(() => {
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.expenseDate) >= yearStart
    );

    return {
      amount: filtered.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
      count: filtered.length,
    };
  }, [expenses, yearStart]);

  // =========================================================
  // AVERAGE EXPENSE
  // =========================================================

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) {
      return 0;
    }

    return totalExpenses / expenses.length;
  }, [expenses.length, totalExpenses]);

  // =========================================================
  // LARGEST EXPENSE
  // =========================================================

  const largestExpense = useMemo(() => {
    if (expenses.length === 0) {
      return null;
    }

    return [...expenses].sort(
      (a, b) => b.amount - a.amount
    )[0];
  }, [expenses]);

  // =========================================================
  // CREATE EXPENSE
  // =========================================================

  async function createExpense() {
    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Expense title is required.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid expense amount greater than zero."
      );
      return;
    }

    if (!expenseDate) {
      setError("Expense date is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/expenses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim() || null,
            amount: numericAmount,
            expenseDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create expense."
        );
      }

      const newExpense: Expense = {
        id: data.expense.id,
        title: data.expense.title,
        description:
          data.expense.description,
        amount: Number(
          data.expense.amount
        ),
        expenseDate:
          data.expense.expenseDate,
        createdAt:
          data.expense.createdAt,
        updatedAt:
          data.expense.createdAt,
      };

      setExpenses((current) => [
        newExpense,
        ...current,
      ]);

      setTitle("");
      setDescription("");
      setAmount("");

      setExpenseDate(
        new Date()
          .toISOString()
          .split("T")[0]
      );

      setShowForm(false);

      setMessage(
        "Expense added successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // =========================================================
  // DELETE EXPENSE
  // =========================================================

  async function deleteExpense(
    expenseId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete expense."
        );
      }

      setExpenses((current) =>
        current.filter(
          (expense) =>
            expense.id !== expenseId
        )
      );

      setMessage(
        "Expense deleted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete expense."
      );
    }
  }

  // =========================================================
  // PERIOD DATA
  // =========================================================

  const periodData = [
    {
      label: "Today",
      amount: todayData.amount,
      count: todayData.count,
    },
    {
      label: "Yesterday",
      amount: yesterdayData.amount,
      count: yesterdayData.count,
    },
    {
      label: "This Week",
      amount: weekData.amount,
      count: weekData.count,
    },
    {
      label: "This Month",
      amount: monthData.amount,
      count: monthData.count,
    },
    {
      label: "This Year",
      amount: yearData.amount,
      count: yearData.count,
    },
  ];

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
              Financial management
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Expenses
            </h1>

            <p className="mt-1 text-sm text-black/40">
              Track and understand where your
              business money goes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(
                (current) => !current
              );

              setError("");
              setMessage("");
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#222022] px-5 text-sm font-bold text-white transition hover:bg-black"
          >
            <Plus size={17} />
            Add Expense
          </button>
        </div>

        {/* ===================================================
            MESSAGES
        =================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X
              size={17}
              className="mt-0.5 shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Check
              size={17}
              className="mt-0.5 shrink-0"
            />

            <p>{message}</p>
          </div>
        )}

        {/* ===================================================
            MAIN SUMMARY CARDS
        =================================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4">

          {/* TOTAL */}

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/30 sm:text-[9px] sm:tracking-[0.18em]">
                  Total expenses
                </p>

                <p className="mt-2 text-lg font-black sm:text-2xl">
                  {formatCurrency(
                    totalExpenses
                  )}
                </p>

                <p className="mt-1 text-[9px] text-black/30 sm:text-xs">
                  {expenses.length}{" "}
                  transactions
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-[#C3D809]/20 sm:flex">
                <CircleDollarSign
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* AVERAGE */}

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/30 sm:text-[9px] sm:tracking-[0.18em]">
                  Average expense
                </p>

                <p className="mt-2 text-lg font-black sm:text-2xl">
                  {formatCurrency(
                    averageExpense
                  )}
                </p>

                <p className="mt-1 text-[9px] text-black/30 sm:text-xs">
                  Per transaction
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] sm:flex">
                <Receipt size={20} />
              </div>
            </div>
          </div>

          {/* THIS MONTH */}

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/30 sm:text-[9px] sm:tracking-[0.18em]">
                  This month
                </p>

                <p className="mt-2 text-lg font-black sm:text-2xl">
                  {formatCurrency(
                    monthData.amount
                  )}
                </p>

                <p className="mt-1 text-[9px] text-black/30 sm:text-xs">
                  {monthData.count}{" "}
                  transactions
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.05] sm:flex">
                <CalendarDays
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* LARGEST */}

          <div className="rounded-[24px] bg-[#C3D809] p-4 sm:p-5">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/45 sm:text-[9px] sm:tracking-[0.18em]">
                Largest expense
              </p>

              {largestExpense ? (
                <>
                  <p className="mt-2 truncate text-lg font-black text-[#222022] sm:text-2xl">
                    {formatCurrency(
                      largestExpense.amount
                    )}
                  </p>

                  <p className="mt-1 truncate text-[9px] font-semibold text-black/45 sm:text-xs">
                    {largestExpense.title}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-lg font-black text-[#222022] sm:text-2xl">
                    0.00
                  </p>

                  <p className="mt-1 text-[9px] text-black/45 sm:text-xs">
                    No expenses yet
                  </p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* ===================================================
            EXPENSE PERIOD OVERVIEW
        =================================================== */}

        <section className="mb-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
              Expense overview
            </p>

            <h2 className="mt-1 text-lg font-black">
              Spending by period
            </h2>
          </div>

          {/* Horizontal row on every screen */}

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-[650px] divide-x divide-black/[0.06]">

              {periodData.map(
                (period, index) => (
                  <div
                    key={period.label}
                    className={`flex-1 px-4 first:pl-0 last:pr-0 ${
                      index === 0
                        ? "pl-0"
                        : ""
                    }`}
                  >
                    <p className="text-[10px] font-bold text-black/35">
                      {period.label}
                    </p>

                    <p className="mt-2 text-base font-black sm:text-lg">
                      {formatCurrency(
                        period.amount
                      )}
                    </p>

                    <p className="mt-1 text-[9px] text-black/30">
                      {period.count}{" "}
                      {period.count === 1
                        ? "expense"
                        : "expenses"}
                    </p>
                  </div>
                )
              )}

            </div>
          </div>

        </section>

        {/* ===================================================
            ADD EXPENSE FORM
        =================================================== */}

        {showForm && (
          <section className="mb-5 rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                New transaction
              </p>

              <h2 className="mt-1 text-lg font-black">
                Add Business Expense
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs font-bold text-black/50">
                  Expense title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Electricity"
                  className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] px-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-black/50">
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] px-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-black/50">
                  Expense date
                </label>

                <input
                  type="date"
                  value={expenseDate}
                  onChange={(event) =>
                    setExpenseDate(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] px-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-black/50">
                  Description
                </label>

                <input
                  type="text"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Optional description"
                  className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] px-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
                />
              </div>

            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="h-11 rounded-2xl border border-black/[0.07] px-5 text-sm font-bold text-black/55 transition hover:bg-black/[0.03]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={createExpense}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#222022] px-5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />

                    Save Expense
                  </>
                )}
              </button>

            </div>

          </section>
        )}

        {/* ===================================================
            EXPENSE LIST
        =================================================== */}

        <section className="rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                Transaction history
              </p>

              <h2 className="mt-1 text-lg font-black">
                Recent Expenses
              </h2>
            </div>

            <Receipt
              size={20}
              className="text-black/25"
            />

          </div>

          {expenses.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F8F6] px-5 py-14 text-center">

              <Receipt
                size={30}
                className="mx-auto text-black/15"
              />

              <p className="mt-3 text-sm font-bold text-black/40">
                No expenses yet
              </p>

              <p className="mt-1 text-xs text-black/25">
                Add your first business expense.
              </p>

            </div>
          ) : (
            <div className="space-y-2">

              {expenses.map(
                (expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col gap-4 rounded-2xl bg-[#F8F8F6] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex min-w-0 items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                        <Receipt
                          size={17}
                          className="text-black/35"
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold">
                          {expense.title}
                        </p>

                        {expense.description && (
                          <p className="mt-1 truncate text-xs text-black/35">
                            {
                              expense.description
                            }
                          </p>
                        )}

                        <p className="mt-1 text-[10px] text-black/30">
                          {formatDate(
                            expense.expenseDate
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">

                      <p className="text-sm font-black">
                        -
                        {formatCurrency(
                          expense.amount
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          deleteExpense(
                            expense.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-black/25 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete expense"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}
