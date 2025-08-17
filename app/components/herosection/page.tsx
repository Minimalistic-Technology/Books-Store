"use client";

import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faShippingFast,
  faUndo,
  faHeadset,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../../utils/api";
import BookCard from "./BookCard"; // Adjust path as needed

interface Book {
  _id: string;
  bookName: string;
  title: string;
  price: number;
  discountedPrice: number;
  imageUrl: string;
  subCategory: string;
  viewCount: number;
}

interface SiteSettings {
  _id: string;
  logo: string | null;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  apiKey: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestSellers, setBestSellers] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);

  const bestSellersRef = useRef<HTMLDivElement | null>(null);
  const newArrivalsRef = useRef<HTMLDivElement | null>(null);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Failed to load site settings.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBooks = async () => {
      try {
        const bestRes = await fetch(`${API_BASE_URL}/bestsellers`);
        if (!bestRes.ok) throw new Error("Failed to fetch best sellers");
        const bestData = await bestRes.json();
        setBestSellers(bestData);

        const newRes = await fetch(`${API_BASE_URL}/newarrivals`);
        if (!newRes.ok) throw new Error("Failed to fetch new arrivals");
        const newData = await newRes.json();
        setNewArrivals(newData);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchSettings();
    fetchBooks();
  }, []);

  const handleSearch = (results: Book[], query?: string) => {
    setSearchResults(results);
    setShowSearchResults(true);
    if (query !== undefined) {
      setSearchQuery(query);
    }
  };

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const containerWidth = ref.current.offsetWidth; // Visible width of container
      const scrollByAmount = containerWidth; // Scroll by one full "page" (4 books)
      const scrollTo = direction === "left" ? -scrollByAmount : scrollByAmount;

      ref.current.scrollBy({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Head>
        <title>{settings?.title || "Book Center"}</title>
        <meta
          name="description"
          content={
            settings?.metaDescription ||
            "Welcome to the best online book store!"
          }
        />
        <meta
          name="keywords"
          content={settings?.metaKeywords || "books, online store, reading"}
        />
      </Head>

      <main className="container mx-auto p-4 flex-grow">
        <section className="text-center mb-8">
          {loading ? (
            <p className="text-gray-500 text-lg">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : (
            <>
              <h1 className="text-4xl text-black font-bold mb-4">
                {settings?.metaDescription || "Welcome to Book Center"}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                A Harsh Book Store platform for book lovers
              </p>
              <Link href="/books" className="text-blue-600 hover:underline">
                Explore Books
              </Link>
            </>
          )}
        </section>

        {showSearchResults && searchResults.length > 0 ? (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-4 px-29 text-black">
              Search Results for "{searchQuery}"
            </h2>
            <div className="relative">
              {searchResults.length > 4 && (
                <button
                  onClick={() => scroll(searchResultsRef, "left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
              )}
              <div
                ref={searchResultsRef}
                className="flex overflow-x-auto space-x-10 scrollbar-hide px-29"
                style={{ scrollBehavior: "smooth" }}
              >
                {searchResults.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
              {searchResults.length > 4 && (
                <button
                  onClick={() => scroll(searchResultsRef, "right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              )}
            </div>
          </section>
        ) : (
          <>
            <section className="mb-20">
              <h2 className="text-2xl font-semibold mb-4 px-29 text-black">
                Best Sellers
              </h2>
              <div className="relative">
                {bestSellers.length > 4 && (
                  <button
                    onClick={() => scroll(bestSellersRef, "left")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                )}
                <div
                  ref={bestSellersRef}
                  className="flex overflow-x-auto space-x-10 scrollbar-hide px-29"
                  style={{
                    scrollBehavior: "smooth",
                  }}
                >
                  {bestSellers.map((book) => (
                    <div
                      key={book._id}
                      style={{ flex: "0 0 calc(25% - 18px)" }} 
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>

                {bestSellers.length > 4 && (
                  <button
                    onClick={() => scroll(bestSellersRef, "right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                )}
              </div>
            </section>

            <section className="mb-20">
              <h2 className="text-2xl font-semibold mb-4 px-29 text-black">
                New Arrivals
              </h2>
              <div className="relative">
                {newArrivals.length > 4 && (
                  <button
                    onClick={() => scroll(newArrivalsRef, "left")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                )}
                <div
                  ref={newArrivalsRef}
                  className="flex overflow-x-auto space-x-10 scrollbar-hide px-29"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {newArrivals.map((book) => (
                   <div
                      key={book._id}
                      style={{ flex: "0 0 calc(25% - 18px)" }} 
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
                {newArrivals.length > 4 && (
                  <button
                    onClick={() => scroll(newArrivalsRef, "right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                )}
              </div>
            </section>

            <section className="mb-20">
              <h2 className="text-2xl font-semibold mb-6 px-29 text-black">
                Our Services
              </h2>
              <div className="px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="text-xl text-orange-500 mb-3"
                  />
                  <h3 className="text-xl font-medium text-black mb-1">
                    Wide Book Selection
                  </h3>
                  <p className="text-base text-black">
                    Explore a vast collection of books for all classes.
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
                  <FontAwesomeIcon
                    icon={faShippingFast}
                    className="text-xl text-orange-500 mb-3"
                  />
                  <h3 className="text-xl font-medium text-black mb-1">
                    Fast Shipping
                  </h3>
                  <p className="text-base text-black">
                    Get your books delivered quickly to your doorstep.
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
                  <FontAwesomeIcon
                    icon={faUndo}
                    className="text-xl text-orange-500 mb-3"
                  />
                  <h3 className="text-xl font-medium text-black mb-1">
                    Easy Returns
                  </h3>
                  <p className="text-base text-black">
                    Hassle-free return policy for your convenience.
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
                  <FontAwesomeIcon
                    icon={faHeadset}
                    className="text-xl text-orange-500 mb-3"
                  />
                  <h3 className="text-xl font-medium text-black mb-1">
                    24/7 Support
                  </h3>
                  <p className="text-base text-black">
                    Contact us anytime for assistance.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
