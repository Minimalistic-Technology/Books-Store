"use client";

import { useState } from "react";
import CategoryTagForm from "./components/CategoryTagForm";
import CategoryTagList from "./components/CategoryTagList";

// Define the CategoryTag interface
export interface CategoryTag {
  id: string;
  name: string;
  type: "category" | "tag";
  seoTitle: string;
  seoDescription: string;
}

export default function CategoriesTags() {
  const [items, setItems] = useState<CategoryTag[]>([]);
  const [selectedItem, setSelectedItem] = useState<CategoryTag | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleEdit = (item: CategoryTag) => {
    setSelectedItem(item);
    setIsCreating(true);
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
      id: data.id || Date.now().toString(),
      name: data.name,
      type: data.type,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    };
    if (selectedItem) {
      setItems((prev) => prev.map((item) => (item.id === selectedItem.id ? newItem : item)));
    } else {
      setItems((prev) => [...prev, newItem]);
    }
    setIsCreating(false);
    setSelectedItem(null);
  };

  const handleClose = () => {
    setIsCreating(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Categories & Tags - Books Store</h1>
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Create New Category/Tag
        </button>
      </div>
      <CategoryTagList onEdit={handleEdit} onDelete={handleDelete} items={items} />
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
          <div className="card bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate__zoomIn">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
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
              onClose={handleClose}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}