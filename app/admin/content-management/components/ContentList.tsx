"use client";

import { Content } from "../page";

interface ContentListProps {
  contents: Content[];
  onEdit: (content: Content) => void;
  onDelete: (content: Content) => void;
}

export default function ContentList({ contents, onEdit, onDelete }: ContentListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-800">Image</th>
            <th className="px-4 py-2 text-left text-gray-800">Title</th>
            <th className="px-4 py-2 text-left text-gray-800">Category</th>
            <th className="px-4 py-2 text-left text-gray-800">Sub Category</th>
            <th className="px-4 py-2 text-left text-gray-800">Price</th>
            <th className="px-4 py-2 text-left text-gray-800">Condition</th>
            <th className="px-4 py-2 text-left text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2">
                <img
                  src={content.imageUrl || "http://example.com/default.jpg"}
                  alt={content.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2">{content.title}</td>
              <td className="px-4 py-2">{content.category}</td>
              <td className="px-4 py-2">{content.subCategory}</td>
              <td className="px-4 py-2">${content.price.toFixed(2)}</td>
              <td className="px-4 py-2">{content.condition}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onEdit(content)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(content)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}