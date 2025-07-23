// components/CommentReviewForm.tsx
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.bookName.trim()) newErrors.bookName = "Book Name is required";
    if (!formData.seoTitle.trim()) newErrors.seoTitle = "SEO Title is required";
    if (!formData.seoDescription.trim()) newErrors.seoDescription = "SEO Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
    <div className="fixed inset-0 bg-yellow-500 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {item ? "Moderate Comment/Review" : "Add Comment/Review"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>
            <div>
              <input
                type="text"
                name="bookName"
                value={formData.bookName}
                onChange={handleChange}
                placeholder="Book Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.bookName && <p className="text-red-500 text-sm mt-1">{errors.bookName}</p>}
            </div>
            <div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Comment/Review Content"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-40 resize-y"
                required
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleChange}
                  className="mr-2 h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all"
                />
                Approve
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isSpam"
                  checked={formData.isSpam}
                  onChange={handleChange}
                  className="mr-2 h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all"
                />
                Mark as Spam
              </label>
            </div>
            <div>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="SEO Title (e.g., Book Review Comment)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.seoTitle && <p className="text-red-500 text-sm mt-1">{errors.seoTitle}</p>}
            </div>
            <div>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="SEO Description (e.g., User review for book)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-y"
                required
              />
              {errors.seoDescription && <p className="text-red-500 text-sm mt-1">{errors.seoDescription}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}