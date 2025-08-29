"use client";

import { useState } from "react";


type CommentReviewFormProps = {
  item?: {
    id?: string;
    bookId?: { _id: string; title: string };
    categoryName?: string;
    name?: string;
    email?: string;
    rating?: number;
    comment?: string;
    createdAt?: string;
    status?: 'pending' | 'approved' | 'disapproved';
  };
  books: { _id: string; title: string; categoryName: string }[];
  onClose: () => void;
  onSave: (data: {
    id?: string;
    bookId: string;
    categoryName: string;
    name: string;
    email: string;
    rating: number;
    comment: string;
    createdAt?: string;
    status?: 'pending' | 'approved' | 'disapproved';
  }) => void;
};

export default function CommentReviewForm({ item, books, onClose, onSave }: CommentReviewFormProps) {
  const [formData, setFormData] = useState({
    id: item?.id || "",
    bookId: item?.bookId?._id || (books.length > 0 ? books[0]._id : ""),
    categoryName: item?.categoryName || (books.length > 0 ? books[0].categoryName : ""),
    name: item?.name || "",
    email: item?.email || "",
    rating: item?.rating || 1,
    comment: item?.comment || "",
    createdAt: item?.createdAt || new Date().toISOString(),
    status: item?.status || "pending",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 1 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Update categoryName when bookId changes (for new reviews)
    if (name === "bookId") {
      const selectedBook = books.find((book) => book._id === value);
      setFormData((prev) => ({
        ...prev,
        categoryName: selectedBook ? selectedBook.categoryName : prev.categoryName,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.bookId) newErrors.bookId = "Book is required";
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) newErrors.rating = "Rating must be between 1 and 5";
    if (!formData.comment.trim()) newErrors.comment = "Comment is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: formData.id,
      bookId: formData.bookId,
      categoryName: formData.categoryName,
      name: formData.name,
      email: formData.email,
      rating: formData.rating,
      comment: formData.comment,
      createdAt: formData.createdAt,
      status: formData.status as 'pending' | 'approved' | 'disapproved',
    });
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {item ? "Edit Comment/Review" : "Add Comment/Review"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Book</label>
              {item ? (
                <input
                  type="text"
                  name="bookId"
                  value={item.bookId?.title || item.bookId?._id || "Unknown"}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  readOnly
                />
              ) : (
                <select
                  name="bookId"
                  value={formData.bookId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} ({book.categoryName})
                    </option>
                  ))}
                </select>
              )}
              {errors.bookId && <p className="text-red-500 text-sm mt-1">{errors.bookId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                placeholder="Category Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                readOnly
              />
              {errors.categoryName && <p className="text-red-500 text-sm mt-1">{errors.categoryName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Rating (1-5)"
                min="1"
                max="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Comment/Review"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-40 resize-y"
                required
              />
              {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="disapproved">Disapproved</option>
              </select>
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
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}