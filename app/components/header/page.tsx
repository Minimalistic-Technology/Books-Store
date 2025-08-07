"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faBars,
  faSearch,
  faChevronDown,
  faChevronUp,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, normalizeUrlParam, normalizeDisplayName } from "@/utils/api";

interface Category {
  _id: string;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  subSubCategories: string[];
  books: string[];
  subCategoryDiscount?: number;
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

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState<{ [key: string]: SubCategory[] }>({});
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [expandedMobileSubCategory, setExpandedMobileSubCategory] = useState<string | null>(null);

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
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/book-categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        const fetchedCategories: Category[] = data.map((item: any) => ({
          _id: item._id,
          name: normalizeUrlParam(item.name),
          subCategories: item.subCategories.map((sub: any) => ({
            ...sub,
            name: normalizeUrlParam(sub.name),
            subSubCategories: sub.subSubCategories.map(normalizeUrlParam),
          })),
        }));

        const staticCategories = [
          { _id: "static-competitive", name: "competitive-exam-books", subCategories: [] },
          { _id: "static-school", name: "school-books", subCategories: [] },
          { _id: "static-college", name: "college-books", subCategories: [] },
          { _id: "static-ref", name: "ref-books-guides", subCategories: [] },
          { _id: "static-entrance", name: "entrance-exam-books", subCategories: [] },
          { _id: "static-stationary", name: "stationary", subCategories: [] },
          { _id: "static-non-academics", name: "non-academics", subCategories: [] },
        ];

        const combinedCategories = [
          ...staticCategories,
          ...fetchedCategories.filter(
            (cat: Category) =>
              ![
                "competitive-exam-books",
                "school-books",
                "college-books",
                "ref-books-guides",
                "entrance-exam-books",
                "stationary",
                "non-academics",
              ].includes(cat.name)
          ),
        ];

        if (!combinedCategories.some((cat: Category) => cat.name === "request-your-book")) {
          combinedCategories.push({ _id: "static-request", name: "request-your-book", subCategories: [] });
        }

        const updatedCategories = combinedCategories.map((cat) => {
          const apiCategory = fetchedCategories.find((apiCat: Category) => apiCat.name === cat.name);
          return {
            ...cat,
            subCategories: apiCategory?.subCategories || cat.subCategories,
          };
        });

        setCategories(updatedCategories);
      } catch (err) {
        setError("Error loading categories. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSubCategoriesForCategory = async (categoryName: string) => {
    if (subCategoriesByCategory[categoryName]) return;
    try {
      const response = await fetch(`${API_BASE_URL}/book-categories/${encodeURIComponent(categoryName)}`);
      if (!response.ok) throw new Error(`Failed to fetch subcategories for ${categoryName}`);
      const data = await response.json();
      setSubCategoriesByCategory((prev) => ({
        ...prev,
        [categoryName]: data.subCategories?.map((sub: any) => ({
          ...sub,
          name: normalizeUrlParam(sub.name),
          subSubCategories: sub.subSubCategories?.map(normalizeUrlParam) || [],
        })) || [],
      }));
    } catch (err) {
      console.error(`Error fetching subcategories for ${categoryName}:`, err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search query");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const results = await response.json();
      console.log("Search results:", results);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Failed to perform search. Please try again later.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    if (categoryName === "request-your-book") return;

    if (activeDropdown === categoryName) {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    } else {
      setActiveDropdown(categoryName);
      setActiveSubDropdown(null);
      fetchSubCategoriesForCategory(categoryName);
    }
  };

  const handleMobileCategoryToggle = (categoryName: string) => {
    if (categoryName === "request-your-book") return;

    if (expandedMobileCategory === categoryName) {
      setExpandedMobileCategory(null);
      setExpandedMobileSubCategory(null);
    } else {
      setExpandedMobileCategory(categoryName);
      setExpandedMobileSubCategory(null);
      fetchSubCategoriesForCategory(categoryName);
    }
  };

  const handleMobileSubCategoryToggle = (subCategoryName: string) => {
    if (expandedMobileSubCategory === subCategoryName) {
      setExpandedMobileSubCategory(null);
    } else {
      setExpandedMobileSubCategory(subCategoryName);
    }
  };

  const hasSubSubCategories = (subCategory: SubCategory) => {
    return subCategory.subSubCategories && subCategory.subSubCategories.length > 0;
  };

  return (
    <div className="bg-white text-black font-sans">
      <div className="px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={settings?.logo || "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg"}
              alt="Books Store Logo"
              width={80}
              height={80}
              className="ml-2 rounded-full hover:opacity-80 transition-opacity duration-300"
            />
          </Link>
          <div className="relative max-w-xl ml-4 hidden sm:flex items-center">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <Input
                type="text"
                placeholder="Search for The Intelligent Investor"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError(null);
                }}
                className="w-64 sm:w-80 md:w-96 pr-10 text-sm sm:text-base focus:ring-teal-500"
                disabled={searchLoading}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0"
                disabled={searchLoading}
                aria-label="Search"
              >
                {searchLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-500" title="Search" />
                )}
              </Button>
            </form>
            {searchError && (
              <p className="text-sm text-red-500 mt-1 absolute bottom-[-1.5rem] left-0">{searchError}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm sm:text-base">
            <span className="text-orange-500 mr-2">Need help? Call us:</span>
            <span className="text-black">+91 7977250185</span>
          </div>
          <Link href="/login" className="hover:underline text-black">
            <FontAwesomeIcon icon={faUser} size="lg" className="text-lg sm:text-xl" title="Sign In" />
          </Link>
          <Link href="/cart" className="relative text-black hover:underline">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" className="text-lg sm:text-xl" title="Cart" />
          </Link>
        </div>
      </div>

      <nav className="bg-yellow-200 p-2 sm:p-4">
        <div className="xl:hidden flex justify-end px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} size="lg" className="text-2xl" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <svg
              className="animate-spin h-5 w-5 text-gray-500 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center p-4">{error}</p>
        ) : (
          <>
            <ul className={`${isMenuOpen ? "block" : "hidden"} xl:hidden p-4 space-y-2 bg-yellow-200`}>
              {categories.map(({ _id, name }) => (
                <li key={_id}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={name === "request-your-book" ? "/request-book" : `/${name}`}
                      className={`flex-1  text-gray-800 text-md p-2 transition-all duration-300 ${
                        name === "request-your-book"
                          ? "bg-black text-white hover:bg-gray-800"
                          : "hover:bg-orange-500 hover:text-white"
                      }`}
                      onClick={() => {
                        if (name === "request-your-book") {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      {normalizeDisplayName(name)}
                    </Link>
                    {name !== "request-your-book" && (
                      <button
                        onClick={() => handleMobileCategoryToggle(name)}
                        className="p-2 text-gray-600 hover:text-orange-600"
                        aria-label={`Toggle ${name} subcategories`}
                      >
                        <FontAwesomeIcon
                          icon={expandedMobileCategory === name ? faChevronUp : faChevronDown}
                          className="h-3 w-3"
                        />
                      </button>
                    )}
                  </div>
                  {expandedMobileCategory === name && (
                    <div className="mt-2 bg-white shadow-lg">
                      <ul className="py-2">
                        {subCategoriesByCategory[name]?.length > 0 ? (
                          subCategoriesByCategory[name].map((subCategory) => (
                            <li key={subCategory._id}>
                              <div className="flex items-center justify-between">
                                <Link
                                  href={`/${name}/${subCategory.name}`}
                                  className="flex-1 text-gray-600 text-sm p-2 hover:text-white hover:bg-orange-50 transition-colors duration-200"
                                  onClick={() => {
                                    if (!hasSubSubCategories(subCategory)) {
                                      setIsMenuOpen(false);
                                      setExpandedMobileCategory(null);
                                    }
                                  }}
                                >
                                  {normalizeDisplayName(subCategory.name)}
                                </Link>
                                {hasSubSubCategories(subCategory) && (
                                  <button
                                    onClick={() => handleMobileSubCategoryToggle(subCategory.name)}
                                    className="p-2 text-gray-600 hover:text-orange-600"
                                    aria-label={`Toggle ${subCategory.name} sub-subcategories`}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        expandedMobileSubCategory === subCategory.name
                                          ? faChevronUp
                                          : faChevronDown
                                      }
                                      className="h-3 w-3"
                                    />
                                  </button>
                                )}
                              </div>
                              {expandedMobileSubCategory === subCategory.name && hasSubSubCategories(subCategory) && (
                                <ul className="pl-4 py-2">
                                  {subCategory.subSubCategories.map((subSubCategory) => (
                                    <li key={subSubCategory}>
                                      <Link
                                        href={`/${name}/${subCategory.name}/${subSubCategory}`}
                                        className="flex items-center text-gray-600 text-xs p-2 hover:text-orange-600 transition-colors duration-200"
                                        onClick={() => {
                                          setIsMenuOpen(false);
                                          setExpandedMobileCategory(null);
                                          setExpandedMobileSubCategory(null);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faChevronRight} className="h-2 w-2 mr-2" />
                                        {normalizeDisplayName(subSubCategory)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-600 text-sm p-2">No subcategories available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Single Row Desktop Navigation - Fixed to remove scroll bar */}
            <div className="hidden xl:block">
              <div className="w-full">
                <ul className="flex justify-center items-center flex-wrap gap-1 px-2">
                  {categories.map(({ _id, name }) => (
                    <li 
                      key={_id} 
                      className="relative"
                      onMouseEnter={() => {
                        if (name !== "request-your-book") {
                          setActiveDropdown(name);
                          setActiveSubDropdown(null);
                          fetchSubCategoriesForCategory(name);
                        }
                      }}
                      onMouseLeave={() => {
                        setActiveDropdown(null);
                        setActiveSubDropdown(null);
                      }}
                    >
                      <div className="flex items-center">
                        <Link
                          href={name === "request-your-book" ? "/request-book" : `/${name}`}
                          className={`whitespace-nowrap font-bold text-gray-800 text-xs lg:text-sm px-2 lg:px-3 py-2 transition-all duration-300 ${
                            name === "request-your-book"
                              ? "bg-black text-white hover:bg-gray-800"
                              : activeDropdown === name
                              ? "bg-orange-500 text-white"
                              : "hover:bg-orange-500 hover:text-white"
                          }`}
                        >
                          {normalizeDisplayName(name)}
                        </Link>
                        {name !== "request-your-book" && (
                          <button
                            className="p-1 lg:p-2 text-gray-600 hover:text-orange-600"
                            aria-label={`Toggle ${name} subcategories`}
                          >
                            <FontAwesomeIcon
                              icon={activeDropdown === name ? faChevronUp : faChevronDown}
                              className="h-2 w-2 lg:h-3 lg:w-3"
                            />
                          </button>
                        )}
                      </div>
                      {activeDropdown === name && name !== "request-your-book" && (
                        <div className="absolute left-0 mt-0 w-[280px] bg-white shadow-2xl z-50">
                          <ul className="py-1">
                            {subCategoriesByCategory[name]?.length > 0 ? (
                              subCategoriesByCategory[name].map((subCategory) => (
                                <li
                                  key={subCategory._id}
                                  className="relative"
                                  onMouseEnter={() => setActiveSubDropdown(subCategory.name)}
                                  onMouseLeave={() => {
                                    if (!hasSubSubCategories(subCategory)) {
                                      setActiveSubDropdown(null);
                                    }
                                  }}
                                >
                                  <div className={`flex items-center justify-between transition-all duration-200 ${
                                    activeSubDropdown === subCategory.name
                                      ? "bg-orange-600 text-white"
                                      : "hover:bg-orange-600 hover:text-white"
                                  }`}>
                                    <Link
                                      href={`/${name}/${subCategory.name}`}
                                      className="flex-1 text-gray-700 font-bold text-sm px-3 py-2"
                                    >
                                      {normalizeDisplayName(subCategory.name)}
                                    </Link>
                                    {hasSubSubCategories(subCategory) && (
                                      <div className="px-2">
                                        <FontAwesomeIcon
                                          icon={faChevronRight}
                                          className="h-3 w-3 text-gray-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  {activeSubDropdown === subCategory.name && hasSubSubCategories(subCategory) && (
                                    <div
                                      className="absolute top-0 left-full z-60 w-[250px] bg-white shadow-2xl border-l"
                                      onMouseEnter={() => setActiveSubDropdown(subCategory.name)}
                                      onMouseLeave={() => setActiveSubDropdown(null)}
                                    >
                                      <ul className="py-1">
                                        {subCategory.subSubCategories.map((subSubCategory) => (
                                          <li key={subSubCategory}>
                                            <Link
                                              href={`/${name}/${subCategory.name}/${subSubCategory}`}
                                              className="block text-gray-700 font-bold text-sm px-3 py-2 hover:bg-orange-600 hover:text-white transition-all duration-200"
                                            >
                                              {normalizeDisplayName(subSubCategory)}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 font-bold text-sm px-3 py-2 italic">No subcategories available</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}