// app/components/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faBars,
  faChevronDown,
  faChevronUp,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/utils/api";
import { useAtom } from "jotai";
import { categoriesAtom, siteSettingsAtom } from "@/app/store/data";
import {
  Category,
  SiteSettings,
} from "@/app/admin/order-product-management/types";
import { useRouter } from "next/navigation";
import useCheckIsLoggedIn from "@/app/hooks/useCheckIsLoggedIn";
import axios from "axios";
import { roleAtom } from "@/app/store/auth";

// ✅ Helper
const normalizeDisplayName = (name: string | undefined | null) => {
  if (!name || typeof name !== "string") return "Unnamed Category";
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

// ✅ Category Menu Recursive Component
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
    (category) => category.name && typeof category.name === "string"
  );

  return (
    <ul
      className={`${isMobile ? "py-2" : "py-1"} ${
        level > 0 && !isMobile ? "border-l" : ""
      }`}
    >
      {validCategories.map((category) => {
        const isOpen = openCategories[category._id];
        const hasChildren = category.children.length > 0;

        return (
          <li
            key={category._id}
            className={isMobile ? "mb-2" : "relative"}
            onMouseEnter={
              !isMobile ? () => toggleCategory(category._id) : undefined
            }
            onMouseLeave={
              !isMobile ? () => toggleCategory(category._id) : undefined
            }
          >
            <div
              className={`flex items-center justify-between transition-all duration-200
                ${
                  isOpen
                    ? "bg-orange-400 text-white"
                    : "hover:bg-orange-300 hover:text-white"
                }
                ${
                  isMobile
                    ? "text-gray-600 text-sm p-2"
                    : "text-gray-700 font-bold text-sm px-3 py-2"
                }
              `}
              style={{
                width: "fit-content",
                minWidth: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <Link href={`/categories/${category.path}`} className="flex-1">
                {normalizeDisplayName(category.name)}
              </Link>
              {hasChildren && (
                <button
                  onClick={() => toggleCategory(category._id)}
                  className={`p-2 ${
                    isMobile
                      ? "text-gray-600 hover:text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      isOpen
                        ? isMobile
                          ? faChevronUp
                          : faChevronRight
                        : faChevronDown
                    }
                    className="h-3 w-3"
                  />
                </button>
              )}
            </div>

            {/* Submenu */}
            {isOpen && hasChildren && (
              <div
                className={`${
                  isMobile
                    ? "pl-4 mt-2 bg-white shadow-lg"
                    : "absolute top-0 left-full bg-white shadow-2xl z-50"
                }`}
                style={{ minWidth: "150px" }}
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

// ✅ Header
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const { isLoggedIn, checking } = useCheckIsLoggedIn(true);
  const [categoriesAtomState, setCategoriesAtomState] = useAtom(categoriesAtom);
  const [siteSettingsAtomState, setSiteSettingsAtomState] =
    useAtom(siteSettingsAtom);
    const [,setRoleAtomValue] = useAtom(roleAtom)
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    setRoleAtomValue(null);
    router.replace("/login");
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!siteSettingsAtomState) {
          const res = await fetch(`${API_BASE_URL}/settings`);
          if (!res.ok) throw new Error("Failed to fetch settings");
          const data = await res.json();
          setSettings(data);
          setSiteSettingsAtomState(data);
        } else setSettings(siteSettingsAtomState);
      } catch {
        setError("Failed to load site settings.");
      }
    };

    const fetchCategories = async () => {
      try {
        if (siteSettingsAtomState) {
          if (
            !(categoriesAtomState?.length && categoriesAtomState.length > 0)
          ) {
            const res = await fetch(`${API_BASE_URL}/book-categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data: Category[] = await res.json();
            setCategories(
              data.filter((c) => c.name && typeof c.name === "string")
            );
            console.log(data);
            setCategoriesAtomState(data);
          } else {
            console.log(categoriesAtomState);
            setCategories(categoriesAtomState);
          }
        }
      } catch {
        setError("Error loading categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchCategories();
  }, [categoriesAtomState, siteSettingsAtomState]);

  const toggleCategory = (id: string) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white text-black font-sans">
      {/* Top Section */}
      <div className="max-w-screen-xl mx-auto flex  md:flex-row items-center justify-between gap-4 px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={
              settings?.logo ||
              "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg"
            }
            alt="Books Store Logo"
            width={60}
            height={60}
            className="rounded-full min-w-[60px]"
          />
          <span className="font-bold  text-sm sm:text-base lg:text-lg">
            Book Store
          </span>
        </Link>

        {/* Help + User Actions */}
        <div className="flex  sm:flex-row items-center gap-2 sm:gap-6 text-sm sm:text-base">
          <span className="text-orange-500 hidden sm:inline-block">
            Need help? Call: <span className="text-black">+91 7977250185</span>
          </span>
          <div className="flex gap-4 items-center">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-amber-200 rounded-md text-sm hover:bg-amber-300"
              >
                Logout
              </button>
            )}
            <Link href={`/${isLoggedIn ? "profile" : "login"}`}>
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            </Link>
            <Link href="/cart" className="relative">
              <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-yellow-200">
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          {/* Mobile Toggle */}
          <div className="xl:hidden flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </Button>
          </div>

          {/* Loader / Error */}
          {checking || loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : (
            <>
              {/* Mobile Menu */}
              <ul
                className={`${
                  isMenuOpen ? "block" : "hidden"
                } xl:hidden space-y-2 py-2`}
              >
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

              {/* Desktop Menu */}
              <ul className="hidden xl:flex justify-center gap-2">
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="relative"
                    onMouseEnter={() => toggleCategory(cat._id)}
                    onMouseLeave={() => setOpenCategories({})}
                  >
                    <Link
                      href={`/categories/${cat.path}`}
                      className={`px-3 py-2 text-sm font-bold ${
                        openCategories[cat._id]
                          ? "bg-orange-400 text-white"
                          : "hover:bg-orange-300 hover:text-white"
                      }`}
                    >
                      {normalizeDisplayName(cat.name)}
                    </Link>
                    {openCategories[cat._id] && cat.children.length > 0 && (
                      <div className="absolute left-0 top-full bg-white shadow-lg z-50">
                        <CategoryMenu
                          categories={cat.children}
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
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
