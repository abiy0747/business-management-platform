"use client";

import {
  Check,
  ChevronDown,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  category: string;
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
  stock: number;
};

type SalesClientProps = {
  businessId: string;
  products: Product[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SalesClient({
  businessId,
  products,
}: SalesClientProps) {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [cart, setCart] = useState<CartItem[]>([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products.map(
            (product) => product.category
          )
        )
      ),
    ];
  }, [products]);

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

  // =========================================================
  // CART TOTALS
  // =========================================================

  const totalRevenue = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );
  }, [cart]);

  const totalCost = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.costPrice *
          item.quantity,
      0
    );
  }, [cart]);

  const totalProfit = useMemo(() => {
    return (
      totalRevenue -
      totalCost
    );
  }, [
    totalRevenue,
    totalCost,
  ]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );
  }, [cart]);

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  function addToCart(product: Product) {
    setError("");
    setMessage("");

    if (product.stock <= 0) {
      setError(
        `${product.name} is out of stock.`
      );

      return;
    }

    setCart((currentCart) => {
      const existing =
        currentCart.find(
          (item) =>
            item.productId ===
            product.id
        );

      if (existing) {
        if (
          existing.quantity >=
          product.stock
        ) {
          return currentCart;
        }

        return currentCart.map(
          (item) =>
            item.productId ===
            product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,

          // IMPORTANT:
          // This is the default/suggested
          // selling price.
          price: product.price,

          costPrice:
            product.costPrice,

          quantity: 1,

          stock: product.stock,
        },
      ];
    });
  }

  // =========================================================
  // UPDATE SELLING PRICE
  // =========================================================

  function updateSellingPrice(
    productId: string,
    value: string
  ) {
    const numericValue =
      Number(value);

    if (
      value === "" ||
      !Number.isFinite(
        numericValue
      ) ||
      numericValue < 0
    ) {
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId ===
        productId
          ? {
              ...item,
              price:
                numericValue,
            }
          : item
      )
    );
  }

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  function increaseQuantity(
    productId: string
  ) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.productId !==
          productId
        ) {
          return item;
        }

        if (
          item.quantity >=
          item.stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  }

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  function decreaseQuantity(
    productId: string
  ) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.productId !==
            productId
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity - 1,
          };
        })
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  // =========================================================
  // REMOVE PRODUCT
  // =========================================================

  function removeFromCart(
    productId: string
  ) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.productId !==
          productId
      )
    );
  }

  // =========================================================
  // CLEAR CART
  // =========================================================

  function clearCart() {
    setCart([]);
    setError("");
    setMessage("");
  }

  // =========================================================
  // COMPLETE SALE
  // =========================================================

  async function completeSale() {
    if (cart.length === 0) {
      setError(
        "Add at least one product."
      );

      return;
    }

    for (const item of cart) {
      if (
        !Number.isFinite(
          item.price
        ) ||
        item.price < 0
      ) {
        setError(
          `Enter a valid selling price for ${item.name}.`
        );

        return;
      }
    }

    setIsSubmitting(true);

    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/sales",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              businessId,

              items: cart.map(
                (item) => ({
                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                  // Send the actual
                  // negotiated price.
                  sellingPrice:
                    item.price,
                })
              ),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to complete sale."
        );
      }

      setCart([]);

      setMessage(
        `Sale completed successfully. ${formatCurrency(
          data.sale.totalAmount
        )} received.`
      );

      window.location.reload();
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
  // UI
  // =========================================================

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
              Transactions
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              New Sale
            </h1>

            <p className="mt-1 text-sm text-black/40">
              Select products and enter
              the actual negotiated price.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-black/[0.05] bg-white px-4 py-3">
            <ShoppingCart
              size={17}
              className="text-black/35"
            />

            <span className="text-sm font-bold">
              {totalItems} items
            </span>
          </div>
        </div>

        {/* MESSAGES */}

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

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_400px]">

          {/* PRODUCTS */}

          <section className="min-w-0 rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-6">

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] pl-11 pr-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
                />
              </div>

              <div className="relative">
                <select
                  value={
                    selectedCategory
                  }
                  onChange={(event) =>
                    setSelectedCategory(
                      event.target.value
                    )
                  }
                  className="h-12 w-full appearance-none rounded-2xl border border-black/[0.07] bg-[#F8F8F6] px-4 pr-10 text-sm font-medium outline-none focus:border-[#C3D809] sm:w-[190px]"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
                />
              </div>
            </div>

            {/* CATEGORY PILLS */}

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                      selectedCategory ===
                      category
                        ? "bg-[#222022] text-white"
                        : "bg-[#F6F6F3] text-black/45 hover:bg-black/[0.06]"
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>

            {/* PRODUCTS */}

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map(
                (product) => {
                  const cartItem =
                    cart.find(
                      (item) =>
                        item.productId ===
                        product.id
                    );

                  const quantity =
                    cartItem?.quantity ??
                    0;

                  const outOfStock =
                    product.stock <=
                    0;

                  const maxedOut =
                    quantity >=
                    product.stock;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={
                        outOfStock ||
                        maxedOut
                      }
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                      className={`group relative overflow-hidden rounded-[20px] border p-3 text-left transition-all ${
                        outOfStock
                          ? "cursor-not-allowed border-black/[0.05] bg-black/[0.02] opacity-50"
                          : maxedOut
                          ? "border-[#C3D809] bg-[#C3D809]/10"
                          : "border-black/[0.05] bg-[#F8F8F6] hover:-translate-y-0.5 hover:border-[#C3D809] hover:bg-white hover:shadow-lg"
                      }`}
                    >
                      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white">
                        {product.imageUrl ? (
                          <img
                            src={
                              product.imageUrl
                            }
                            alt={
                              product.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package
                            size={28}
                            strokeWidth={
                              1.4
                            }
                            className="text-black/15"
                          />
                        )}
                      </div>

                      <p className="truncate text-sm font-bold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[10px] text-black/35">
                        {product.category}
                      </p>

                      <div className="mt-3 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[9px] uppercase tracking-wide text-black/30">
                            Suggested
                          </p>

                          <p className="text-sm font-black">
                            {formatCurrency(
                              product.price
                            )}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                            product.stock ===
                            0
                              ? "bg-red-50 text-red-600"
                              : product.stock <=
                                5
                              ? "bg-amber-50 text-amber-600"
                              : "bg-black/[0.05] text-black/45"
                          }`}
                        >
                          {product.stock} left
                        </span>
                      </div>

                      {quantity > 0 && (
                        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#C3D809] text-xs font-black text-[#222022]">
                          {quantity}
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {filteredProducts.length ===
              0 && (
              <div className="py-16 text-center">
                <Package
                  size={30}
                  className="mx-auto text-black/15"
                />

                <p className="mt-3 text-sm font-semibold text-black/40">
                  No products found
                </p>

                <p className="mt-1 text-xs text-black/25">
                  Try another search or
                  category.
                </p>
              </div>
            )}
          </section>

          {/* CART */}

          <section className="h-fit rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6 xl:sticky xl:top-[96px]">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                  Current transaction
                </p>

                <h2 className="mt-1 text-lg font-black">
                  Sale Summary
                </h2>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={
                    clearCart
                  }
                  className="text-xs font-bold text-red-500 transition hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* CART */}

            <div className="mt-5 max-h-[500px] space-y-2 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-[#F8F8F6] px-5 py-12 text-center">
                  <ShoppingCart
                    size={28}
                    className="mx-auto text-black/15"
                  />

                  <p className="mt-3 text-sm font-bold text-black/40">
                    No products selected
                  </p>

                  <p className="mt-1 text-xs text-black/25">
                    Click a product to add
                    it to the sale.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={
                      item.productId
                    }
                    className="rounded-2xl bg-[#F8F8F6] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {item.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-black/35">
                          Suggested price:{" "}
                          {formatCurrency(
                            products.find(
                              (product) =>
                                product.id ===
                                item.productId
                            )?.price ??
                              item.price
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.productId
                          )
                        }
                        className="rounded-lg p-1.5 text-black/25 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>
                    </div>

                    {/* NEGOTIATED PRICE */}

                    <div className="mt-3">
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-black/35">
                        Actual selling price
                      </label>

                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            item.price
                          }
                          onChange={(event) =>
                            updateSellingPrice(
                              item.productId,
                              event.target.value
                            )
                          }
                          className="h-11 w-full rounded-xl border border-black/[0.07] bg-white px-3 text-sm font-black outline-none transition focus:border-[#C3D809]"
                        />
                      </div>
                    </div>

                    {/* QUANTITY */}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-xl border border-black/[0.06] bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.productId
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center text-black/45 hover:text-black"
                        >
                          <Minus
                            size={13}
                          />
                        </button>

                        <span className="w-8 text-center text-xs font-black">
                          {
                            item.quantity
                          }
                        </span>

                        <button
                          type="button"
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                          onClick={() =>
                            increaseQuantity(
                              item.productId
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center text-black/45 disabled:opacity-20"
                        >
                          <Plus
                            size={13}
                          />
                        </button>
                      </div>

                      <p className="text-sm font-black">
                        {formatCurrency(
                          item.price *
                            item.quantity
                        )}
                      </p>
                    </div>

                    {/* ITEM PROFIT */}

                    <div className="mt-2 flex justify-between text-[10px]">
                      <span className="text-black/35">
                        Estimated profit
                      </span>

                      <span
                        className={
                          item.price >=
                          item.costPrice
                            ? "font-bold text-emerald-600"
                            : "font-bold text-red-600"
                        }
                      >
                        {formatCurrency(
                          (item.price -
                            item.costPrice) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SUMMARY */}

            <div className="mt-5 border-t border-black/[0.06] pt-5">
              <div className="space-y-3">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/45">
                    Revenue
                  </span>

                  <span className="font-bold">
                    {formatCurrency(
                      totalRevenue
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/45">
                    Cost
                  </span>

                  <span className="font-bold">
                    {formatCurrency(
                      totalCost
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#C3D809]/15 px-4 py-3">
                  <span className="text-sm font-bold">
                    Profit
                  </span>

                  <span
                    className={`text-base font-black ${
                      totalProfit >=
                      0
                        ? "text-[#222022]"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      totalProfit
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  cart.length ===
                    0 ||
                  isSubmitting
                }
                onClick={
                  completeSale
                }
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#222022] text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Processing...
                  </>
                ) : (
                  <>
                    <Check
                      size={17}
                    />

                    Complete Sale
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}