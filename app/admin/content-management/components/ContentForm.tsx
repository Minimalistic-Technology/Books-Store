//ContentForm.tsx
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(content?.media instanceof File ? URL.createObjectURL(content.media) : null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
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
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.tags.trim()) newErrors.tags = "Tags are required";
    if (!formData.seoTitle.trim()) newErrors.seoTitle = "SEO Title is required";
    if (!formData.seoDescription.trim()) newErrors.seoDescription = "SEO Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
    <div className="fixed inset-0 bg-yellow-500 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-2xl w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {content ? "Edit Content" : "Create Content"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Content (Rich text support placeholder)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-40 resize-y"
                required
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>
            <div>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma-separated)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
            </div>
            <div>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="SEO Title"
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
                placeholder="SEO Description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-y"
                required
              />
              {errors.seoDescription && <p className="text-red-500 text-sm mt-1">{errors.seoDescription}</p>}
            </div>
          </div>
          <div
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center bg-white hover:border-teal-500 transition-colors"
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
              className="mt-2 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-all"
            >
              Choose File
            </button>
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
