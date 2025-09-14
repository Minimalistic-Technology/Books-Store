"use client";

import { useState, useEffect } from "react";
import CommentReviewForm from "./components/CommentReviewForm";
import CommentReviewList from "./components/CommentReviewList";
import { API_BASE_URL } from '../../../utils/api';
import { Book, BookstoreReview, Category } from "../order-product-management/types";

// Define the BookstoreReview interface


export default function CommentsReviews() {
  const [items, setItems] = useState<BookstoreReview[]>([]);
  const [books, setBooks] = useState<{ _id: string; title: string; categoryName: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<BookstoreReview | null>(null);
  const [isModerating, setIsModerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch books for dropdown
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/book-categories?t=` + new Date().getTime(), {
        cache: "no-store",
        credentials:"include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      const books = data.flatMap((category:Category) =>
        category.books.map((book:Book) => ({
          _id: book._id,
          title: book.title,
          categoryName: category.name,
        }))
      );
      setBooks(books);
    } catch {
      setError("Failed to load books. Please try again.");
      
    }
  };

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews?t=` + new Date().getTime(), {
        cache: "no-store",
        credentials:"include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch reviews");
      }
      const data = await response.json();
      const reviews: BookstoreReview[] = data.map((review: BookstoreReview) => ({
        id: review._id,
        bookId: {
          _id: review.bookId?._id || review.bookId,
          title: review.bookId?.title || "Unknown Book",
        },
        categoryName: review.categoryName,
        name: review.name,
        email: review.email,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        status: review.status,
      }));
      setItems(reviews);
      setError(null);
    } catch  {
      setError("Failed to load reviews. Please try again.");
      
    }
  };

  // Fetch books and reviews on mount
  useEffect(() => {
    fetchBooks();
    fetchReviews();
  }, []);

  const handleEdit = (item: BookstoreReview) => {
    setSelectedItem(item);
    setIsModerating(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials:"include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete review");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err) {
      if(err instanceof Error){
        
        setError(err.message || 'Failed to load category or books. Please try again later')
      }
      setError("Failed to delete review. Please try again.");
      
    }
  };

  const handleSave = async (data: {
    id?: string;
    bookId: string;
    categoryName: string;
    name: string;
    email: string;
    rating: number;
    comment: string;
    createdAt?: string;
    status?: 'pending' | 'approved' | 'disapproved';
  }) => {
    try {
      const reviewData = {
        bookId: data.bookId,
        categoryName: data.categoryName,
        name: data.name,
        email: data.email,
        rating: data.rating,
        comment: data.comment,
        status: data.status || "pending",
      };

      let response;
      if (data.id) {
        // Update existing review (only editable fields)
        response = await fetch(`${API_BASE_URL}/reviews/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: data.rating, comment: data.comment, status: data.status }),
          credentials:"include"
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update review");
        }
      } else {
        // Create new review
        response = await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
          credentials:"include"
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to create review");
        }
      }

      // Fetch reviews to sync state
      await fetchReviews();
      setError(null);
    } catch  {
      setError(data.id ? "Failed to update review. Please try again." : "Failed to create review. Please try again.");
      
    }
    setSelectedItem(null);
    setIsModerating(false);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setIsModerating(false);
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Comments & Reviews - Books Store</h1>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg animate__fadeIn">
          {error}
        </div>
      )}
      <button
        onClick={() => setIsModerating(true)}
        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all"
      >
        Add New Review
      </button>
      <CommentReviewList onEdit={handleEdit} onDelete={handleDelete} items={items} />
      {isModerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
          <div className="card bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate__zoomIn">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <CommentReviewForm
              item={selectedItem ?? undefined}
              onClose={handleClose}
              onSave={handleSave}
              books={books}
            />
          </div>
        </div>
      )}
    </div>
  );
}