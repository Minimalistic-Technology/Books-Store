"use client";

import type { CommentReview } from "../page";

type CommentReviewListProps = {
  onEdit: (item: CommentReview) => void;
  onDelete: (id: string) => void;
  items: CommentReview[];
};

export default function CommentReviewList({ onEdit, onDelete, items }: CommentReviewListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Comments & Reviews List</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border-b py-2 flex justify-between items-center">
            <span>
              {item.author} - {item.content.substring(0, 20)}
              {item.content.length > 20 ? "..." : ""}
              {item.isSpam && " (Spam)"}
              {!item.isApproved && " (Pending)"}
            </span>
            <div>
              <button
                onClick={() => onEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Moderate
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