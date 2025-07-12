// app/admin/categories-tags/page.tsx
"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchCategoriesTags = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookstore/admincategory");
        const data = await response.json();
        setItems(
          data.map((item: any) => ({
            id: item._id,
            name: item.name,
            type: "category", // Assuming all from API are categories; adjust if tags are included
            seoTitle: item.seoTitle,
            seoDescription: item.seoDescription,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch categories/tags:", error);
      }
    };

    fetchCategoriesTags();
  }, []);

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

  const handleSave = async (data: {
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
    try {
      let response;
      if (data.id) {
        response = await fetch(`http://localhost:5000/api/bookstore/admincategory/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            type: data.type,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
          }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/bookstore/admincategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            type: data.type,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
          }),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save category/tag");
      }
      const savedData = await response.json();
      newItem.id = savedData._id || newItem.id;
      if (selectedItem) {
        setItems((prev) =>
          prev.map((item) => (item.id === selectedItem.id ? newItem : item))
        );
      } else {
        setItems((prev) => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Error saving category/tag:", error);
      // Handle error display if needed (e.g., via a state or alert)
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