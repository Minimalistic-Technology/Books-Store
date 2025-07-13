"use client";

import { useState, useEffect } from "react";
import CommentReviewForm from "./components/CommentReviewForm";
import CommentReviewList from "./components/CommentReviewList";

// Define the CommentReview interface
export interface CommentReview {
  id: string;
  content: string;
  author: string;
  email: string;
  rating: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'disapproved'; // Add status field
}

export default function CommentsReviews() {
  const [items, setItems] = useState<CommentReview[]>([]);
  const [selectedItem, setSelectedItem] = useState<CommentReview | null>(null);
  const [isModerating, setIsModerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookstore/reviews");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      const reviews: CommentReview[] = data.map((review: any) => ({
        id: review._id,
        content: review.review,
        author: review.name,
        email: review.email,
        rating: review.rating,
        createdAt: review.createdAt,
        status: review.status, // Map the status field
      }));
      setItems(reviews);
      setError(null);
    } catch (err) {
      setError("Failed to load reviews. Please try again.");
      console.error("Error fetching reviews:", err);
    }
  };

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []); // Empty dependency array to run only on mount

  const handleEdit = (item: CommentReview) => {
    setSelectedItem(item);
    setIsModerating(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookstore/reviews/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete review. Please try again.");
      console.error("Error deleting review:", err);
    }
  };

  const handleSave = async (data: {
    id?: string;
    content: string;
    author: string;
    email: string;
    rating: number;
    createdAt?: string;
    status?: 'pending' | 'approved' | 'disapproved';
  }) => {
    try {
      const reviewData = {
        review: data.content,
        name: data.author,
        email: data.email,
        rating: data.rating,
        status: data.status, // Include status in the payload
      };

      let response;
      if (data.id) {
        // Update existing review
        response = await fetch(`http://localhost:5000/api/bookstore/reviews/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
        if (!response.ok) {
          throw new Error("Failed to update review");
        }
      } else {
        // Create new review
        response = await fetch("http://localhost:5000/api/bookstore/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
        if (!response.ok) {
          throw new Error("Failed to create review");
        }
      }

      // Fetch reviews to ensure state is in sync with database
      await fetchReviews();
      setError(null);
    } catch (err) {
      setError(data.id ? "Failed to update review. Please try again." : "Failed to create review. Please try again.");
      console.error("Error saving review:", err);
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
      {/* <button
        onClick={() => setIsModerating(true)}
        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all"
      >
        Add New Review
      </button> */}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}