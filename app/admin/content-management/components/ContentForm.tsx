"use client";

import { useState, useEffect } from "react";

interface ContentFormProps {
  content?: {
    id?: string;
    title: string;
    body: string;
    category: string;
    subCategory: string;
    tags: string;
    seoTitle: string;
    seoDescription: string;
    media: File | null;
    price: number;
    description: string;
    estimatedDelivery: string;
    condition: string;
    author: string;
    publisher: string;
    imageUrl?: string;
  };
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    body: string;
    category: string;
    subCategory: string;
    tags: string;
    seoTitle: string;
    seoDescription: string;
    media: File | null;
    price: number;
    description: string;
    estimatedDelivery: string;
    condition: string;
    author: string;
    publisher: string;
    imageUrl?: string;
  }) => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({ content, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: content?.id || "",
    title: content?.title || "",
    body: content?.body || "",
    category: content?.category || "",
    subCategory: content?.subCategory || "",
    tags: content?.tags || "",
    seoTitle: content?.seoTitle || "",
    seoDescription: content?.seoDescription || "",
    media: content?.media || null,
    price: content?.price || 0,
    description: content?.description || "",
    estimatedDelivery: content?.estimatedDelivery || "",
    condition: content?.condition || "NEW - ORIGINAL PRICE",
    author: content?.author || "",
    publisher: content?.publisher || "",
    imageUrl: content?.imageUrl || "",
  });
  const [categories, setCategories] = useState<{ name: string; tags: string[] }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>(content?.imageUrl ? content.imageUrl.split('/').pop() || "" : "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookstore/book-categories");
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.statusText}`);
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      if (!formData.category) {
        setTags([]);
        return;
      }
      try {
        const url = `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(formData.category)}/tags`;
        console.log(`Fetching tags from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Tags fetch error: ${JSON.stringify(errorData)}`);
          throw new Error(errorData.error || `Failed to fetch tags: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`Tags fetched for ${formData.category}:`, data.tags);
        setTags(data.tags || []);
        setError("");
      } catch (err: any) {
        console.error("Error fetching tags:", err);
        setError(`Failed to load tags for ${formData.category}: ${err.message}`);
        setTags([]);
      }
    };
    fetchTags();
  }, [formData.category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, media: file }));
    setFileName(file ? file.name : "");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.title || !formData.category || !formData.subCategory || !formData.description || !formData.author || !formData.publisher) {
        setError("Please fill in all required fields: Title, Category, Subcategory, Description, Author, Publisher");
        setIsSubmitting(false);
        return;
      }
      if (formData.price <= 0) {
        setError("Price must be greater than 0");
        setIsSubmitting(false);
        return;
      }
      if (!formData.media && !formData.id && !formData.imageUrl) {
        setError("Image is required for new books");
        setIsSubmitting(false);
        return;
      }
      if (!['NEW - ORIGINAL PRICE', 'OLD - 35% OFF', 'BOTH'].includes(formData.condition)) {
        setError("Invalid condition selected");
        setIsSubmitting(false);
        return;
      }
      await onSave({
        ...formData,
        body: formData.description,
      });
      setError("");
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error("Error saving content:", err);
      setError(err.message || "Failed to save content");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      <h2 className="text-2xl font-semibold text-yellow-900">
        {formData.id ? "Edit Book" : "Create Book"}
      </h2>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
      <div>
        <label className="block text-gray-800 font-medium">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={isSubmitting}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Subcategory *</label>
        <select
          name="subCategory"
          value={formData.subCategory}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={isSubmitting || !formData.category}
        >
          <option value="" disabled>
            Select a subcategory
          </option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="e.g., Fiction, Novels"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Price *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          min="0.01"
          step="0.01"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Image Upload {formData.id ? "" : "*"}</label>
        <input
          type="file"
          name="media"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          accept="image/*"
          disabled={isSubmitting}
        />
        {fileName && <p className="text-gray-600 mt-1">Selected: {fileName}</p>}
        {formData.imageUrl && !formData.media && (
          <p className="text-gray-600 mt-1">Current: {formData.imageUrl.split('/').pop()}</p>
        )}
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Estimated Delivery *</label>
        <input
          type="text"
          name="estimatedDelivery"
          value={formData.estimatedDelivery}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="e.g., 3-5 days"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Condition *</label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={isSubmitting}
        >
          <option value="NEW - ORIGINAL PRICE">NEW - ORIGINAL PRICE</option>
          <option value="OLD - 35% OFF">OLD - 35% OFF</option>
          <option value="BOTH">BOTH</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Author *</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">Publisher *</label>
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">SEO Title</label>
        <input
          type="text"
          name="seoTitle"
          value={formData.seoTitle}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium">SEO Description</label>
        <textarea
          name="seoDescription"
          value={formData.seoDescription}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};