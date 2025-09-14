"use client";

import { useState, useEffect } from "react";


import Image from "next/image";
import { Content } from "../../order-product-management/types";

interface Category {
  _id: string;
  name: string;
  path: string;
  children: Category[];
}

interface ContentFormProps {
  content?: Content;
  onClose: () => void;
  onSave: (data: Content) => Promise<void>;
  categories: Category[];
}

export const ContentForm: React.FC<ContentFormProps> = ({ content, onClose, onSave, categories }) => {
  const defaultImageUrl = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";
  const [formData, setFormData] = useState<Content>({
    id: content?.id || "",
    title: content?.title || "",
    categoryPath: content?.categoryPath || "",
    categoryName: content?.categoryName || "",
    subCategory: content?.subCategory || "",
    tags: content?.tags || "",
    seoTitle: content?.seoTitle || "",
    seoDescription: content?.seoDescription || "",
    price: content?.price || 0,
    description: content?.description || "",
    estimatedDelivery: content?.estimatedDelivery || "",
    condition: content?.condition || "NEW - ORIGINAL PRICE",
    author: content?.author || "",
    publisher: content?.publisher || "",
    imageUrl: content?.imageUrl || defaultImageUrl,
    quantityNew: content?.quantityNew || 0,
    quantityOld: content?.quantityOld || 0,
    discountNew: content?.discountNew || 0,
    discountOld: content?.discountOld || 0,
  });
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryLevels, setCategoryLevels] = useState<string[]>(formData.categoryPath ? formData.categoryPath.split("/") : []);

  useEffect(() => {
    setCategoryLevels(formData.categoryPath ? formData.categoryPath.split("/") : []);
  }, [formData.categoryPath]);

  const handleCategoryChange = (level: number, value: string) => {
    const newLevels = [...categoryLevels.slice(0, level), value];
    setCategoryLevels(newLevels);
    setFormData((prev) => ({ ...prev, categoryPath: newLevels.join("/") }));
  };

  const getCategoriesForLevel = (level: number): Category[] => {
    let currentCategories = categories;
    for (let i = 0; i < level && i < categoryLevels.length; i++) {
      const selected = categoryLevels[i];
      const parent = currentCategories.find((cat) => cat.name === selected);
      currentCategories = parent ? (parent.children || []) : [];
    }
    return currentCategories;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]:
          name === "price" || name === "quantityNew" || name === "quantityOld" || name === "discountNew" || name === "discountOld"
            ? parseFloat(value) || 0
            : value,
      };
      if (name === "condition") {
        if (value === "NEW - ORIGINAL PRICE") {
          return { ...newData, quantityOld: 0, discountOld: 0 };
        } else if (value === "OLD") {
          return { ...newData, quantityNew: 0, discountNew: 0 };
        }
      }
      return newData;
    });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
      setError("");
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (imageFile) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        setError("Cloudinary configuration is missing. Using default image.");
        return defaultImageUrl;
      }

      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);
        formData.append("folder", "bookstore");
        formData.append("transformation", JSON.stringify([{ height: 300, crop: "fill" }]));
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to upload image to Cloudinary: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
      } catch (err) {
        if (err instanceof Error) {
          
        setError(`Failed to upload image: ${err.message}. Using default image.`);
        return defaultImageUrl;
          
        } else {
          
        setError(`Failed to upload image: ${err}. Using default image.`);
        return defaultImageUrl;
        }
      }
    }

    return formData.imageUrl || defaultImageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requiredFields = [
        "title",
        "categoryPath",
        "tags",
        "price",
        "description",
        "estimatedDelivery",
        "condition",
        "author",
        "publisher",
      ];

      if (requiredFields.some((field) => !formData[field as keyof typeof formData])) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      if (formData.price <= 0) {
        setError("Price must be greater than 0");
        setIsSubmitting(false);
        return;
      }

      if (!["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(formData.condition)) {
        setError("Invalid condition selected");
        setIsSubmitting(false);
        return;
      }

      if ((formData.discountNew ?? 0) < 0 || (formData.discountNew ?? 0) > 100) {
        setError("Discount for new books must be between 0 and 100 percent");
        setIsSubmitting(false);
        return;
      }

      if ((formData.discountOld ?? 0) < 0 || (formData.discountOld ?? 0) > 100) {
        setError("Discount for old books must be between 0 and 100 percent");
        setIsSubmitting(false);
        return;
      }

      const imageUrl = await handleImageUpload();
      if (!imageUrl) {
        setError("Failed to process image");
        setIsSubmitting(false);
        return;
      }

      const dataToSend: Content = {
        ...formData,
        tags: formData.tags,
        imageUrl,
        quantityNew: formData.quantityNew ?? 0,
        quantityOld: formData.quantityOld ?? 0,
        discountNew: formData.discountNew ?? 0,
        discountOld: formData.discountOld ?? 0,
        categoryPath: formData.categoryPath,
      };

      await onSave(dataToSend);
      setError("");
      setIsSubmitting(false);
      onClose();
    } catch (err) {
     if (err instanceof Error) {
       
      setError(err.message);
      setIsSubmitting(false);
      
     } else {
       
      setError( "Failed to save content");
      setIsSubmitting(false);
     }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-yellow-50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {formData.id ? "Edit Book" : "Create New Book"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Path *</label>
              {categoryLevels.map((levelValue, index) => (
                <select
                  key={`category-level-${index}`}
                  value={levelValue || ""}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-2"
                  required
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Select level {index + 1} category
                  </option>
                  {getCategoriesForLevel(index).map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ))}
              {getCategoriesForLevel(categoryLevels.length).length > 0 && (
                <select
                  value=""
                  onChange={(e) => handleCategoryChange(categoryLevels.length, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Select next level category (optional)
                  </option>
                  {getCategoriesForLevel(categoryLevels.length).map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated) *</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Physics, Beginner, Science"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publisher *</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0.01"
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                <option value="NEW - ORIGINAL PRICE">NEW - ORIGINAL PRICE</option>
                <option value="OLD">OLD</option>
                <option value="BOTH">BOTH</option>
              </select>
            </div>

            {formData.condition === "NEW - ORIGINAL PRICE" || formData.condition === "BOTH" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Quantity</label>
                  <input
                    type="number"
                    name="quantityNew"
                    value={formData.quantityNew}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount for New Books (%)</label>
                  <input
                    type="number"
                    name="discountNew"
                    value={formData.discountNew}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g., 10"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            ) : null}

            {formData.condition === "OLD" || formData.condition === "BOTH" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Old Quantity</label>
                  <input
                    type="number"
                    name="quantityOld"
                    value={formData.quantityOld}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount for Old Books (%)</label>
                  <input
                    type="number"
                    name="discountOld"
                    value={formData.discountOld}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g., 35"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              <div className="mt-2">
                <Image
                width={200}
                height={190}
                  src={formData.imageUrl || defaultImageUrl}
                  alt="Preview"
                  className="h-48 w-auto object-cover rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery *</label>
              <input
                type="text"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : formData.id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};