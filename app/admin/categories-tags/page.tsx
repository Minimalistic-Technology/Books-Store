"use client";

import { useState } from "react";
import CategoryTagForm from "./components/CategoryTagForm";
import CategoryTagList from "./components/CategoryTagList";

// Define the CategoryTag interface
export interface CategoryTag {
  id: string;
  name: string;
  type: "category" | "tag"; // Differentiate between category and tag
  seoTitle: string;
  seoDescription: string;
}

export default function CategoriesTags() {
  const [items, setItems] = useState<CategoryTag[]>([]);
  const [selectedItem, setSelectedItem] = useState<CategoryTag | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleEdit = (item: CategoryTag) => {
    setSelectedItem(item);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (data: {
    id?: string;
    name: string;
    type: "category" | "tag";
    seoTitle: string;
    seoDescription: string;
  }) => {
    const newItem: CategoryTag = {
      id: data.id || Date.now().toString(), // Generate unique ID if new
      name: data.name,
      type: data.type,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    };
    if (selectedItem) {
      // Edit existing item
      setItems((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? newItem : item))
      );
    } else {
      // Add new item
      setItems((prev) => [...prev, newItem]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories & Tags - Books Store</h1>
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
        >
          Create New Category/Tag
        </button>
      </div>
      <CategoryTagList onEdit={handleEdit} onDelete={handleDelete} items={items} />
      {(isCreating || selectedItem) && (
        <CategoryTagForm
          item={
            selectedItem
              ? {
                  id: selectedItem.id,
                  name: selectedItem.name,
                  type: selectedItem.type,
                  seoTitle: selectedItem.seoTitle,
                  seoDescription: selectedItem.seoDescription,
                }
              : undefined
          }
          onClose={() => {
            setSelectedItem(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}