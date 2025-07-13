'use client';

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  type: "category" | "tag";
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Predefined categories
  const predefinedCategories: Category[] = [
    { _id: "static-competitive", name: "Competitive-Exam-Books", type: "category" },
    { _id: "static-school", name: "School-Books", type: "category" },
    { _id: "static-college", name: "College-Books", type: "category" },
    { _id: "static-ref", name: "Ref-Books-Guides", type: "category" },
    { _id: "static-entrance", name: "Entrance-Exam-Books", type: "category" },
    { _id: "static-stationary", name: "Stationary", type: "category" },
    { _id: "static-non-academics", name: "Non-Academics", type: "category" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookstore/admincategory');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        // Filter for categories only (exclude tags) and map to relevant fields
        const fetchedCategories = data
          .filter((cat: any) => cat.type === "category")
          .map((cat: any) => ({ _id: cat._id, name: cat.name, type: cat.type }));
        // Combine predefined and fetched categories, avoiding duplicates by name
        const combinedCategories = [
          ...predefinedCategories,
          ...fetchedCategories.filter(
            (cat: Category) => !predefinedCategories.some((pre) => pre.name === cat.name)
          ),
        ];
        // Ensure "Request Your Book" is always included
        if (!combinedCategories.some((cat: Category) => cat.name === "Request Your Book")) {
          combinedCategories.push({ _id: "static-request", name: "Request Your Book", type: "category" });
        }
        setCategories(combinedCategories);
      } catch (err) {
        setError('Error loading categories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white text-black font-sans">
      {/* Top Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/Images/logo.png"
              alt="Harsh Books Store Logo"
              width={80}
              height={80}
              className="ml-2 rounded-full hover:opacity-80 transition-opacity duration-300"
            />
          </Link>
          <div className="relative max-w-xl ml-4 hidden sm:block">
            <input
              type="text"
              placeholder="Search for The Intelligent Investor"
              className="p-2 rounded border border-gray-300 w-64 sm:w-80 md:w-96 pr-10 text-sm sm:text-base"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => alert("Search functionality to be implemented")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm sm:text-base">
            <span className="text-orange-500 mr-2">Need help? Call us:</span>
            <span className="text-black">+91 7977250185</span>
          </div>
          <Link href="/login" className="hover:underline text-black">
            <FontAwesomeIcon icon={faUser} className="text-lg sm:text-xl" title="Sign In" />
          </Link>
          <Link href="/cart" className="relative text-black hover:underline">
            <FontAwesomeIcon icon={faShoppingCart} className="text-lg sm:text-xl" title="Cart" />
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-yellow-200 p-2 sm:p-4">
        <div className="lg:hidden flex justify-end px-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>
        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:justify-between lg:items-center p-2 sm:p-4 space-y-2 lg:space-y-0 lg:space-x-2 w-full overflow-x-hidden ${
            isMenuOpen ? "bg-yellow-200" : ""
          } lg:overflow-x-auto`}
        >
          {loading ? (
            <li className="lg:inline-block">Loading...</li>
          ) : error ? (
            <li className="lg:inline-block text-red-500">{error}</li>
          ) : (
            categories.map(({ _id, name }) => (
              <li key={_id} className="lg:inline-block">
                <Link
                  href={name === "Request Your Book" ? "/request-book" : `/${name.toLowerCase().replace(/ /g, '-')}`}
                  className={`text-gray-800 font-bold text-sm sm:text-base p-2 hover:bg-orange-500 hover:text-white rounded transition-colors duration-300 block lg:inline-block ${
                    name === "Request Your Book" ? "bg-black text-white" : ""
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>
    </div>
  );
}