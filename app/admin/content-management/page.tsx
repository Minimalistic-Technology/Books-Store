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
import { Content } from "../order-product-management/types";

// export type Content = {
//   id?: string;
//   title: string;
//   categoryName: string;
//   subCategory: string;
//   categoryPath: string;
//   tags: string;
//   author: string;
//   publisher: string;
//   price: number;
//   condition: string;
//   quantityNew?: number;
//   discountNew?: number;
//   quantityOld?: number;
//   discountOld?: number;
//   imageUrl: string;
//   estimatedDelivery: string;
//   description: string;
//   seoTitle?: string;
//   seoDescription?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

interface Category {
  _id: string;
  name: string;
  path: string;
  tags: string[];
  children: Category[];
}

// Non-exported utility function to avoid type conflict
// const updateProducts = (
//   newProducts: Content[],
//   callback: (products: Content[]) => void
// ) => {
//   callback(newProducts);
// };

// Helper function to flatten category hierarchy for dropdown
const flattenCategories = (
  categories: Category[],
  parentPath: string = ""
): { id: string; path: string; display: string }[] => {
  let result: { id: string; path: string; display: string }[] = [];
  categories.forEach((cat) => {
    if (!cat.path) return; // Skip categories with undefined path
    const currentPath = parentPath ? `${parentPath}/${cat.name}` : cat.name;
    result.push({ id: cat._id, path: cat.path, display: currentPath });
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, currentPath));
    }
  });
  return result;
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
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [parentPath, setParentPath] = useState<string>("");
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchCategoriesAndContents = useCallback(async () => {
    setIsLoading(true);
    try {
      const categoriesResponse = await fetch(`${API_BASE_URL}/book-categories`);
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const categoriesData: Category[] = await categoriesResponse.json();
       // Debug
      setCategories(categoriesData);

      const allBooks: Content[] = [];
      const fetchPromises = categoriesData.map(async (category: Category) => {
        if (!category.path) return []; // Skip invalid categories
        try {
          // const booksResponse = await fetch(
          //   `${API_BASE_URL}/products`
          // );
          const booksResponse = await fetch(
            `${API_BASE_URL}/books/${encodeURIComponent(category.path)}`
          );
          if (!booksResponse.ok) {
            
            return [];
          }
          const booksData = await booksResponse.json();
          const books: Content[] = Array.isArray(booksData) ? booksData : [];
          return books.map((book) => ({
            id: book._id,
            title: book.bookName || book.title || "",
            categoryName: book.categoryName || "",
            subCategory: book.subCategory || "",
            categoryPath: book.categoryPath || category.path,
            tags: Array.isArray(book.tags)
              ? book.tags.join(", ")
              : book.tags || "",
            seoTitle: book.seoTitle || "",
            seoDescription: book.seoDescription || "",
            price: book.price || 0,
            description: book.description || "",
            estimatedDelivery: book.estimatedDelivery || "",
            condition:
              book.condition === "new"
                ? "NEW - ORIGINAL PRICE"
                : book.condition === "used"
                ? "OLD"
                : "BOTH",
            author: book.author || "",
            publisher: book.publisher || "",
            imageUrl: book.imageUrl || "",
            quantityNew: book.quantityNew || 0,
            quantityOld: book.quantityOld || 0,
            discountNew: book.discountNew || 0,
            discountOld: book.discountOld || 0,
            createdAt: book.createdAt || "",
            updatedAt: book.updatedAt || "",
          }));
        } catch {
          
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      allBooks.push(...results.flat());
      setContents(allBooks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to load categories or books");
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndContents();
  }, [fetchCategoriesAndContents]);

  const handleSave = async (data: Content) => {
    try {
      setIsLoading(true);
      const isUpdate = Boolean(data.id);
      const url = isUpdate
        ? `${API_BASE_URL}/books/${encodeURIComponent(data.categoryPath)}/${
            data.id
          }`
        : `${API_BASE_URL}/books/${encodeURIComponent(data.categoryPath)}`;
      const backendCondition =
        data.condition === "NEW - ORIGINAL PRICE"
          ? "new"
          : data.condition === "OLD"
          ? "used"
          : data.condition;
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          title: data.title,
          tags:
            typeof data.tags === "string"
              ? data.tags.split(",").map((tag) => tag.trim())
              : data.tags,
          condition: backendCondition,
          discountNew: data.discountNew ?? 0,
          discountOld: data.discountOld ?? 0,
          categoryPath: data.categoryPath,
        }),
        credentials:"include"
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
        categoryName: bookData.categoryName || "",
        subCategory: bookData.subCategory || "",
        categoryPath: bookData.categoryPath,
        tags: Array.isArray(bookData.tags)
          ? bookData.tags.join(", ")
          : bookData.tags || "",
        seoTitle: bookData.seoTitle || "",
        seoDescription: bookData.seoDescription || "",
        price: bookData.price,
        description: bookData.description,
        estimatedDelivery: bookData.estimatedDelivery,
        condition:
          bookData.condition === "new"
            ? "NEW - ORIGINAL PRICE"
            : bookData.condition === "used"
            ? "OLD"
            : "BOTH",
        author: bookData.author,
        publisher: bookData.publisher,
        imageUrl: bookData.imageUrl,
        quantityNew: bookData.quantityNew || 0,
        quantityOld: bookData.quantityOld || 0,
        discountNew: bookData.discountNew || 0,
        discountOld: bookData.discountOld || 0,
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
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || `Failed to ${data.id ? "update" : "create"} book`
        );
        setTimeout(() => setError(""), 5000);
      } else {
        setError(`Failed to ${data.id ? "update" : "create"} book`);
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, categoryPath: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/books/${encodeURIComponent(categoryPath)}/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete book");
      setContents((prev) => prev.filter((content) => content.id !== id));
      setSuccessMessage("Book deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to delete book");
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to delete book");
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Please enter a category name");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/book-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          parentPath: parentPath || undefined,
        }),credentials:"include"
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }
      const data = await response.json();
      setCategories((prev) => {
        if (!parentPath) {
          return [...prev, data];
        }
        const updateChildren = (categories: Category[]): Category[] => {
          return categories.map((cat) => {
            if (cat.path === parentPath) {
              return { ...cat, children: [...cat.children, data] };
            }
            return { ...cat, children: updateChildren(cat.children) };
          });
        };
        return updateChildren(prev);
      });
      setNewCategoryName("");
      setParentPath("");
      setSuccessMessage(`Category '${newCategoryName}' added successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 3000);
      } else {
        setError("Failed to create category");
        setTimeout(() => setError(""), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) {
      setError("Please select a category to delete");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (
      !confirm(
        `Are you sure you want to delete the category '${categoryToDelete}' and all its descendants?`
      )
    )
      return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/book-categories/${encodeURIComponent(
          categoryToDelete
        )}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }
      setCategories((prev) => {
        const removeCategory = (categories: Category[]): Category[] => {
          return categories
            .filter((cat) => {
              const path = cat.path || "";
              return (
                path &&
                path !== categoryToDelete &&
                !path.startsWith(`${categoryToDelete}/`)
              );
            })
            .map((cat) => ({
              ...cat,
              children: removeCategory(cat.children),
            }));
        };
        return removeCategory(prev);
      });
      setCategoryToDelete("");
      setSuccessMessage(`Category '${categoryToDelete}' deleted successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchCategoriesAndContents();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 3000);
      } else {
        setError("Failed to delete category");
        setTimeout(() => setError(""), 3000);
      }
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
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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

  // Get flattened categories for dropdown
  const flattenedCategories = flattenCategories(categories);

  return (
    <div className="p-6 pt-12">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 md:gap-0">
        <h1 className="text-[27px] md:text-3xl font-bold text-gray-900">
          Content Management
        </h1>
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
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
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
              Add New Category
            </label>
            <div className="p-2 flex flex-wrap gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new category name"
                disabled={isLoading}
              />
              <select
                value={parentPath}
                onChange={(e) => setParentPath(e.target.value)}
                className="flex-1 min-w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="">Select Parent Category (Root)</option>
                {flattenedCategories.map((cat) => (
                  <option key={cat.id} value={cat.path}>
                    {cat.display}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateCategory}
                disabled={isLoading || !newCategoryName.trim()}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Category
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Delete Category
            </label>
            <div className="flex flex-wrap gap-2">
              <select
                value={categoryToDelete}
                onChange={(e) => setCategoryToDelete(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select category to delete
                </option>
                {flattenedCategories.map((cat) => (
                  <option key={cat.id} value={cat.path}>
                    {cat.display}
                  </option>
                ))}
              </select>
              <button
                onClick={handleDeleteCategory}
                disabled={isLoading || !categoryToDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Category
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
                key={
                  typeof page === "number"
                    ? `page-${page}`
                    : `ellipsis-${index}`
                }
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
