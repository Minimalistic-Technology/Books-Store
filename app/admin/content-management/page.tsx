'use client'
import { useState } from "react";
import ContentForm from "./components/ContentForm";
import ContentList from "./components/ContentList";

// Define the Content interface
export interface Content {
  id: string;
  title: string;
  body: string;
  category?: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  media?: File | null;
}

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setIsCreating(true);
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setContents((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (data: {
    id?: string;
    title: string;
    content: string;
    category: string;
    tags: string;
    seoTitle: string;
    seoDescription: string;
    media: File | null;
  }) => {
    const newContent: Content = {
      id: data.id || Date.now().toString(),
      title: data.title,
      body: data.content,
      category: data.category,
      tags: data.tags,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      media: data.media,
    };
    if (selectedContent) {
      setContents((prev) =>
        prev.map((item) => (item.id === selectedContent.id ? newContent : item))
      );
    } else {
      setContents((prev) => [...prev, newContent]);
    }
    setIsCreating(false);
    setSelectedContent(null);
  };

  const handleClose = () => {
    setIsCreating(false);
    setSelectedContent(null);
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Content Management - Books Store</h1>
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Create New Content
        </button>
      </div>
      <ContentList onEdit={handleEdit} onDelete={handleDelete} contents={contents} />
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
          <div className="card bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative animate__zoomIn">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <ContentForm
              content={
                selectedContent
                  ? {
                      id: selectedContent.id,
                      title: selectedContent.title,
                      content: selectedContent.body,
                      category: selectedContent.category || "",
                      tags: selectedContent.tags || "",
                      seoTitle: selectedContent.seoTitle || "",
                      seoDescription: selectedContent.seoDescription || "",
                      media: selectedContent.media || null,
                    }
                  : undefined
              }
              onClose={handleClose}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}