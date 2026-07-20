"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import {
  createCategory,
  deleteCategory,
} from "@/lib/api";
import { toast } from "sonner";
type Category = {
  id: number;
  name: string;
};

type Props = {
  categories: Category[];
  onRefresh: () => void;
};

export default function CategoryManager({
  categories,
  onRefresh,
}: Props) {
  const [newCategory, setNewCategory] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  async function addCategory() {
    if (!newCategory.trim()) return;

    try {
      await createCategory(newCategory);

      setNewCategory("");

      onRefresh();
    } catch {
        toast.error("Category could not be created.");
    }
  }

  async function removeCategory() {
    if (selectedId === null) return;

    try {
      await deleteCategory(selectedId);

      setConfirmOpen(false);

      setSelectedId(null);

      onRefresh();
    } catch {
      toast.error("Category could not be deleted.");
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        Categories
      </h2>

      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 rounded-lg border px-4 py-2"
          placeholder="New category..."
          value={newCategory}
          onChange={(e) =>
            setNewCategory(e.target.value)
          }
        />

        <button
          onClick={addCategory}
          className="rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          className="mb-3 flex items-center justify-between rounded-xl bg-white p-4 shadow"
        >
          <p className="font-semibold">
            {category.name}
          </p>

          <button
            onClick={() => {
              setSelectedId(category.id);
              setConfirmOpen(true);
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Category"
        description="This action cannot be undone."
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedId(null);
        }}
        onConfirm={removeCategory}
      />
    </>
  );
}