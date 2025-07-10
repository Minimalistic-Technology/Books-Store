// app/admin/comments-reviews/page.tsx
"use client";

import { useState } from "react";
import CommentReviewForm from "./components/CommentReviewForm";
import CommentReviewList from "./components/CommentReviewList";

// Define the CommentReview interface
export interface CommentReview {
  id: string;
  content: string;
  author: string;
  bookName: string;
  isApproved: boolean;
  isSpam: boolean;
  createdAt: string;
  seoTitle: string;
  seoDescription: string;
}

export default function CommentsReviews() {
  const [items, setItems] = useState<CommentReview[]>([
    {
      id: "1",
      content: "This book is a masterpiece! The plot twists kept me hooked till the end.",
      author: "Alice Johnson",
      bookName: "The Silent Forest",
      isApproved: true,
      isSpam: false,
      createdAt: new Date("2025-07-05T10:00:00Z").toISOString(),
      seoTitle: "Review: The Silent Forest",
      seoDescription: "Alice Johnson's review of The Silent Forest book.",
    },
    {
      id: "2",
      content: "Amazing read, highly recommend to all fantasy lovers!",
      author: "Bob Smith",
      bookName: "Dragon's Legacy",
      isApproved: false,
      isSpam: false,
      createdAt: new Date("2025-07-06T14:30:00Z").toISOString(),
      seoTitle: "Dragon's Legacy Review",
      seoDescription: "Bob Smith's review of the fantasy novel Dragon's Legacy.",
    },
    {
      id: "3",
      content: "Buy cheap pills now!!! Click here!!!",
      author: "UnknownUser123",
      bookName: "Random Book",
      isApproved: false,
      isSpam: true,
      createdAt: new Date("2025-07-07T09:15:00Z").toISOString(),
      seoTitle: "Spam Comment",
      seoDescription: "Potential spam comment detected.",
    },
    {
      id: "4",
      content: "The characters were well-developed, but the ending felt rushed.",
      author: "Clara Brown",
      bookName: "Echoes of Time",
      isApproved: true,
      isSpam: false,
      createdAt: new Date("2025-07-08T16:45:00Z").toISOString(),
      seoTitle: "Echoes of Time Review",
      seoDescription: "Clara Brown's critique of Echoes of Time.",
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<CommentReview | null>(null);
  const [isModerating, setIsModerating] = useState<boolean>(false);

  const handleEdit = (item: CommentReview) => {
    setSelectedItem(item);
    setIsModerating(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (data: {
    id?: string;
    content: string;
    author: string;
    bookName: string;
    isApproved: boolean;
    isSpam: boolean;
    createdAt?: string;
    seoTitle: string;
    seoDescription: string;
  }) => {
    const newItem: CommentReview = {
      id: data.id || Date.now().toString(),
      content: data.content,
      author: data.author,
      bookName: data.bookName,
      isApproved: data.isApproved,
      isSpam: data.isSpam,
      createdAt: data.createdAt || new Date().toISOString(),
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    };
    if (selectedItem) {
      setItems((prev) => prev.map((item) => (item.id === selectedItem.id ? newItem : item)));
    }
    // Note: For new comments, this should be handled via backend creation, not client-side addition
  };

  const handleClose = () => {
    setSelectedItem(null);
    setIsModerating(false);
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Comments & Reviews - Books Store</h1>
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