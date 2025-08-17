// app/components/header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faShoppingCart,
  faBars,
  faSearch,
  faChevronDown,
  faChevronUp,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/bookstore';

interface Category {
  _id: string;
  name: string;
  path: string;
  children: Category[];
  books: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

const normalizeDisplayName = (name: string | undefined | null) => {
  if (!name || typeof name !== 'string') {
    console.warn('[normalizeDisplayName] Invalid category name:', name);
    return 'Unnamed Category';
  }
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

interface CategoryMenuProps {
  categories: Category[];
  level: number;
  isMobile: boolean;
  openCategories: Record<string, boolean>;
  toggleCategory: (categoryId: string) => void;
  closeAll: () => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  level,
  isMobile,
  openCategories,
  toggleCategory,
  closeAll,
}) => {
  const validCategories = categories.filter(
    (category) => category.name && typeof category.name === 'string'
  );

  return (
    <ul
      className={`${isMobile ? 'py-2' : 'py-1'} ${level > 0 && !isMobile ? 'border-l' : ''}`}
    >
      {validCategories.map((category) => {
        const isOpen = openCategories[category._id];
        const hasChildren = category.children.length > 0;

        return (
          <li
            key={category._id}
            className={isMobile ? 'mb-2' : 'relative'}
            onMouseEnter={!isMobile ? () => toggleCategory(category._id) : undefined}
            onMouseLeave={!isMobile ? () => toggleCategory(category._id) : undefined}
          >
            {/* Main category button/link */}
            <div
              className={`flex items-center justify-between transition-all duration-200
                ${isOpen ? 'bg-orange-400 text-white' : 'hover:bg-orange-300 hover:text-white'}
                ${isMobile ? 'text-gray-600 text-sm p-2' : 'text-gray-700 font-bold text-sm px-3 py-2'}
              `}
              style={{
                width: 'fit-content',
                minWidth: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              <Link
                href={`/categories/${category.path}`}
                className="flex-1"
              >
                {normalizeDisplayName(category.name)}
              </Link>
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(category._id)}
                  className={`p-2 ${isMobile ? 'text-gray-600 hover:text-orange-600' : 'text-gray-500'}`}
                  aria-label={`Toggle ${normalizeDisplayName(category.name)} subcategories`}
                >
                  <FontAwesomeIcon
                    icon={
                      isOpen
                        ? faChevronUp
                        : isMobile
                        ? faChevronDown
                        : faChevronRight
                    }
                    className="h-3 w-3"
                  />
                </button>
              )}
            </div>

            {/* Submenu */}
            {isOpen && hasChildren && (
              <div
                className={`${isMobile ? 'pl-4 mt-2 bg-white shadow-lg' : 'absolute top-0 left-full bg-white shadow-2xl z-50'}`}
                style={{
                  width: 'max-content',
                  minWidth: '150px',
                  whiteSpace: 'nowrap',
                }}
              >
                <CategoryMenu
                  categories={category.children}
                  level={level + 1}
                  isMobile={isMobile}
                  openCategories={openCategories}
                  toggleCategory={toggleCategory}
                  closeAll={closeAll}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('[Header] Error fetching settings:', err);
        setError('Failed to load site settings.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/book-categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await response.json();
        console.log('[Header] Raw API response:', JSON.stringify(data, null, 2));
        const validCategories = data.filter(
          (category) => category.name && typeof category.name === 'string'
        );
        setCategories(validCategories);
      } catch (err) {
        console.error('[Header] Error fetching categories:', err);
        setError('Error loading categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchCategories();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const results = await response.json();
      console.log('[Header] Search results:', results);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } catch (err) {
      console.error('[Header] Search error:', err);
      setSearchError('Failed to perform search. Please try again later.');
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setOpenCategories({});
  };

  return (
    <div className="bg-white text-black font-sans">
      <div className="px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={settings?.logo || 'https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg'}
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
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-500" />
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
            <FontAwesomeIcon icon={faUser} size="lg" className="text-lg sm:text-xl" />
          </Link>
          <Link href="/cart" className="relative text-black hover:underline">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" className="text-lg sm:text-xl" />
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
            <ul className={`${isMenuOpen ? 'block' : 'hidden'} xl:hidden p-4 space-y-2 bg-yellow-200`}>
              <CategoryMenu
                categories={categories}
                level={0}
                isMobile={true}
                openCategories={openCategories}
                toggleCategory={toggleCategory}
                closeAll={() => {
                  setIsMenuOpen(false);
                  setOpenCategories({});
                }}
              />
            </ul>

            <div className="hidden xl:block">
              <div className="w-full">
                <ul className="flex justify-center items-center flex-wrap gap-1 px-2">
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      className="relative"
                      onMouseEnter={() => toggleCategory(category._id)}
                      onMouseLeave={() => setOpenCategories({})}
                    >
                      <div className="flex items-center">
                        <Link
                          href={`/categories/${category.path}`}
                          className={`whitespace-nowrap font-bold text-gray-800 text-xs lg:text-sm px-2 lg:px-3 py-2 transition-all duration-300 ${
                            openCategories[category._id] ? 'bg-orange-400 text-white' : 'hover:bg-orange-300 hover:text-white'
                          }`}
                        >
                          {normalizeDisplayName(category.name)}
                        </Link>
                        {category.children.length > 0 && (
                          <button
                            className="p-1 lg:p-2 text-gray-600 hover:text-orange-300"
                            aria-label={`Toggle ${normalizeDisplayName(category.name)} subcategories`}
                          >
                            <FontAwesomeIcon
                              icon={openCategories[category._id] ? faChevronUp : faChevronDown}
                              className="h-2 w-2 lg:h-3 lg:w-3"
                            />
                          </button>
                        )}
                      </div>
                      {openCategories[category._id] && category.children.length > 0 && (
                        <div
                          className="absolute left-0 mt-0 bg-white shadow-2xl z-50"
                          style={{ width: 'max-content', minWidth: '150px' }}
                        >
                          <CategoryMenu
                            categories={category.children}
                            level={1}
                            isMobile={false}
                            openCategories={openCategories}
                            toggleCategory={toggleCategory}
                            closeAll={() => setOpenCategories({})}
                          />
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