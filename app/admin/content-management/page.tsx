"use client";

import { useState, useEffect, useCallback } from "react";
import ContentList from "./components/ContentList";
import { ContentForm } from "./components/ContentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../../utils/api";

export interface Content {
  id?: string;
  title: string;
  categoryName: string;
  subCategory: string;
  subSubCategory: string;
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

interface SubCategory {
  name: string;
  subSubCategories: string[];
}

interface Category {
  _id: string;
  name: string;
  tags: string[];
  subCategories: SubCategory[];
}

export const updateProducts = (
  newProducts: Content[],
  callback: (products: Content[]) => void
) => {
  callback(newProducts);
};

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [newSubCategory, setNewSubCategory] = useState<string>("");
  const [newSubSubCategory, setNewSubSubCategory] = useState<string>("");
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<string>("");
  const [subSubCategoryToDelete, setSubSubCategoryToDelete] =
    useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchCategoriesAndContents = useCallback(async () => {
    setIsLoading(true);
    try {
      const categoriesResponse = await fetch(`${API_BASE_URL}/book-categories`);
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      const allBooks: Content[] = [];
      const fetchPromises = categoriesData.map(async (category: Category) => {
        try {
          const booksResponse = await fetch(
            `${API_BASE_URL}/book-categories/${encodeURIComponent(
              category.name
            )}`
          );
          if (!booksResponse.ok) {
            console.warn(`Failed to fetch books for ${category.name}`);
            return [];
          }
          const booksData = await booksResponse.json();
          const books = Array.isArray(booksData.books) ? booksData.books : [];
          return books.map((book: any) => ({
            id: book._id,
            title: book.bookName || book.title || "",
            categoryName: category.name,
            subCategory: book.subCategory || "",
            subSubCategory: book.subSubCategory || "",
            tags: Array.isArray(book.tags)
              ? book.tags.join(", ")
              : book.tags || "",
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
          console.error(
            `Error fetching books for category ${category.name}:`,
            error
          );
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
    if (!selectedCategory) {
      setSelectedSubCategory("");
      setSubCategoryToDelete("");
      setSubSubCategoryToDelete("");
      return;
    }
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/book-categories/${encodeURIComponent(
            selectedCategory
          )}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch category data");
        }
        const data = await response.json();
        setCategories((prev) =>
          prev.map((cat) =>
            cat.name === selectedCategory
              ? {
                  ...cat,
                  tags: data.tags || [],
                  subCategories: data.subCategories || [],
                }
              : cat
          )
        );
        setError("");
      } catch (err: any) {
        setError(err.message || `Failed to load data for ${selectedCategory}`);
        setTimeout(() => setError(""), 5000);
      }
    };
    fetchCategoryData();
  }, [selectedCategory]);

  const handleSave = async (data: Content) => {
    try {
      setIsLoading(true);
      const isUpdate = Boolean(data.id);
      const url = isUpdate
        ? `${API_BASE_URL}/book-categories/${encodeURIComponent(
            data.categoryName
          )}/${encodeURIComponent(data.subCategory)}/${encodeURIComponent(
            data.subSubCategory
          )}/${data.id}`
        : `${API_BASE_URL}/book-categories/${encodeURIComponent(
            data.categoryName
          )}/${encodeURIComponent(data.subCategory)}/${encodeURIComponent(
            data.subSubCategory
          )}`;
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          title: data.title, // Ensure title is sent as title
          tags:
            typeof data.tags === "string"
              ? data.tags.split(",").map((tag) => tag.trim())
              : data.tags,
          discountNew: data.discountNew ?? 0,
          discountOld: data.discountOld ?? 0,
          subSubCategory: data.subSubCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isUpdate ? "update" : "create"} book`
        );
      }

      const savedBook = await response.json();
      const bookData = Array.isArray(savedBook) ? savedBook[0] : savedBook;

      const updatedBook: Content = {
        id: bookData._id,
        title: bookData.bookName || bookData.title,
        categoryName: data.categoryName,
        subCategory: bookData.subCategory,
        subSubCategory: bookData.subSubCategory,
        tags: Array.isArray(bookData.tags)
          ? bookData.tags.join(", ")
          : bookData.tags || "",
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
          ? prev.map((content) =>
              content.id === data.id ? updatedBook : content
            )
          : [...prev, updatedBook]
      );
      setSuccessMessage(
        `Book ${isUpdate ? "updated" : "created"} successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsFormOpen(false);
      setEditingContent(undefined);
      await fetchCategoriesAndContents();
    } catch (err: any) {
      setError(
        err.message || `Failed to ${data.id ? "update" : "create"} book`
      );
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
      const content = contents.find(
        (c) => c.id === id && c.categoryName === categoryName
      );
      if (!content) throw new Error("Book not found");
      const response = await fetch(
        `${API_BASE_URL}/book-categories/${encodeURIComponent(
          categoryName
        )}/${encodeURIComponent(content.subCategory)}/${encodeURIComponent(
          content.subSubCategory
        )}/${id}`,
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

  const handleCreateSubCategory = async () => {
    if (!selectedCategory || !newSubCategory.trim()) {
      setError("Please select a category and enter a subcategory name");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/book-categories/${encodeURIComponent(
          selectedCategory
        )}/subcategories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newSubCategory.trim(),
            subSubCategories: [],
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create subcategory");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory
            ? { ...cat, subCategories: data.subCategories || [] }
            : cat
        )
      );
      setNewSubCategory("");
      setSuccessMessage(`Subcategory '${newSubCategory}' added successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create subcategory");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedCategory || !subCategoryToDelete) {
      setError("Please select a category and subcategory to delete");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (
      !confirm(
        `Are you sure you want to delete the subcategory '${subCategoryToDelete}'?`
      )
    )
      return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/book-categories/${encodeURIComponent(
          selectedCategory
        )}/subcategories/${encodeURIComponent(subCategoryToDelete)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete subcategory");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory
            ? { ...cat, subCategories: data.subCategories || [] }
            : cat
        )
      );
      setSubCategoryToDelete("");
      setSuccessMessage(
        `Subcategory '${subCategoryToDelete}' deleted successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete subcategory");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubSubCategory = async () => {
    if (
      !selectedCategory ||
      !selectedSubCategory ||
      !newSubSubCategory.trim()
    ) {
      setError(
        "Please select a category, subcategory, and enter a sub-subcategory name"
      );
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/book-categories/${encodeURIComponent(
          selectedCategory
        )}/${encodeURIComponent(selectedSubCategory)}/subsubcategories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newSubSubCategory.trim() }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create sub-subcategory");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory
            ? { ...cat, subCategories: data.subCategories || [] }
            : cat
        )
      );
      setNewSubSubCategory("");
      setSuccessMessage(
        `Sub-subcategory '${newSubSubCategory}' added successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create sub-subcategory");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubSubCategory = async () => {
    if (!selectedCategory || !selectedSubCategory || !subSubCategoryToDelete) {
      setError(
        "Please select a category, subcategory, and sub-subcategory to delete"
      );
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (
      !confirm(
        `Are you sure you want to delete the sub-subcategory '${subSubCategoryToDelete}'?`
      )
    )
      return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/book-categories/${encodeURIComponent(
          selectedCategory
        )}/${encodeURIComponent(
          selectedSubCategory
        )}/subsubcategories/${encodeURIComponent(subSubCategoryToDelete)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete sub-subcategory");
      }
      const data = await response.json();
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === selectedCategory
            ? { ...cat, subCategories: data.subCategories || [] }
            : cat
        )
      );
      setSubSubCategoryToDelete("");
      setSuccessMessage(
        `Sub-subcategory '${subSubCategoryToDelete}' deleted successfully`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete sub-subcategory");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination and Search Logic
  const filteredContents = contents.filter((content) =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    }
    if (endPage < totalPages) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
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
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          Create New Book
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title (e.g., physics)..."
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full max-w-xs"
            disabled={isLoading}
          />
          <span className="text-gray-700">
            Total Books: {filteredContents.length}
          </span>
        </div>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Manage Categories
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("");
                setSubCategoryToDelete("");
                setSubSubCategoryToDelete("");
              }}
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
            <label className="block text-gray-800 font-medium mb-2">
              Add New Subcategory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new subcategory"
                disabled={isLoading || !selectedCategory}
              />
              <button
                onClick={handleCreateSubCategory}
                disabled={
                  isLoading || !selectedCategory || !newSubCategory.trim()
                }
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Subcategory
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Delete Subcategory
            </label>
            <div className="flex gap-2">
              <select
                value={subCategoryToDelete}
                onChange={(e) => setSubCategoryToDelete(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading || !selectedCategory}
              >
                <option value="" disabled>
                  Select subcategory to delete
                </option>
                {categories
                  .find((cat) => cat.name === selectedCategory)
                  ?.subCategories.map((sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleDeleteSubCategory}
                disabled={
                  isLoading || !selectedCategory || !subCategoryToDelete
                }
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Subcategory
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Select Subcategory for Sub-Subcategory Management
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                setSubSubCategoryToDelete("");
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading || !selectedCategory}
            >
              <option value="" disabled>
                Select a subcategory
              </option>
              {categories
                .find((cat) => cat.name === selectedCategory)
                ?.subCategories.map((sub) => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Add New Sub-Subcategory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubSubCategory}
                onChange={(e) => setNewSubSubCategory(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new sub-subcategory"
                disabled={
                  isLoading || !selectedCategory || !selectedSubCategory
                }
              />
              <button
                onClick={handleCreateSubSubCategory}
                disabled={
                  isLoading ||
                  !selectedCategory ||
                  !selectedSubCategory ||
                  !newSubSubCategory.trim()
                }
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Sub-Subcategory
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Delete Sub-Subcategory
            </label>
            <div className="flex gap-2">
              <select
                value={subSubCategoryToDelete}
                onChange={(e) => setSubSubCategoryToDelete(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={
                  isLoading || !selectedCategory || !selectedSubCategory
                }
              >
                <option value="" disabled>
                  Select sub-subcategory to delete
                </option>
                {categories
                  .find((cat) => cat.name === selectedCategory)
                  ?.subCategories.find(
                    (sub) => sub.name === selectedSubCategory
                  )
                  ?.subSubCategories.map((subSub) => (
                    <option key={subSub} value={subSub}>
                      {subSub}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleDeleteSubSubCategory}
                disabled={
                  isLoading ||
                  !selectedCategory ||
                  !selectedSubCategory ||
                  !subSubCategoryToDelete
                }
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Sub-Subcategory
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
        <>
          <ContentList
            contents={paginatedContents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..." || currentPage === page}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-teal-700 text-white"
                    : "bg-teal-500 text-white hover:bg-teal-700"
                } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div>
        </>
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