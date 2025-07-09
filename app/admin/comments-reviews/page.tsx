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
      content: "Great book, highly recommend!",
      author: "John Doe",
      bookName: "post1",
      isApproved: true,
      isSpam: false,
      createdAt: new Date().toISOString(),
      seoTitle: "Book Review Comment",
      seoDescription: "User review for a great book.",
    },
    {
      id: "2",
      content: "Spam content detected here.",
      author: "SpamBot",
      bookName: "post2",
      isApproved: false,
      isSpam: true,
      createdAt: new Date().toISOString(),
      seoTitle: "Spam Comment",
      seoDescription: "Potential spam detected.",
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<CommentReview | null>(null);
  const [isModerating, setIsModerating] = useState<boolean>(false);

  const handleEdit = (item: CommentReview) => {
    setSelectedItem(item);
    setIsModerating(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
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
    } else {
      setItems((prev) => [...prev, newItem]);
    }
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Comments & Reviews - Books Store</h1>
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Add Comment
        </button>
      </div>
      <CommentReviewList onEdit={handleEdit} onDelete={handleDelete} items={items} />
      {isModerating && (
        <CommentReviewForm
          item={selectedItem ?? undefined}
          onClose={() => {
            setSelectedItem(null);
            setIsModerating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}