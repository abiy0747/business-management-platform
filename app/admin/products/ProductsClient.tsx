"use client";

import {
  Check,
  ChevronDown,
  Edit3,
  Image as ImageIcon,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
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

type Category = {
  id: string;
  name: string;
};

type ProductsClientProps = {
  businessId: string;
  products: Product[];
  categories: Category[];
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  costPrice: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  costPrice: "",
  stock: "0",
  imageUrl: "",
  categoryId: "",
  isAvailable: true,
};

export default function ProductsClient({
  businessId,
  products,
  categories,
}: ProductsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categoryOptions = useMemo(() => {
    return [
      "All",
      ...categories.map((category) => category.name),
    ];
  }, [categories]);

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        product.categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  function openCreateForm() {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });

    setError("");
    setMessage("");
    setShowForm(true);
  }

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      costPrice: String(product.costPrice),
      stock: String(product.stock),
      imageUrl: product.imageUrl ?? "",
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
    });

    setError("");
    setMessage("");
    setShowForm(true);
  }

  // =========================================================
  // CLOSE FORM
  // =========================================================

  function closeForm() {
    if (isSaving) return;

    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
  }

  // =========================================================
  // FORM CHANGE
  // =========================================================

  function updateForm(
    field: keyof ProductForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // =========================================================
  // SAVE PRODUCT
  // =========================================================

  async function saveProduct() {
    setError("");
    setMessage("");

    const name = form.name.trim();
    const price = Number(form.price);
    const costPrice = Number(form.costPrice);
    const stock = Number(form.stock);

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Selling price must be a valid number.");
      return;
    }

    if (
      !Number.isFinite(costPrice) ||
      costPrice < 0
    ) {
      setError("Cost price must be a valid number.");
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Stock must be a whole number greater than or equal to 0."
      );
      return;
    }

    setIsSaving(true);

    try {
      const isEditing = Boolean(editingProduct);

      const response = await fetch(
        isEditing
          ? `/api/products/${editingProduct?.id}`
          : "/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
            name,
            description:
              form.description.trim() || null,
            price,
            costPrice,
            stock,
            imageUrl:
              form.imageUrl.trim() || null,
            categoryId: form.categoryId,
            isAvailable: form.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save product."
        );
      }

      setShowForm(false);
      setEditingProduct(null);
      setForm(emptyForm);

      setMessage(
        isEditing
          ? "Product updated successfully."
          : "Product created successfully."
      );

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis should only be done if the product has no sales or purchase history.`
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete product."
        );
      }

      setMessage(
        "Product deleted successfully."
      );

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================================
  // STOCK STATUS
  // =========================================================

  function getStockStatus(stock: number) {
    if (stock === 0) {
      return {
        label: "Out of stock",
        className:
          "bg-red-50 text-red-600",
      };
    }

    if (stock <= 5) {
      return {
        label: `${stock} left`,
        className:
          "bg-amber-50 text-amber-600",
      };
    }

    return {
      label: `${stock} in stock`,
      className:
        "bg-emerald-50 text-emerald-600",
    };
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
              Inventory
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-black/40">
              Manage your products, prices and stock.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#222022] px-5 text-sm font-bold text-white transition hover:bg-black"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>

        {/* =================================================
            MESSAGES
        ================================================= */}

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

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="mb-5 rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-5">
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
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] pl-11 pr-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-2xl border border-black/[0.07] bg-[#F8F8F6] px-4 pr-10 text-sm font-medium outline-none focus:border-[#C3D809] sm:w-[200px]"
              >
                {categoryOptions.map(
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

          {/* Category pills */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categoryOptions.map(
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
                    selectedCategory === category
                      ? "bg-[#222022] text-white"
                      : "bg-[#F6F6F3] text-black/45 hover:bg-black/[0.06]"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </section>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {filteredProducts.length === 0 ? (
          <section className="rounded-[24px] border border-black/[0.05] bg-white py-20 text-center">
            <Package
              size={36}
              strokeWidth={1.4}
              className="mx-auto text-black/15"
            />

            <h2 className="mt-4 text-lg font-black">
              No products found
            </h2>

            <p className="mt-1 text-sm text-black/35">
              Add your first product to start
              managing inventory.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#222022] px-4 text-xs font-bold text-white"
            >
              <Plus size={15} />
              Add Product
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map(
              (product) => {
                const stockStatus =
                  getStockStatus(
                    product.stock
                  );

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[24px] border border-black/[0.05] bg-white transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {/* Image */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F8F6]">
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
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon
                            size={38}
                            strokeWidth={1.2}
                            className="text-black/10"
                          />
                        </div>
                      )}

                      <div className="absolute left-3 top-3">
                        <span
                          className={`rounded-full px-2.5 py-1.5 text-[9px] font-bold ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>
                      </div>

                      {!product.isAvailable && (
                        <div className="absolute right-3 top-3">
                          <span className="rounded-full bg-black/75 px-2.5 py-1.5 text-[9px] font-bold text-white">
                            Hidden
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-black">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                            {product.categoryName}
                          </p>
                        </div>
                      </div>

                      {product.description && (
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-black/40">
                          {
                            product.description
                          }
                        </p>
                      )}

                      {/* Prices */}

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-[#F8F8F6] p-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                            Sell price
                          </p>

                          <p className="mt-1 text-sm font-black">
                            {formatCurrency(
                              product.price
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F8F6] p-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                            Cost
                          </p>

                          <p className="mt-1 text-sm font-black">
                            {formatCurrency(
                              product.costPrice
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              product
                            )
                          }
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white text-xs font-bold text-black/60 transition hover:border-[#C3D809] hover:bg-[#C3D809]/10 hover:text-black"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            product.id
                          }
                          onClick={() =>
                            deleteProduct(
                              product
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-40"
                          aria-label={`Delete ${product.name}`}
                        >
                          {deletingId ===
                          product.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                          ) : (
                            <Trash2
                              size={14}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

        {/* =================================================
            PRODUCT FORM MODAL
        ================================================= */}

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

              {/* Modal Header */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.06] bg-white px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                    Inventory
                  </p>

                  <h2 className="mt-1 text-lg font-black">
                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F6F6F3] text-black/45 transition hover:bg-black/[0.06] hover:text-black"
                  aria-label="Close"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Form */}

              <div className="space-y-5 p-5 sm:p-6">

                {/* Name */}

                <div>
                  <label className="text-xs font-bold text-black/60">
                    Product name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="e.g. iPhone 15 Pro"
                    className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="text-xs font-bold text-black/60">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      value={
                        form.categoryId
                      }
                      onChange={(event) =>
                        updateForm(
                          "categoryId",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full appearance-none rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 pr-10 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-4 top-[58%] -translate-y-1/2 text-black/35"
                    />
                  </div>
                </div>

                {/* Description */}

                <div>
                  <label className="text-xs font-bold text-black/60">
                    Description
                    <span className="ml-1 font-normal text-black/25">
                      optional
                    </span>
                  </label>

                  <textarea
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      updateForm(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Short product description..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 py-3 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                  />
                </div>

                {/* Prices */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-black/60">
                      Default selling price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.price
                      }
                      onChange={(event) =>
                        updateForm(
                          "price",
                          event.target.value
                        )
                      }
                      placeholder="0.00"
                      className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                    />

                    <p className="mt-1.5 text-[10px] text-black/30">
                      Used as the normal/default
                      selling price.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-black/60">
                      Cost price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.costPrice
                      }
                      onChange={(event) =>
                        updateForm(
                          "costPrice",
                          event.target.value
                        )
                      }
                      placeholder="0.00"
                      className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                    />

                    <p className="mt-1.5 text-[10px] text-black/30">
                      Your purchase cost per unit.
                    </p>
                  </div>
                </div>

                {/* Stock */}

                <div>
                  <label className="text-xs font-bold text-black/60">
                    Opening stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      updateForm(
                        "stock",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                  />

                  <p className="mt-1.5 text-[10px] text-black/30">
                    This is the starting quantity only.
                    Future stock should be added through
                    Purchases.
                  </p>
                </div>

                {/* Image */}

                <div>
                  <label className="text-xs font-bold text-black/60">
                    Image URL
                    <span className="ml-1 font-normal text-black/25">
                      optional
                    </span>
                  </label>

                  <input
                    type="url"
                    value={
                      form.imageUrl
                    }
                    onChange={(event) =>
                      updateForm(
                        "imageUrl",
                        event.target.value
                      )
                    }
                    placeholder="https://..."
                    className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 text-sm outline-none focus:border-[#C3D809] focus:bg-white"
                  />
                </div>

                {/* Availability */}

                <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#F8F8F6] px-4 py-4">
                  <div>
                    <p className="text-sm font-bold">
                      Product available
                    </p>

                    <p className="mt-1 text-[10px] text-black/35">
                      Available products can be
                      displayed and sold.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={
                      form.isAvailable
                    }
                    onChange={(event) =>
                      updateForm(
                        "isAvailable",
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-[#C3D809]"
                  />
                </label>

                {/* Buttons */}

                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={isSaving}
                    className="h-11 rounded-xl border border-black/[0.08] px-5 text-sm font-bold text-black/55 transition hover:bg-black/[0.04] disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveProduct}
                    disabled={isSaving}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#222022] px-6 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSaving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {editingProduct
                          ? "Save Changes"
                          : "Create Product"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}