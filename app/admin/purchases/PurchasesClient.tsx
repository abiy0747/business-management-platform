"use client";

import {
  Check,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl: string | null;
  category: string;
};

type PurchaseItem = {
  productId: string;
  name: string;
  unitCost: number;
  quantity: number;
};

type PurchasesClientProps = {
  businessId: string;
  products: Product[];
};

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export default function PurchasesClient({
  businessId,
  products,
}: PurchasesClientProps) {
  const [search, setSearch] =
    useState("");

  const [supplier, setSupplier] =
    useState("");

  const [cart, setCart] =
    useState<PurchaseItem[]>(
      []
    );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================================================
  // FILTER
  // =========================================================

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query)
      );
    }, [
      products,
      search,
    ]);

  // =========================================================
  // TOTAL
  // =========================================================

  const totalCost =
    useMemo(() => {
      return cart.reduce(
        (sum, item) =>
          sum +
          item.unitCost *
            item.quantity,
        0
      );
    }, [cart]);

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  function addToCart(
    product: Product
  ) {
    setError("");
    setMessage("");

    setCart(
      (currentCart) => {
        const existing =
          currentCart.find(
            (item) =>
              item.productId ===
              product.id
          );

        if (existing) {
          return currentCart.map(
            (item) =>
              item.productId ===
              product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          );
        }

        return [
          ...currentCart,
          {
            productId:
              product.id,

            name:
              product.name,

            unitCost:
              product.costPrice,

            quantity: 1,
          },
        ];
      }
    );
  }

  // =========================================================
  // UPDATE COST
  // =========================================================

  function updateUnitCost(
    productId: string,
    value: string
  ) {
    if (value === "") {
      setCart(
        (currentCart) =>
          currentCart.map(
            (item) =>
              item.productId ===
              productId
                ? {
                    ...item,
                    unitCost: 0,
                  }
                : item
          )
      );

      return;
    }

    const numericValue =
      Number(value);

    if (
      !Number.isFinite(
        numericValue
      ) ||
      numericValue < 0
    ) {
      return;
    }

    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  unitCost:
                    numericValue,
                }
              : item
        )
    );
  }

  // =========================================================
  // QUANTITY
  // =========================================================

  function increaseQuantity(
    productId: string
  ) {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    1,
                }
              : item
        )
    );
  }

  function decreaseQuantity(
    productId: string
  ) {
    setCart(
      (currentCart) =>
        currentCart
          .map((item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  quantity:
                    item.quantity -
                    1,
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity >
              0
          )
    );
  }

  // =========================================================
  // REMOVE
  // =========================================================

  function removeFromCart(
    productId: string
  ) {
    setCart(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            item.productId !==
            productId
        )
    );
  }

  // =========================================================
  // COMPLETE PURCHASE
  // =========================================================

  async function completePurchase() {
    if (cart.length === 0) {
      setError(
        "Add at least one product."
      );

      return;
    }

    for (const item of cart) {
      if (
        !Number.isFinite(
          item.unitCost
        ) ||
        item.unitCost < 0
      ) {
        setError(
          `Enter a valid purchase cost for ${item.name}.`
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
          "/api/purchases",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              businessId,

              supplier,

              items: cart.map(
                (item) => ({
                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                  unitCost:
                    item.unitCost,
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
            "Failed to record purchase."
        );
      }

      setCart([]);
      setSupplier("");

      setMessage(
        `Purchase recorded successfully. ${formatCurrency(
          data.purchase.totalCost
        )} spent.`
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

        <div className="mb-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
            Inventory
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Stock In
          </h1>

          <p className="mt-1 text-sm text-black/40">
            Record products you purchase
            and automatically increase stock.
          </p>
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

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_400px]">

          {/* PRODUCTS */}

          <section className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-6">

            <div className="relative">
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
                className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] pl-11 pr-4 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map(
                (product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      addToCart(
                        product
                      )
                    }
                    className="group overflow-hidden rounded-[20px] border border-black/[0.05] bg-[#F8F8F6] p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#C3D809] hover:bg-white hover:shadow-lg"
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
                      Current stock:{" "}
                      {product.stock}
                    </p>

                    <p className="mt-2 text-xs font-bold text-black/45">
                      Last cost:{" "}
                      {formatCurrency(
                        product.costPrice
                      )}
                    </p>
                  </button>
                )
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
              </div>
            )}
          </section>

          {/* PURCHASE */}

          <section className="h-fit rounded-[24px] border border-black/[0.05] bg-white p-5 sm:p-6 xl:sticky xl:top-[96px]">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C3D809]/15">
                <ShoppingBag
                  size={18}
                />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                  Stock purchase
                </p>

                <h2 className="text-lg font-black">
                  Purchase Summary
                </h2>
              </div>
            </div>

            {/* SUPPLIER */}

            <div className="mt-5">
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-black/35">
                Supplier
                <span className="ml-1 font-normal">
                  (optional)
                </span>
              </label>

              <input
                type="text"
                value={supplier}
                onChange={(event) =>
                  setSupplier(
                    event.target.value
                  )
                }
                placeholder="Supplier name..."
                className="h-11 w-full rounded-xl border border-black/[0.07] bg-[#F8F8F6] px-3 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
              />
            </div>

            {/* ITEMS */}

            <div className="mt-5 max-h-[470px] space-y-2 overflow-y-auto pr-1">
              {cart.length ===
              0 ? (
                <div className="rounded-2xl bg-[#F8F8F6] px-5 py-12 text-center">
                  <ShoppingBag
                    size={28}
                    className="mx-auto text-black/15"
                  />

                  <p className="mt-3 text-sm font-bold text-black/40">
                    No products selected
                  </p>

                  <p className="mt-1 text-xs text-black/25">
                    Click a product to
                    add purchased stock.
                  </p>
                </div>
              ) : (
                cart.map(
                  (item) => (
                    <div
                      key={
                        item.productId
                      }
                      className="rounded-2xl bg-[#F8F8F6] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-bold">
                          {
                            item.name
                          }
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.productId
                            )
                          }
                          className="rounded-lg p-1.5 text-black/25 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2
                            size={14}
                          />
                        </button>
                      </div>

                      {/* COST */}

                      <div className="mt-3">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-black/35">
                          Unit purchase cost
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            item.unitCost
                          }
                          onChange={(
                            event
                          ) =>
                            updateUnitCost(
                              item.productId,
                              event
                                .target
                                .value
                            )
                          }
                          className="h-11 w-full rounded-xl border border-black/[0.07] bg-white px-3 text-sm font-black outline-none focus:border-[#C3D809]"
                        />
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
                            className="flex h-8 w-8 items-center justify-center text-black/45"
                          >
                            <Minus
                              size={
                                13
                              }
                            />
                          </button>

                          <span className="w-8 text-center text-xs font-black">
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.productId
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center text-black/45"
                          >
                            <Plus
                              size={
                                13
                              }
                            />
                          </button>
                        </div>

                        <p className="text-sm font-black">
                          {formatCurrency(
                            item.unitCost *
                              item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* TOTAL */}

            <div className="mt-5 border-t border-black/[0.06] pt-5">
              <div className="flex items-center justify-between rounded-2xl bg-[#F8F8F6] px-4 py-3">
                <span className="text-sm font-bold">
                  Total purchase cost
                </span>

                <span className="text-lg font-black">
                  {formatCurrency(
                    totalCost
                  )}
                </span>
              </div>

              <button
                type="button"
                disabled={
                  cart.length ===
                    0 ||
                  isSubmitting
                }
                onClick={
                  completePurchase
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

                    Record Purchase
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