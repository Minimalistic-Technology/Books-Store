// app/admin/content-management/page.tsx
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
    setIsCreating(false);
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
      {(isCreating || selectedContent) && (
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
          onClose={() => {
            setSelectedContent(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}