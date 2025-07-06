"use client";

import { useState, useEffect } from "react";
import type { Content } from "../page";

type ContentListProps = {
  onEdit: (item: Content) => void;
  onDelete: (id: string) => void;
  contents: Content[];
};

export default function ContentList({ onEdit, onDelete, contents }: ContentListProps) {
  // No need for useEffect with props; use passed contents directly
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Content List</h2>
      <ul className="space-y-2">
        {contents.map((item) => (
          <li key={item.id} className="border-b py-2 flex justify-between items-center">
            <span>{item.title} ({item.category || "Uncategorized"})</span>
            <div>
              <button
                onClick={() => onEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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