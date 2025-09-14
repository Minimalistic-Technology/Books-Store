

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { Book } from "../admin/order-product-management/types";
import Image from "next/image";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchBooks(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchBooks = async (query: string) => {
    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/books/search?bookName=${encodeURIComponent(query)}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.books || []);
    } catch  {
      
      setSearchError("Failed to fetch results");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      
      <div className="flex items-center border rounded-lg shadow-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books..."
          className="flex-grow px-4 py-2 rounded-l-lg outline-none"
        />
        <button
          type="button"
          className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      
      {searchQuery.length >= 3 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchLoading && (
            <p className="p-3 text-gray-500 text-center">Searching...</p>
          )}
          {searchError && (
            <p className="p-3 text-red-500 text-center">{searchError}</p>
          )}
          {!searchLoading && searchResults.length === 0 && (
            <p className="p-3 text-gray-400 text-center">No results found</p>
          )}
          {searchResults.map((book) => (
            <Link
              key={book._id}
              href={`/overview1/${book._id}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 border-b"
            >
              
              <Image
              width={100}
              height={100}
                src={book.imageUrl || "/placeholder.jpg"}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium text-sm">{book.title}</p>
                <p className="text-xs text-gray-500">{book.categoryPath}</p>
                <p className="text-sm font-semibold text-orange-600">
                  ₹{book.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
