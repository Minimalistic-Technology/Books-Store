"use client";

import { useState } from "react";

type CommentReviewFormProps = {
  item?: {
    id?: string;
    content?: string;
    author?: string;
    bookName?: string;
    isApproved?: boolean;
    isSpam?: boolean;
    createdAt?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
  onClose: () => void;
  onSave: (data: {
    id?: string;
    content: string;
    author: string;
    bookName: string;
    isApproved: boolean;
    isSpam: boolean;
    createdAt?: string;
    seoTitle: string;
    seoDescription: string;
  }) => void;
};

export default function CommentReviewForm({ item, onClose, onSave }: CommentReviewFormProps) {
  const [formData, setFormData] = useState({
    id: item?.id || "",
    content: item?.content || "",
    author: item?.author || "",
    bookName: item?.bookName || "",
    isApproved: item?.isApproved || false,
    isSpam: item?.isSpam || false,
    createdAt: item?.createdAt || new Date().toISOString(),
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      id: formData.id,
      content: formData.content,
      author: formData.author,
      bookName: formData.bookName,
      isApproved: formData.isApproved,
      isSpam: formData.isSpam,
      createdAt: formData.createdAt,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#fff3cd] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto" style={{ maxHeight: "80vh" }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {item ? "Moderate Comment/Review" : "Add Comment/Review"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              placeholder="Book Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {/* <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Comment/Review Content"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-y"
              required
            /> */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleChange}
                  className="mr-2"
                />
                Approve
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isSpam"
                  checked={formData.isSpam}
                  onChange={handleChange}
                  className="mr-2"
                />
                Mark as Spam
              </label>
            </div>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="SEO Title (e.g., Book Review Comment)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder="SEO Description (e.g., User review for book)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-y"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}