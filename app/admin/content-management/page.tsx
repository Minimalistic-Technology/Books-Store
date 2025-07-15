"use client";

import { useState, useEffect } from "react";
import { ContentForm } from "./components/ContentForm";
import ContentList from "./components/ContentList";

export interface Content {
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
}

interface Category {
  _id: string;
  name: string;
  tags: string[];
}

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [editTag, setEditTag] = useState<string>("");
  const [tagToEdit, setTagToEdit] = useState<string>("");
  const [tagError, setTagError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchCategoriesAndContents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookstore/book-categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await response.json();
        setCategories(categoriesData);

        const allBooks: Content[] = [];
        for (const category of categoriesData) {
          const catResponse = await fetch(`http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(category.name)}`);
          if (!catResponse.ok) throw new Error(`Failed to fetch books for ${category.name}`);
          const catData = await catResponse.json();
          const books = catData.books.map((item: any) => ({
            id: item._id,
            title: item.title || "",
            body: item.description || "",
            category: category.name,
            subCategory: item.subCategory || "",
            tags: item.tags ? item.tags.join(",") : "",
            seoTitle: item.seoTitle || "",
            seoDescription: item.seoDescription || "",
            media: null,
            price: item.price || 0,
            description: item.description || "",
            estimatedDelivery: item.estimatedDelivery || "",
            condition: item.condition || "NEW - ORIGINAL PRICE",
            author: item.author || "",
            publisher: item.publisher || "",
            imageUrl: item.imageUrl || "http://example.com/default.jpg",
          }));
          allBooks.push(...books);
        }
        setContents(allBooks);
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        setTagError(error.message || "Failed to load categories or books");
        setTimeout(() => setTagError(""), 5000);
      }
    };

    fetchCategoriesAndContents();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      if (!selectedCategory) return;
      try {
        const url = `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags`;
        console.log(`Fetching tags for category: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Tags fetch error for ${selectedCategory}: ${JSON.stringify(errorData)}`);
          throw new Error(errorData.error || "Failed to fetch tags");
        }
        const data = await response.json();
        console.log(`Tags fetched for ${selectedCategory}:`, data.tags);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.name === selectedCategory ? { ...cat, tags: data.tags || [] } : cat
          )
        );
        setTagError("");
      } catch (error: any) {
        console.error("Failed to fetch tags:", error);
        setTagError(error.message || `Failed to load tags for ${selectedCategory}`);
        setTimeout(() => setTagError(""), 5000);
      }
    };
    fetchTags();
  }, [selectedCategory]);

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setIsCreating(true);
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setIsCreating(true);
  };

  const handleClose = () => {
    setIsCreating(false);
    setSelectedContent(null);
  };

  const handleDelete = async (content: Content) => {
    try {
      if (!content.category || !content.id) {
        throw new Error("Category and book ID are required to delete the book");
      }
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(content.category)}/${content.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete book");
      }
      setContents((prev) => prev.filter((item) => item.id !== content.id));
      setSuccessMessage("Book deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error deleting book:", error);
      setTagError(error.message || "Failed to delete book");
      setTimeout(() => setTagError(""), 3000);
    }
  };

  const handleSave = async (data: Content) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("categoryName", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("tags", data.tags);
      formData.append("price", data.price.toString());
      formData.append("description", data.description);
      formData.append("estimatedDelivery", data.estimatedDelivery);
      formData.append("condition", data.condition);
      formData.append("author", data.author);
      formData.append("publisher", data.publisher);
      if (data.media) {
        formData.append("image", data.media);
      }
      formData.append("seoTitle", data.seoTitle);
      formData.append("seoDescription", data.seoDescription);

      const url = data.id
        ? `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(data.category)}/${data.id}`
        : `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(data.category)}`;
      const method = data.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${data.id ? "update" : "create"} book`);
      }

      const savedBook = await response.json();
      const updatedBook: Content = {
        id: savedBook._id || data.id,
        title: savedBook.title,
        body: savedBook.description,
        category: savedBook.categoryName,
        subCategory: savedBook.subCategory,
        tags: savedBook.tags ? savedBook.tags.join(",") : "",
        seoTitle: savedBook.seoTitle || data.seoTitle,
        seoDescription: savedBook.seoDescription || data.seoDescription,
        media: null,
        price: savedBook.price,
        description: savedBook.description,
        estimatedDelivery: savedBook.estimatedDelivery,
        condition: savedBook.condition,
        author: savedBook.author,
        publisher: savedBook.publisher,
        imageUrl: savedBook.imageUrl,
      };

      setContents((prev) =>
        data.id
          ? prev.map((item) => (item.id === data.id ? updatedBook : item))
          : [...prev, updatedBook]
      );
      setSuccessMessage(`Book ${data.id ? "updated" : "created"} successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
      handleClose();
    } catch (error: any) {
      console.error(`Error ${data.id ? "updating" : "creating"} book:`, error);
      setTagError(error.message || `Failed to ${data.id ? "update" : "create"} book`);
      setTimeout(() => setTagError(""), 3000);
    }
  };

  const handleCreateTag = async () => {
    if (!selectedCategory || !newTag) {
      setTagError("Please select a category and enter a tag");
      setTimeout(() => setTagError(""), 3000);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: newTag }),
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
    } catch (error: any) {
      console.error("Error creating tag:", error);
      setTagError(error.message || "Failed to create tag");
      setTimeout(() => setTagError(""), 3000);
    }
  };

  const handleUpdateTag = async () => {
    if (!selectedCategory || !tagToEdit || !editTag) {
      setTagError("Please select a category, tag to edit, and new tag value");
      setTimeout(() => setTagError(""), 3000);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookstore/book-categories/${encodeURIComponent(selectedCategory)}/tags/${encodeURIComponent(tagToEdit)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTag: editTag }),
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
    } catch (error: any) {
      console.error("Error updating tag:", error);
      setTagError(error.message || "Failed to update tag");
      setTimeout(() => setTagError(""), 3000);
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedCategory || !tagToEdit) {
      setTagError("Please select a category and tag to delete");
      setTimeout(() => setTagError(""), 3000);
      return;
    }
    try {
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
      setSuccessMessage(`Tag '${tagToEdit}' deleted successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      setTagError(error.message || "Failed to delete tag");
      setTimeout(() => setTagError(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-yellow-900 mb-6">Content Management</h1>
      {successMessage && <p className="text-green-500 bg-green-100 p-2 rounded mb-4">{successMessage}</p>}
      {tagError && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{tagError}</p>}
      <button
        onClick={handleCreate}
        className="mb-6 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
      >
        Create New Book
      </button>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-yellow-900 mb-2">Manage Tags</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-800 font-medium">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <label className="block text-gray-800 font-medium">New Tag</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new tag"
              />
              <button
                onClick={handleCreateTag}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
              >
                Add Tag
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-800 font-medium">Edit/Delete Tag</label>
            <div className="flex space-x-2">
              <select
                value={tagToEdit}
                onChange={(e) => setTagToEdit(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="New tag value"
              />
              <button
                onClick={handleUpdateTag}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Update Tag
              </button>
              <button
                onClick={handleDeleteTag}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <ContentForm
              content={selectedContent ?? undefined}
              onClose={handleClose}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
      <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}