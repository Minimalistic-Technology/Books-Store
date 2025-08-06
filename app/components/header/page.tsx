"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faBars, faSearch, faChevronDown, faChevronUp, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from '../../../utils/api';

interface Category {
  _id: string;
  name: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  subSubCategories: string[];
  books: string[];
  subCategoryDiscount: number;
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

interface Tag {
  tags: string[];
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
  const [tagsByCategory, setTagsByCategory] = useState<{ [key: string]: string[] }>({});
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
        const fetchedCategories = data.map((item: any) => ({
          _id: item._id,
          name: item.name,
          subCategories: item.subCategories || [],
        }));
        const combinedCategories = [
          ...[
            { _id: "static-competitive", name: "Competitive-Exam-Books", subCategories: [] },
            { _id: "static-school", name: "School-Books", subCategories: [] },
            { _id: "static-college", name: "College-Books", subCategories: [] },
            { _id: "static-ref", name: "Ref-Books-Guides", subCategories: [] },
            { _id: "static-entrance", name: "Entrance-Exam-Books", subCategories: [] },
            { _id: "static-stationary", name: "Stationary", subCategories: [] },
            { _id: "static-non-academics", name: "Non-Academics", subCategories: [] },
          ],
          ...fetchedCategories.filter(
            (cat: Category) => ![
              "Competitive-Exam-Books",
              "School-Books",
              "College-Books",
              "Ref-Books-Guides",
              "Entrance-Exam-Books",
              "Stationary",
              "Non-Academics"
            ].includes(cat.name)
          ),
        ];
        if (!combinedCategories.some((cat: Category) => cat.name === "Request Your Book")) {
          combinedCategories.push({ _id: "static-request", name: "Request Your Book", subCategories: [] });
        }
        
        // Update categories with subcategories from API
        const updatedCategories = combinedCategories.map(cat => {
          const apiCategory = fetchedCategories.find((apiCat: Category) => apiCat.name === cat.name);
          return {
            ...cat,
            subCategories: apiCategory?.subCategories || []
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

  const fetchTagsForCategory = async (categoryName: string) => {
    if (tagsByCategory[categoryName]) return;
    try {
      const response = await fetch(`${API_BASE_URL}/book-categories/${encodeURIComponent(categoryName)}/tags`);
      if (!response.ok) throw new Error(`Failed to fetch tags for ${categoryName}`);
      const data: Tag = await response.json();
      setTagsByCategory((prev) => ({
        ...prev,
        [categoryName]: data.tags || [],
      }));
    } catch (err) {
      console.error(`Error fetching tags for ${categoryName}:`, err);
    }
  };

  const fetchSubCategoriesForCategory = async (categoryName: string) => {
    if (subCategoriesByCategory[categoryName]) return;
    try {
      const response = await fetch(`${API_BASE_URL}/book-categories/${encodeURIComponent(categoryName)}`);
      if (!response.ok) throw new Error(`Failed to fetch subcategories for ${categoryName}`);
      const data = await response.json();
      setSubCategoriesByCategory((prev) => ({
        ...prev,
        [categoryName]: data.subCategories || [],
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

  const handleMobileCategoryToggle = (categoryName: string) => {
    if (categoryName === "Request Your Book") return;
    
    if (expandedMobileCategory === categoryName) {
      setExpandedMobileCategory(null);
      setExpandedMobileSubCategory(null);
    } else {
      setExpandedMobileCategory(categoryName);
      setExpandedMobileSubCategory(null);
      fetchTagsForCategory(categoryName);
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
              src={settings?.logo || "/Images/placeholder-logo.png"}
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
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="h-4 w-4 text-gray-500"
                    title="Search"
                  />
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
        {/* Mobile/Tablet Menu Toggle */}
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
            {/* Mobile/Tablet Menu */}
            <ul
              className={`${
                isMenuOpen ? "block" : "hidden"
              } xl:hidden p-4 space-y-2 bg-yellow-200`}
            >
              {categories.map(({ _id, name }) => (
                <li key={_id}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={name === "Request Your Book" ? "/request-book" : `/${name.toLowerCase().replace(/ /g, '-')}`}
                      className={`flex-1 text-gray-800 font-medium text-sm p-2 transition-all duration-300 ${
                        name === "Request Your Book" 
                          ? "bg-black text-white hover:bg-gray-800" 
                          : "hover:bg-orange-500 hover:text-white"
                      }`}
                      onClick={() => {
                        if (name === "Request Your Book") {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      {name}
                    </Link>
                    {name !== "Request Your Book" && (
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
                  {/* Mobile Subcategories */}
                  {expandedMobileCategory === name && subCategoriesByCategory[name] && (
                    <div className="mt-2 bg-white shadow-lg">
                      <ul className="py-2">
                        {subCategoriesByCategory[name].length > 0 ? (
                          subCategoriesByCategory[name].map((subCategory) => (
                            <li key={subCategory._id}>
                              <div className="flex items-center justify-between">
                                <Link
                                  href={`/${name.toLowerCase().replace(/ /g, '-')}/${subCategory.name.toLowerCase().replace(/ /g, '-')}`}
                                  className="flex-1 text-gray-600 text-sm p-2 hover:text-white hover:bg-orange-50 transition-colors duration-200"
                                  onClick={() => {
                                    if (!hasSubSubCategories(subCategory)) {
                                      setIsMenuOpen(false);
                                      setExpandedMobileCategory(null);
                                    }
                                  }}
                                >
                                  {subCategory.name}
                                </Link>
                                {hasSubSubCategories(subCategory) && (
                                  <button
                                    onClick={() => handleMobileSubCategoryToggle(subCategory.name)}
                                    className="p-2 text-gray-600 hover:text-orange-600"
                                    aria-label={`Toggle ${subCategory.name} sub-subcategories`}
                                  >
                                    <FontAwesomeIcon
                                      icon={expandedMobileSubCategory === subCategory.name ? faChevronUp : faChevronDown}
                                      className="h-3 w-3"
                                    />
                                  </button>
                                )}
                              </div>
                              {/* Mobile Sub-subcategories */}
                              {expandedMobileSubCategory === subCategory.name && hasSubSubCategories(subCategory) && (
                                <div className="mt-2 ml-4 bg-gray-50 shadow-lg">
                                  <ul className="py-2">
                                    {subCategory.subSubCategories.map((subSubCategory) => (
                                      <li key={subSubCategory}>
                                        <Link
                                          href={`/${name.toLowerCase().replace(/ /g, '-')}/${subCategory.name.toLowerCase().replace(/ /g, '-')}/${subSubCategory.toLowerCase().replace(/ /g, '-')}`}
                                          className="block text-gray-500 text-sm p-2 pl-4 hover:text-white hover:bg-orange-400 transition-colors duration-200"
                                          onClick={() => {
                                            setIsMenuOpen(false);
                                            setExpandedMobileCategory(null);
                                            setExpandedMobileSubCategory(null);
                                          }}
                                        >
                                          {subSubCategory}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500 text-sm p-2 italic">No subcategories available</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Mobile Tags (fallback if no subcategories) */}
                  {expandedMobileCategory === name && (!subCategoriesByCategory[name] || subCategoriesByCategory[name].length === 0) && tagsByCategory[name] && (
                    <div className="mt-2 bg-white shadow-lg">
                      <ul className="py-2">
                        {tagsByCategory[name].length > 0 ? (
                          tagsByCategory[name].map((tag) => (
                            <li key={tag}>
                              <Link
                                href={`/${name.toLowerCase().replace(/ /g, '-')}/?tag=${encodeURIComponent(tag)}`}
                                className="block text-gray-600 text-sm p-2 hover:text-white hover:bg-orange-50 transition-colors duration-200"
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setExpandedMobileCategory(null);
                                }}
                              >
                                {tag}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500 text-sm p-2 italic">No subcategories available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Desktop Menu */}
            <div className="hidden xl:block relative">
              <ul className="flex justify-center p-2 space-x-1 flex-wrap">
                {categories.map(({ _id, name }) => (
                  <li 
                    key={_id} 
                    className="relative"
                    onMouseEnter={() => {
                      if (name !== "Request Your Book") {
                        setActiveDropdown(name);
                        setActiveSubDropdown(null);
                        fetchTagsForCategory(name);
                        fetchSubCategoriesForCategory(name);
                      }
                    }}
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setActiveSubDropdown(null);
                    }}
                  >
                    {name === "Request Your Book" ? (
                      <Link
                        href="/request-book"
                        className="inline-block font-bold text-md px-3 py-2 bg-black text-white hover:bg-gray-800 transition-all duration-300"
                      >
                        {name}
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/${name.toLowerCase().replace(/ /g, '-')}`}
                          className={`inline-block text-gray-800 font-bold text-md px-3 py-2 transition-all duration-300 ${
                            activeDropdown === name 
                              ? 'bg-orange-500 text-white' 
                              : 'hover:bg-orange-500 hover:text-white'
                          }`}
                        >
                          {name}
                        </Link>
                        {/* Desktop Dropdown - Subcategories */}
                        {activeDropdown === name && subCategoriesByCategory[name] && subCategoriesByCategory[name].length > 0 && (
                          <div 
                            className="absolute top-full left-0 z-50 mt-0 w-[280px] bg-white shadow-2xl overflow-hidden"
                            onMouseLeave={() => {
                              setActiveSubDropdown(null);
                            }}
                          >
                            <ul className="py-1">
                              {subCategoriesByCategory[name].map((subCategory) => (
                                <li 
                                  key={subCategory._id} 
                                  className="relative"
                                  onMouseEnter={() => setActiveSubDropdown(subCategory.name)}
                                  onMouseLeave={(e) => {
                                    // Only clear if not moving to the sub-dropdown
                                    if (!hasSubSubCategories(subCategory)) {
                                      setActiveSubDropdown(null);
                                    }
                                  }}
                                >
                                  <div 
                                    className={`flex items-center justify-between transition-all duration-200 ${
                                      activeSubDropdown === subCategory.name 
                                        ? 'bg-orange-600 text-white' 
                                        : 'hover:bg-orange-600 hover:text-white'
                                    }`}
                                  >
                                    <Link
                                      href={`/${name.toLowerCase().replace(/ /g, '-')}/${subCategory.name.toLowerCase().replace(/ /g, '-')}`}
                                      className="flex-1 text-gray-700 font-bold text-md px-3 py-2"
                                    >
                                      {subCategory.name}
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
                                  {/* Desktop Sub-subcategories Dropdown */}
                                  {activeSubDropdown === subCategory.name && hasSubSubCategories(subCategory) && (
                                    <div 
                                      className="absolute top-0 left-full z-60 w-[250px] bg-white shadow-2xl overflow-hidden border-l"
                                      onMouseEnter={() => setActiveSubDropdown(subCategory.name)}
                                      onMouseLeave={() => setActiveSubDropdown(null)}
                                    >
                                      <ul className="py-1">
                                        {subCategory.subSubCategories.map((subSubCategory) => (
                                          <li key={subSubCategory}>
                                            <Link
                                              href={`/${name.toLowerCase().replace(/ /g, '-')}/${subCategory.name.toLowerCase().replace(/ /g, '-')}/${subSubCategory.toLowerCase().replace(/ /g, '-')}`}
                                              className="block text-gray-700 font-bold text-md px-3 py-2 hover:bg-orange-600 hover:text-white transition-all duration-200"
                                            >
                                              {subSubCategory}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Desktop Dropdown - Tags (fallback if no subcategories) */}
                        {activeDropdown === name && (!subCategoriesByCategory[name] || subCategoriesByCategory[name].length === 0) && tagsByCategory[name] && (
                          <div className="absolute top-full left-0 z-50 mt-0 w-[280px] bg-white shadow-2xl overflow-hidden">
                            <ul className="py-1">
                              {tagsByCategory[name].length > 0 ? (
                                tagsByCategory[name].map((tag) => (
                                  <li key={tag}>
                                    <Link
                                      href={`/${name.toLowerCase().replace(/ /g, '-')}/?tag=${encodeURIComponent(tag)}`}
                                      className="block text-gray-700 font-bold text-md px-3 py-2 hover:bg-orange-600 hover:text-white transition-all duration-200"
                                    >
                                      {tag}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500 font-bold text-md px-3 py-2 italic">No subcategories available</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}