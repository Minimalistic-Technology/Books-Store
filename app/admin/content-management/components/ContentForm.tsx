"use client";

import { useState, useRef } from "react";

type ContentFormProps = {
  content?: {
    id?: string;
    title?: string;
    content?: string;
    category?: string;
    tags?: string;
    seoTitle?: string;
    seoDescription?: string;
    media?: File | null;
  };
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    content: string;
    category: string;
    tags: string;
    seoTitle: string;
    seoDescription: string;
    media: File | null;
  }) => void;
};

interface FormData {
  title: string;
  content: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  media: File | null;
}

export default function ContentForm({ content, onClose, onSave }: ContentFormProps) {
  const [formData, setFormData] = useState({
    id: content?.id || "",
    title: content?.title || "",
    content: content?.content || "",
    category: content?.category || "",
    tags: content?.tags || "",
    seoTitle: content?.seoTitle || "",
    seoDescription: content?.seoDescription || "",
    media: content?.media || null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(content?.media instanceof File ? URL.createObjectURL(content.media) : null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, media: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      id: formData.id,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      media: formData.media,
    });
    onClose();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, media: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-[#fff3cd] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto" style={{ maxHeight: "80vh" }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {content ? "Edit Content" : "Create Content"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Content (Rich text support placeholder)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-y"
              required
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Tags (comma-separated)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="SEO Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder="SEO Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-y"
            />
          </div>
          <div
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center bg-white hover:border-blue-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-40 mx-auto mb-2" />
            ) : (
              <p className="text-gray-600">Drag and drop an image here, or click to choose a file</p>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Choose File
            </button>
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