"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faShippingFast,
  faUndo,
  faHeadset,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../../utils/api";
import BookCard from "./BookCard";
import SearchComponent from "../SearchComponent";
import { siteSettingsAtom } from "@/app/store/data";
import { useAtom } from "jotai";
import { Book } from "@/app/admin/order-product-management/types";

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
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestSellers, setBestSellers] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);

  const bestSellersRef = useRef<HTMLDivElement | null>(null);
  const newArrivalsRef = useRef<HTMLDivElement | null>(null);

  const [siteSettingsAtomState, setSiteSettingsAtomState] =
    useAtom(siteSettingsAtom);

  const classes = [
    { name: "Class I", query: "class-1" },
    { name: "Class II", query: "class-2" },
    { name: "Class III", query: "class-3" },
    { name: "Class IV", query: "class-4th" },
    { name: "Class V", query: "class-5th" },
    { name: "Class VI", query: "class-6th" },
    { name: "Class VII", query: "class-7th" },
    { name: "Class VIII", query: "class-8th" },
    { name: "Class IX", query: "class-9th" },
    { name: "Class X", query: "class-10th" },
    { name: "Class XI", query: "class-11th" },
    { name: "Class XII", query: "class-12th" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!siteSettingsAtomState) {
          const response = await fetch(`${API_BASE_URL}/settings`);
          if (!response.ok) throw new Error("Failed to fetch settings");
          const data = await response.json();
          setSettings(data);
          setSiteSettingsAtomState(data);
        } else {
          setSettings(siteSettingsAtomState);
        }
      } catch  {
        
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
      } catch {
        
      }
    };

    fetchSettings();
    fetchBooks();
  }, []);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const containerWidth = ref.current.offsetWidth;
      const scrollByAmount = containerWidth;
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
        <SearchComponent />

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
            </>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center md:text-left md:px-29 text-black">
            Shop by Class
          </h2>
          <div className="md:px-29 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-4">
            {classes.slice(0, 6).map((classItem) => (
              <Link
                key={classItem.name}
                href={`categories/school-books?class=${classItem.query}`}
                className={`
                  text-center py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 hover:shadow-md
                   'bg-white text-black border-orange-300 hover:bg-orange-400 hover:border-orange-400'
                `}
              >
                {classItem.name}
              </Link>
            ))}
          </div>
          <div className="md:px-29 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {classes.slice(6).map((classItem) => (
              <Link
                key={classItem.name}
                href={`categories/school-books?class=${classItem.query}`}
                className={`
                  text-center py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 hover:shadow-md
                   'bg-white text-black border-orange-300 hover:bg-orange-400 hover:border-orange-400'
                `}
              >
                {classItem.name}
              </Link>
            ))}
          </div>
        </section>

        <>
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left md:px-29 text-black">
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
                className="flex overflow-x-auto space-x-5 scrollbar-hide md:h-95 md:px-29"
                style={{
                  scrollBehavior: "smooth",
                }}
              >
                {bestSellers.map((book) => (
                  <Link
                    href={`/overview1/${book._id}`}
                    key={book._id}
                    className="min-w-20 h-60   md:h-82 md:p-4 hover:shadow-2xl rounded-lg"
                  >
                    <BookCard book={book} />
                  </Link>
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
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left md:px-29 text-black">
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
                className="flex overflow-x-auto space-x-5 md:h-95 scrollbar-hide md:px-29"
                style={{ scrollBehavior: "smooth" }}
              >
                {newArrivals.map((book) => (
                  <Link
                    href={`/overview1/${book._id}`}
                    key={book._id}
                    className="min-w-20 h-60  md:h-82 md:p-4 hover:shadow-2xl rounded-lg"
                  >
                    <BookCard book={book} />
                  </Link>
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

            <div className="mt-8 text-center">
              <Link
                href="/request-book"
                className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-200"
              >
                Request a Book
              </Link>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-6 text-center md:text-left md:px-29 text-black">
              Our Services
            </h2>
            <div className="md:px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                  Contact us anytime for your convenience.
                </p>
              </div>
            </div>
          </section>
        </>
        {/* )} */}
      </main>
    </div>
  );
}
