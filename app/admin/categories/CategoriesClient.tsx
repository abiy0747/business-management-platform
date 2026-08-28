"use client";

import {
  Check,
  Edit3,
  FolderOpen,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

type Category = {
  id: string;
  name: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

type CategoriesClientProps = {
  categories: Category[];
};

export default function CategoriesClient({
  categories: initialCategories,
}: CategoriesClientProps) {
  const [
    categories,
    setCategories,
  ] = useState<Category[]>(
    initialCategories
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] = useState<Category | null>(
    null
  );

  const [
    categoryName,
    setCategoryName,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  // =========================================================
  // FILTER
  // =========================================================

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name
            .toLowerCase()
            .includes(query)
      );
    }, [
      categories,
      search,
    ]);

  // =========================================================
  // OPEN CREATE
  // =========================================================

  function openCreateModal() {
    setEditingCategory(null);
    setCategoryName("");
    setError("");
    setMessage("");
    setModalOpen(true);
  }

  // =========================================================
  // OPEN EDIT
  // =========================================================

  function openEditModal(
    category: Category
  ) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setError("");
    setMessage("");
    setModalOpen(true);
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setError("");
  }

  // =========================================================
  // SAVE CATEGORY
  // =========================================================

  async function saveCategory() {
    const name =
      categoryName.trim();

    if (!name) {
      setError(
        "Category name is required."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const isEditing =
        Boolean(editingCategory);

      const response =
        await fetch(
          isEditing
            ? `/api/categories/${editingCategory?.id}`
            : "/api/categories",
          {
            method: isEditing
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save category."
        );
      }

      if (isEditing) {
        setCategories(
          (current) =>
            current.map(
              (category) =>
                category.id ===
                data.category.id
                  ? data.category
                  : category
            )
        );

        setMessage(
          "Category updated successfully."
        );
      } else {
        setCategories(
          (current) =>
            [...current, data.category].sort(
              (a, b) =>
                a.name.localeCompare(
                  b.name
                )
            )
        );

        setMessage(
          "Category created successfully."
        );
      }

      setCategoryName("");
      setEditingCategory(null);
      setModalOpen(false);
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
  // DELETE CATEGORY
  // =========================================================

  async function deleteCategory(
    category: Category
  ) {
    const confirmed =
      window.confirm(
        `Delete "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          `/api/categories/${category.id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete category."
        );
      }

      setCategories(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              category.id
          )
      );

      setMessage(
        "Category deleted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================================
  // TOTALS
  // =========================================================

  const totalProducts =
    useMemo(() => {
      return categories.reduce(
        (sum, category) =>
          sum +
          category.productCount,
        0
      );
    }, [categories]);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/30">
              Product organization
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Categories
            </h1>

            <p className="mt-1 text-sm text-black/40">
              Organize your products into
              clear categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#222022] px-5 text-sm font-bold text-white transition hover:bg-black active:scale-[0.98]"
          >
            <Plus size={17} />

            Add Category
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
            SUMMARY
        ================================================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

          <div className="rounded-[22px] border border-black/[0.05] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C3D809]/15 text-[#222022]">
              <Tags size={19} />
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-black/30">
              Categories
            </p>

            <p className="mt-1 text-2xl font-black">
              {categories.length}
            </p>
          </div>

          <div className="rounded-[22px] border border-black/[0.05] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.05]">
              <FolderOpen size={19} />
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-black/30">
              Products organized
            </p>

            <p className="mt-1 text-2xl font-black">
              {totalProducts}
            </p>
          </div>

        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <section className="rounded-[24px] border border-black/[0.05] bg-white p-4 sm:p-6">

          {/* Search */}

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
              placeholder="Search categories..."
              className="h-12 w-full rounded-2xl border border-black/[0.07] bg-[#F8F8F6] pl-11 pr-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
            />
          </div>

          {/* Category List */}

          <div className="mt-5">

            {filteredCategories.length ===
            0 ? (
              <div className="rounded-[22px] bg-[#F8F8F6] px-5 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  <Tags
                    size={25}
                    className="text-black/20"
                  />
                </div>

                <p className="mt-4 text-sm font-bold text-black/45">
                  {search
                    ? "No categories found"
                    : "No categories yet"}
                </p>

                <p className="mt-1 text-xs text-black/25">
                  {search
                    ? "Try another search."
                    : "Create your first category to organize your products."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={
                      openCreateModal
                    }
                    className="mt-5 rounded-xl bg-[#222022] px-4 py-2.5 text-xs font-bold text-white"
                  >
                    Create Category
                  </button>
                )}

              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {filteredCategories.map(
                  (category) => (
                    <div
                      key={
                        category.id
                      }
                      className="group rounded-[22px] border border-black/[0.05] bg-[#F8F8F6] p-4 transition hover:border-[#C3D809] hover:bg-white hover:shadow-md"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#222022] shadow-sm">
                            <Tags
                              size={18}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black">
                              {
                                category.name
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-black/35">
                              {category.productCount}{" "}
                              {category.productCount ===
                              1
                                ? "product"
                                : "products"}
                            </p>
                          </div>

                        </div>

                        <div className="flex shrink-0 gap-1">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                category
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-black/30 transition hover:bg-white hover:text-black"
                            aria-label={`Edit ${category.name}`}
                          >
                            <Edit3
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              category.id
                            }
                            onClick={() =>
                              deleteCategory(
                                category
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-black/25 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                            aria-label={`Delete ${category.name}`}
                          >
                            {deletingId ===
                            category.id ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/10 border-t-red-500" />
                            ) : (
                              <Trash2
                                size={14}
                              />
                            )}
                          </button>

                        </div>

                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                        <div
                          className="h-full rounded-full bg-[#C3D809]"
                          style={{
                            width:
                              category.productCount >
                              0
                                ? "100%"
                                : "0%",
                          }}
                        />
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>
      </div>

      {/* ===================================================
          CREATE / EDIT MODAL
      =================================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                  Categories
                </p>

                <h2 className="mt-1 text-lg font-black">
                  {editingCategory
                    ? "Edit Category"
                    : "New Category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-black/35 transition hover:bg-black/[0.05] hover:text-black"
                aria-label="Close"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal Body */}

            <div className="p-5 sm:p-6">

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <label className="text-xs font-bold text-black/55">
                Category name
              </label>

              <input
                type="text"
                value={
                  categoryName
                }
                onChange={(event) =>
                  setCategoryName(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    saveCategory();
                  }
                }}
                placeholder="e.g. Chargers"
                autoFocus
                className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F8F8F6] px-4 text-sm outline-none transition focus:border-[#C3D809] focus:bg-white"
              />

              <p className="mt-2 text-[10px] text-black/30">
                Use a clear name that helps
                you organize your products.
              </p>

              <div className="mt-6 flex gap-2">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSubmitting
                  }
                  className="h-11 flex-1 rounded-2xl border border-black/[0.07] text-sm font-bold text-black/55 transition hover:bg-black/[0.03] disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    saveCategory
                  }
                  disabled={
                    isSubmitting
                  }
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#222022] text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Check
                        size={16}
                      />

                      {editingCategory
                        ? "Save Changes"
                        : "Create Category"}
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}