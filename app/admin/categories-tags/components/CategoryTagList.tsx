"use client";

import type { CategoryTag } from "../page";

type CategoryTagListProps = {
  onEdit: (item: CategoryTag) => void;
  onDelete: (id: string) => void;
  items: CategoryTag[];
};

export default function CategoryTagList({ onEdit, onDelete, items }: CategoryTagListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Categories & Tags List</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border-b py-2 flex justify-between items-center">
            <span>
              {item.name} ({item.type})
            </span>
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