"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "@/utils/api";
import { Content } from "../order-product-management/types";
import Image from "next/image";



type BookFlags = {
  bestSeller?: boolean;
  newArrival?: boolean;
};

interface ContentListProps {
  contents: Content[];
  onEdit: (content: Content) => void;
  onDelete: (id: string, categoryPath: string) => void;
  onFlagChange: (id: string, field: keyof BookFlags, value: boolean) => void;
  bookFlags: Record<string, BookFlags>;
  editingBookId: string | null;
  onSave: (id: string, categoryPath: string) => void;
}
// interface Book{
//   id:string,
//         title: string,
//         categoryPath: string,
//         tags: string,
//         seoTitle: string,
//         seoDescription: string,
//         price: number,
//         description: string,
//         estimatedDelivery: string,
//         condition:string,
//         author: string,
//         publisher: string,
//         imageUrl: string,
//         quantityNew: number,
//         quantityOld: number,
//         discountNew: number,
//         discountOld: number,
//         isBestSeller: boolean,
//         isNewArrival: boolean,
// }

const ContentList: React.FC<ContentListProps> = ({
  contents,
  onEdit,
  onDelete,
  onFlagChange,
  bookFlags,
  editingBookId,
  onSave,
}) => {
  const defaultImageUrl =
    "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Best Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                New Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id}>
                <td className="px-2 py-2 whitespace-nowrap">
                  <Image
                    src={content.imageUrl || defaultImageUrl}
                    alt={content.title}
                    width={100}
                    height={100}
                    className="h-24 w-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = defaultImageUrl;
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {content.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{content.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingBookId === content.id ? (
                    <input
                      type="checkbox"
                      checked={
                        bookFlags[content.id!]?.bestSeller ??
                        content.isBestSeller ??
                        false
                      }
                      onChange={(e) =>
                        onFlagChange(
                          content.id!,
                          "bestSeller",
                          e.target.checked
                        )
                      }
                    />
                  ) : content.isBestSeller ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingBookId === content.id ? (
                    <input
                      type="checkbox"
                      checked={
                        bookFlags[content.id!]?.newArrival ??
                        content.isNewArrival ??
                        false
                      }
                      onChange={(e) =>
                        onFlagChange(
                          content.id!,
                          "newArrival",
                          e.target.checked
                        )
                      }
                    />
                  ) : content.isNewArrival ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingBookId === content.id ? (
                    <>
                      <button
                        onClick={() =>
                          onSave(content.id!, content.categoryPath)
                        }
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => onEdit({} as Content)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(content)}
                        className="text-teal-600 hover:text-teal-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          onDelete(content.id!, content.categoryPath)
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function EBooksEdit() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookFlags, setBookFlags] = useState<Record<string, BookFlags>>({});
  const itemsPerPage = 10;

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Content[]>(`${API_BASE_URL}/books`,{withCredentials:true});
      const books = response.data.map((book) => ({
        id: book._id,
        title: book.bookName || book.title || "",
        categoryName:book.categoryName,
        categoryPath: book.categoryPath || "",
        tags: Array.isArray(book.tags) ? book.tags.join(", ") : book.tags || "",
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
        isBestSeller: book.isBestSeller || false,
        isNewArrival: book.isNewArrival || false,
      }));
      setContents(books);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to load books");
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleEdit = (content: Content) => {
    setEditingBookId((prev) =>
      prev === content.id ? null : content?.id ?? null
    );
  };

  const handleFlagChange = (
    bookId: string,
    field: keyof BookFlags,
    value: boolean
  ) => {
    setBookFlags((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (bookId: string, categoryPath: string) => {
    const flags = bookFlags[bookId] || {};
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/books/${encodeURIComponent(categoryPath)}/${bookId}`,
        {
          isBestSeller: flags.bestSeller,
          isNewArrival: flags.newArrival,
        },
        {withCredentials:true}
      );
      setContents((prevBooks) =>
        prevBooks.map((b) => (b.id === bookId ? { ...b, ...response.data } : b))
      );
      setEditingBookId(null);
      setSuccessMessage("Book updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to update books");
        setTimeout(() => setError(""), 5000);
      }
    }  finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, categoryPath: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:5000/api/bookstore/books/${encodeURIComponent(
          categoryPath
        )}/${id}`,{withCredentials:true}
      );
      setContents((prev) => prev.filter((content) => content.id !== id));
      setSuccessMessage("Book deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to delete book");
        setTimeout(() => setError(""), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (<>
    
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 pt-12">
            EBooks Management
          </h1>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
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
              onFlagChange={handleFlagChange}
              bookFlags={bookFlags}
              editingBookId={editingBookId}
              onSave={handleSave}
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
    </>  
  );
}
