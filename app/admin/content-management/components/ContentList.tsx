// components/ContentList.tsx
"use client";

import { useState, useEffect } from "react";
import type { Content } from "../page";

type ContentListProps = {
  onEdit: (item: Content) => void;
  onDelete: (id: string) => void;
  contents: Content[];
};

export default function ContentList({ onEdit, onDelete, contents }: ContentListProps) {
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookstore/admincontent/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete content");
      onDelete(id); // Call parent onDelete after successful API call
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Content List</h2>
      <ul className="space-y-4">
        {contents.map((item) => (
          <li key={item.id} className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp">
            <span className="text-gray-800">{item.title} ({item.category || "Uncategorized"})</span>
            <div>
              <button
                onClick={() => onEdit(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}