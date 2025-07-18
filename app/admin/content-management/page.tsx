"use client";

import { useState, useEffect, useCallback } from "react";
import ContentList from "./components/ContentList";
import { ContentForm } from "./components/ContentForm";

interface Content {
  id?: string;
  title: string;
  categoryName: string;
  subCategory: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  price: number;
  description: string;
  estimatedDelivery: string;
  condition: string;
  author: string;
  publisher: string;
  imageUrl: string;
  quantityNew: number;
  quantityOld: number;
  discountNew: number;
  discountOld: number;
  bookName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  _id: string;
  name: string;
  tags: string[];
}

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [tagToEdit, setTagToEdit] = useState<string>("");
  const [editTag, setEditTag] = useState<string>("");

  const fetchCategoriesAndContents = useCallback(async () => {
    setIsLoading(true);
    try {
      const categoriesResponse = await fetch("http://localhost:5000/api/bookstore/book-categories");
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      const allBooks: Content[] = [];
      const fetchPromises = categoriesData.map(async (category: Category) => {
        try {
          const booksResponse = await fetch(
            `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(category.name)}`
          );
          if (!booksResponse.ok) {
            console.warn(`Failed to fetch books for ${category.name}`);
            return [];
          }
          const booksData = await booksResponse.json();
          const books = Array.isArray(booksData.books) ? booksData.books : [];
          return books.map((book: any) => ({
            id: book._id,
            title: book.title || "",
            categoryName: category.name,
            subCategory: book.subCategory || "",
            tags: Array.isArray(book.tags) ? book.tags.join(", ") : book.tags || "",
            seoTitle: book.seoTitle || "",
            seoDescription: book.seoDescription || "",
            price: book.price || 0,
            description: book.description || "",
            estimatedDelivery: book.estimatedDelivery || "",
            condition: book.condition || "NEW - ORIGINAL PRICE",
            author: book.author || "",
            publisher: book.publisher || "",
            imageUrl: book.imageUrl || "",
            quantityNew: book.quantityNew || 0,
            quantityOld: book.quantityOld || 0,
            discountNew: book.discountNew || 0,
            discountOld: book.discountOld || 0,
            bookName: book.bookName || "",
            createdAt: book.createdAt || "",
            updatedAt: book.updatedAt || "",
          }));
        } catch (error) {
          console.error(`Error fetching books for category ${category.name}:`, error);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      allBooks.push(...results.flat());
      setContents(allBooks);
    } catch (err: any) {
      setError(err.message || "Failed to load categories or books");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndContents();
  }, [fetchCategoriesAndContents]);

  useEffect(() => {
    const fetchTags = async () => {
      if (!selectedCategory) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch tags");
        }
        const data = await response.json();
        setCategories((prev) =>
          prev.map((cat) =>
            cat.name === selectedCategory ? { ...cat, tags: data.tags || [] } : cat
          )
        );
        setError("");
      } catch (err: any) {
        setError(err.message || `Failed to load tags for ${selectedCategory}`);
        setTimeout(() => setError(""), 5000);
      }
    };
    fetchTags();
  }, [selectedCategory]);

  const handleSave = async (data: Content) => {
    try {
      setIsLoading(true);
      const isUpdate = Boolean(data.id);
      const url = isUpdate
        ? `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(data.categoryName)}/${data.id}`
        : `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(data.categoryName)}`;
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: typeof data.tags === "string" ? data.tags.split(",").map((tag) => tag.trim()) : data.tags,
          discountNew: data.discountNew ?? 0,
          discountOld: data.discountOld ?? 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isUpdate ? "update" : "create"} book`);
      }

      const savedBook = await response.json();
      const bookData = Array.isArray(savedBook) ? savedBook[0] : savedBook;

      const updatedBook: Content = {
        id: bookData._id,
        title: bookData.title,
        categoryName: data.categoryName,
        subCategory: bookData.subCategory,
        tags: Array.isArray(bookData.tags) ? bookData.tags.join(", ") : bookData.tags || "",
        seoTitle: bookData.seoTitle || "",
        seoDescription: bookData.seoDescription || "",
        price: bookData.price,
        description: bookData.description,
        estimatedDelivery: bookData.estimatedDelivery,
        condition: bookData.condition,
        author: bookData.author,
        publisher: bookData.publisher,
        imageUrl: bookData.imageUrl,
        quantityNew: bookData.quantityNew || 0,
        quantityOld: bookData.quantityOld || 0,
        discountNew: bookData.discountNew || 0,
        discountOld: bookData.discountOld || 0,
        bookName: bookData.bookName || "",
        createdAt: bookData.createdAt || "",
        updatedAt: bookData.updatedAt || "",
      };

      setContents((prev) =>
        isUpdate
          ? prev.map((content) => (content.id === data.id ? updatedBook : content))
          : [...prev, updatedBook]
      );
      setSuccessMessage(`Book ${isUpdate ? "updated" : "created"} successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsFormOpen(false);
      setEditingContent(undefined);
      await fetchCategoriesAndContents(); // Refresh categories to include new tags
    } catch (err: any) {
      setError(err.message || `Failed to ${data.id ? "update" : "create"} book`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(categoryName)}/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete book");
      setContents((prev) => prev.filter((content) => content.id !== id));
      setSuccessMessage("Book deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete book");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!selectedCategory || !newTag.trim()) {
      setError("Please select a category and enter a tag");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: newTag.trim() }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create tag");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory ? { ...cat, tags: data.tags || [] } : cat
        )
      );
      setNewTag("");
      setSuccessMessage(`Tag '${newTag}' added successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create tag");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!selectedCategory || !tagToEdit || !editTag.trim()) {
      setError("Please select a category, tag to edit, and new tag value");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags/${encodeURIComponent(tagToEdit)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTag: editTag.trim() }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update tag");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory ? { ...cat, tags: data.tags || [] } : cat
        )
      );
      setTagToEdit("");
      setEditTag("");
      setSuccessMessage(`Tag updated to '${editTag}' successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update tag");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedCategory || !tagToEdit) {
      setError("Please select a category and tag to delete");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!confirm(`Are you sure you want to delete the tag '${tagToEdit}'?`)) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags/${encodeURIComponent(tagToEdit)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete tag");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory ? { ...cat, tags: data.tags || [] } : cat
        )
      );
      setTagToEdit("");
      setEditTag("");
      setSuccessMessage(`Tag '${tagToEdit}' deleted successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete tag");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <button
          onClick={() => {
            setEditingContent(undefined);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-teal-500 text-black rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          Create New Book
        </button>
      </div>

      {successMessage && (
        <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Tags</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-800 font-medium mb-2">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-2">Add New Tag</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new tag"
                disabled={isLoading || !selectedCategory}
              />
              <button
                onClick={handleCreateTag}
                disabled={isLoading || !selectedCategory || !newTag.trim()}
                className="px-4 py-2 bg-teal-600 text-black rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Tag
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-2">Edit/Delete Tag</label>
            <div className="flex gap-2">
              <select
                value={tagToEdit}
                onChange={(e) => setTagToEdit(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading || !selectedCategory}
              >
                <option value="" disabled>
                  Select tag to edit/delete
                </option>
                {categories
                  .find((cat) => cat.name === selectedCategory)
                  ?.tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="New tag value"
                disabled={isLoading || !tagToEdit}
              />
              <button
                onClick={handleUpdateTag}
                disabled={isLoading || !selectedCategory || !tagToEdit || !editTag.trim()}
                className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Tag
              </button>
              <button
                onClick={handleDeleteTag}
                disabled={isLoading || !selectedCategory || !tagToEdit}
                className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ContentForm
              content={editingContent}
              onClose={() => {
                setIsFormOpen(false);
                setEditingContent(undefined);
              }}
              onSave={handleSave}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
}