//Content List.tsx
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
                onClick={() => onDelete(item.id)}
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