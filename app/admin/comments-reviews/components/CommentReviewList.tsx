"use client";

import { BookstoreReview } from "../../order-product-management/types";



type CommentReviewListProps = {
  onEdit: (item: BookstoreReview) => void;
  onDelete: (id: string) => void;
  items: BookstoreReview[];
};

export default function CommentReviewList({ onEdit, onDelete, items }: CommentReviewListProps) {
  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Comments & Reviews List</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp"
          >
            <span className="text-gray-800">
              {item.name || "Unknown"} - Rating: {item.rating ? `${item.rating}/5` : "N/A"} - Book: {item.bookId.title || "Unknown"} - Status: {item.status}
            </span>
            <div>
              <button
                onClick={() => onEdit(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all cursor-pointer "
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