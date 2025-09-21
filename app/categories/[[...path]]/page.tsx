"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header/page";
import Footer from "../../components/footer/page";
import { Component, ReactNode } from "react";
import { API_BASE_URL } from "@/utils/api";
import { normalizeUrlParam, normalizeDisplayName } from "@/utils/stringUtils";
import { Filter, X } from "lucide-react";

import { Book } from "@/app/admin/order-product-management/types";
import { useAtom } from "jotai";
import { categoriesAtom } from "@/app/store/data";

const defaultImageUrl =
  "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

interface Category {
  _id: string;
  name: string;
  path: string;
  children: Category[];
  books: Book[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-center text-red-500">
          Something went wrong while loading this page.
        </p>
      );
    }
    return this.props.children;
  }
}

export default function CategoryPage() {
  const params = useParams();
  const query = useSearchParams();

  const [classRecieved, setClassRecieved] = useState<string | null>("");
  const path = (params.path as string[])?.join("/") || "school-books";

  const [category, setCategory] = useState<Category | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryPath, setSelectedCategoryPath] =
    useState<string>(path);
  const [priceRange, setPriceRange] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [booksToShow, setBooksToShow] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bookImageUrls, setBookImageUrls] = useState<Record<string, string>>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesAtomState] = useAtom(categoriesAtom);
  // 🔹 Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const classCategory = query.get("class");
    if (classCategory) setClassRecieved(classCategory);
  }, [query]);
  useEffect(() => {
    if (classRecieved)
      setSelectedCategoryPath((prev) => prev + "/" + classRecieved);
  }, [classRecieved]);
  useEffect(() => {
    const fetchCategoryAndBooks = async () => {
      try {
        setLoading(true);
        const categoryObjectFound = categoriesAtomState?.find(
          (category) => category.name === path
        );
        if (categoryObjectFound) setCategory(categoryObjectFound);
        if (!(categoriesAtomState?.length && categoriesAtomState.length > 0)) {
          // Fetch category
          const categoryResponse = await fetch(
            `${API_BASE_URL}/book-categories/${encodeURIComponent(path)}`,
            {
              cache: "no-store",
            }
          );
          if (!categoryResponse.ok) {
            if (categoryResponse.status === 404) {
              throw new Error(`Category '${path}' not found`);
            }
            throw new Error(
              `Failed to fetch category: ${categoryResponse.statusText}`
            );
          }
          const categoryData: Category = await categoryResponse.json();
          console.log(categoryData)

          if (!categoryData.name || typeof categoryData.name !== "string") {
            throw new Error("Invalid category name");
          }
          setCategory(categoryData);
        }

        // Fetch all books under the root category path
        const booksResponse = await fetch(
          `${API_BASE_URL}/books/${encodeURIComponent(path)}`,
          {
            cache: "no-store",
          }
        );
        if (!booksResponse.ok) {
          if (booksResponse.status === 404) {
            throw new Error(`No books found for category path '${path}'`);
          }
          throw new Error(`Failed to fetch books: ${booksResponse.statusText}`);
        }
        const booksData: Book[] = await booksResponse.json();

        setBooks(
          (booksData || []).filter(
            (book) =>
              book._id && book.title && typeof book.categoryPath === "string"
          )
        );
        setBooksToShow(booksData?.length || 0);
      } catch (err) {
        if (err instanceof Error) {
          
          setError(
            err.message ||
              "Failed to load category or books. Please try again later."
          );
        } else {
          
          setError("Failed to load category or books. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndBooks();
  }, [path]);

  useEffect(() => {
    const initialImageUrls =
      books.length > 0
        ? books.reduce<Record<string, string>>(
            (acc, book) => ({
              ...acc,
              [book._id]: book.imageUrl || defaultImageUrl,
            }),
            {}
          )
        : {};
    setBookImageUrls(initialImageUrls);
  }, [books]);

  // Flatten categories to calculate book counts for all levels
  const flattenCategories = (
    categories: Category[],
    parentPath: string = ""
  ): Category[] => {
    let result: Category[] = [];
    categories.forEach((cat) => {
      const currentPath = parentPath ? `${parentPath}/${cat.name}` : cat.name;
      result.push({ ...cat, path: currentPath });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(
          flattenCategories(cat.children, currentPath)
        ) as Category[];
      }
    });
    return result;
  };

  const allCategories = category ? flattenCategories([category]) : [];

  const bookCounts = allCategories.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat.path] = books.filter(
        (book) =>
          book.categoryPath === cat.path ||
          book.categoryPath.startsWith(`${cat.path}/`)
      ).length;
      return acc;
    },
    {}
  );

  // Find the selected category and its children
  // const selectedCategory = allCategories.find((cat) => cat.path === selectedCategoryPath) || category;
  // const subCategories = selectedCategory ? selectedCategory.children : [];

  const filteredBooks = books
    .filter((book) => {
      // ✅ Search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.bookName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      const matchesCategory =
        book.categoryPath === selectedCategoryPath ||
        book.categoryPath.startsWith(`${selectedCategoryPath}/`);
      const price = book.discountedPrice || book.price || 0;
      const matchesPrice =
        priceRange === "" ||
        (priceRange === "0to500" && price <= 500) ||
        (priceRange === "500to1000" && price > 500 && price <= 1000) ||
        (priceRange === "1000to1500" && price > 1000 && price <= 1500) ||
        (priceRange === "1500to2000" && price > 1500 && price <= 2000);
      const matchesStatus =
        status === "" ||
        (status === "inStock" &&
          (book.quantityNew || 0) + (book.quantityOld || 0) > 0) ||
        (status === "outOfStock" &&
          (book.quantityNew || 0) + (book.quantityOld || 0) === 0) ||
        (status === "onSale" && (book.effectiveDiscount || 0) > 0);
      return matchesSearch && matchesCategory && matchesPrice && matchesStatus;
    })
    .sort((a, b) => {
      const priceA = a.discountedPrice || a.price || 0;
      const priceB = b.discountedPrice || b.price || 0;
      if (sortOption === "price-low-high") return priceA - priceB;
      if (sortOption === "price-high-low") return priceB - priceA;
      return 0;
    })
    .slice(0, booksToShow);

  const handleCategoryChange = (categoryPath: string) => {
    setSelectedCategoryPath(categoryPath);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(e.target.id);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.id);
  };

  const handleBooksToShowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBooksToShow(value === "all" ? books.length : parseInt(value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleViewToggle = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleImageError = (bookId: string) => {
    setBookImageUrls((prev) => ({
      ...prev,
      [bookId]: defaultImageUrl,
    }));
  };

  // Find the category hierarchy for radio button rendering
  const getCategoryHierarchy = (
    path: string,
    categories: Category[]
  ): Category[] => {
    const hierarchy: Category[] = [];
    let currentPath = "";
    const segments = path.split("/");
    let currentCategories = categories;

    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const category = currentCategories.find(
        (cat) => cat.path === currentPath
      );
      if (category) {
        hierarchy.push(category);
        currentCategories = category.children;
      } else {
        break;
      }
    }
    return hierarchy;
  };

  const categoryHierarchy = category
    ? getCategoryHierarchy(selectedCategoryPath, [category])
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="mb-6 px-6 sm:px-8 md:px-12">
        <div className="flex items-center w-full max-w-xl mx-auto border rounded-lg shadow-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // reactive search
            placeholder="Search books..."
            className="flex-grow px-4 py-2 rounded-l-lg outline-none"
          />
        </div>
      </section>
      <ErrorBoundary>
        <main className="flex-grow px-6 sm:px-8 md:px-12 py-6 relative">
          <div className="flex ">
            <span
              className="absolute top-15 left-1 p-4 flex justify-center items-center rounded-br-lg rounded-tr-lg bg-white lg:hidden shadow-xl w-15 h-10 z-1 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <Filter />
            </span>

            <aside
              className={` z-2 translate-x-[-200%] overflow-hidden transition duration-500 lg:w-1/4 lg:translate-x-[0]  lg:pr-6 mb-6 lg:mb-0 lg:block ${
                isOpen
                  ? "block  translate-x-[0] bg-white w-80 p-6 rounded-lg absolute top-0 left-0 lg:static"
                  : "hidden  "
              }`}
            >
              <span className=" flex justify-between">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Subcategories
              </h2>
              {isOpen && <X
                className="block lg:hidden cursor-pointer"
                onClick={() => setIsOpen(false)}
              />}
              </span>
              <div className="border rounded-lg p-4 bg-gray-50 shadow-md mb-6">
                {category && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={category.path}
                        name="category"
                        className="mr-2 accent-orange-500"
                        onChange={() => handleCategoryChange(category.path)}
                        checked={selectedCategoryPath === category.path}
                      />
                      <label
                        htmlFor={category.path}
                        className="text-gray-800 text-sm"
                      >
                        {bookCounts[category.path] > 0
                          ? `${normalizeDisplayName(category.name)} - ${
                              bookCounts[category.path]
                            } books`
                          : normalizeDisplayName(category.name)}
                      </label>
                    </div>
                    {categoryHierarchy.map((cat, index) => (
                      <div
                        key={cat._id}
                        className={`pl-${(index + 1) * 4} mb-2`}
                      >
                        {cat.children.map((subCat) => (
                          <div
                            key={subCat._id}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="radio"
                              id={subCat.path}
                              name="category"
                              className="mr-2 accent-orange-500"
                              onChange={() => handleCategoryChange(subCat.path)}
                              checked={selectedCategoryPath === subCat.path}
                            />
                            <label
                              htmlFor={subCat.path}
                              className="text-gray-800 text-sm"
                            >
                              {bookCounts[subCat.path] > 0
                                ? `${normalizeDisplayName(subCat.name)} - ${
                                    bookCounts[subCat.path]
                                  } books`
                                : normalizeDisplayName(subCat.name)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id=""
                    name="category"
                    className="mr-2 accent-orange-500"
                    onChange={() => handleCategoryChange(path)}
                    checked={selectedCategoryPath === path}
                  />
                  <label className="text-gray-800 text-sm">All</label>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Filter by Price
              </h2>
              <div className="border rounded-lg p-4 bg-gray-50 shadow-md mb-6">
                {["0to500", "500to1000", "1000to1500", "1500to2000"].map(
                  (range) => (
                    <div key={range} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={range}
                        name="price"
                        className="mr-2 accent-orange-500"
                        onChange={handlePriceChange}
                        checked={priceRange === range}
                      />
                      <label htmlFor={range} className="text-gray-800 text-sm">
                        {range === "0to500"
                          ? "₹0 - ₹500"
                          : range === "500to1000"
                          ? "₹500 - ₹1,000"
                          : range === "1000to1500"
                          ? "₹1,000 - ₹1,500"
                          : "₹1,500 - ₹2,000"}
                      </label>
                    </div>
                  )
                )}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id=""
                    name="price"
                    className="mr-2 accent-orange-500"
                    onChange={() => setPriceRange("")}
                    checked={priceRange === ""}
                  />
                  <label className="text-gray-800 text-sm">All</label>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Product Status
              </h2>
              <div className="border rounded-lg p-4 bg-gray-50 shadow-md">
                {["inStock", "outOfStock", "onSale"].map((stat) => (
                  <div key={stat} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={stat}
                      name="status"
                      className="mr-2 accent-orange-500"
                      onChange={handleStatusChange}
                      checked={status === stat}
                    />
                    <label htmlFor={stat} className="text-gray-800 text-sm">
                      {stat === "inStock"
                        ? "In Stock"
                        : stat === "outOfStock"
                        ? "Out of Stock"
                        : "On Sale"}
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id=""
                    name="status"
                    className="mr-2 accent-orange-500"
                    onChange={() => setStatus("")}
                    checked={status === ""}
                  />
                  <label className="text-gray-800 text-sm">All</label>
                </div>
              </div>
            </aside>

            <section className="w-full lg:w-3/4 pl-0 lg:pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {category
                  ? normalizeDisplayName(category.name)
                  : normalizeDisplayName(path)}
                {selectedCategoryPath !== path
                  ? ` > ${normalizeDisplayName(
                      selectedCategoryPath.split("/").pop()
                    )}`
                  : ""}
              </h2>
              <div className="mb-4 flex flex-col lg:flex-row justify-between items-center">
                <div className="flex items-center mb-2 lg:mb-0">
                  <span
                    className="mr-2 text-3xl cursor-pointer"
                    onClick={() => handleViewToggle("grid")}
                  >
                    <FontAwesomeIcon
                      icon={faThLarge}
                      className={`text-gray-800 ${
                        viewMode === "grid" ? "text-orange-500" : ""
                      } hover:text-orange-500 transition-colors duration-300`}
                    />
                  </span>
                  <span
                    className="cursor-pointer ml-4 text-3xl"
                    onClick={() => handleViewToggle("list")}
                  >
                    <FontAwesomeIcon
                      icon={faList}
                      className={`text-gray-800 ${
                        viewMode === "list" ? "text-orange-500" : ""
                      } hover:text-orange-500 transition-colors duration-300`}
                    />
                  </span>
                </div>
                <div className="flex space-x-4">
                  <select
                    className="border rounded p-1 text-lg text-gray-800"
                    onChange={handleBooksToShowChange}
                    value={
                      booksToShow === books.length
                        ? "all"
                        : booksToShow.toString()
                    }
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="36">36</option>
                    <option value="all">Show All</option>
                  </select>
                  <select
                    className="border rounded p-1 text-lg text-gray-800"
                    onChange={handleSortChange}
                    value={sortOption}
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <p className="text-center text-gray-800">Loading books...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : filteredBooks.length === 0 ? (
                <p className="text-center text-gray-800">
                  No books found for &apos;
                  {normalizeDisplayName(category?.name || path)}&apos;. Add
                  books in the admin panel to display them.
                </p>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredBooks.map((book) => (
                    <Link
                      href={`/overview1/${
                        book._id
                      }?category=${encodeURIComponent(
                        normalizeUrlParam(path)
                      )}&imageUrl=${encodeURIComponent(
                        bookImageUrls[book._id] || defaultImageUrl
                      )}`}
                      key={book._id}
                      passHref
                    >
                      <div
                        className={`border rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                          viewMode === "grid" ? "h-80" : "h-40 flex"
                        }`}
                      >
                        <div className="relative">
                          <Image
                            src={bookImageUrls[book._id] || defaultImageUrl}
                            alt={book.title}
                            width={150}
                            height={viewMode === "grid" ? 192 : 128}
                            className="w-full h-48 object-cover md:h-48 lg:h-48"
                            onError={() => handleImageError(book._id)}
                            style={{ objectFit: "cover" }}
                          />
                          {book.effectiveDiscount > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {book.effectiveDiscount}% OFF
                            </span>
                          )}
                        </div>
                        <div
                          className={`p-2 ${
                            viewMode === "grid"
                              ? "text-center"
                              : "text-left flex-1"
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-gray-900">
                            {book.title}
                          </h3>
                          <p className="text-orange-500 font-bold mt-1">
                            ₹
                            {(book.discountedPrice || book.price || 0).toFixed(
                              2
                            )}
                            {book.effectiveDiscount > 0 ? (
                              <span className="text-gray-500 text-sm line-through ml-2">
                                ₹{(book.price || 0).toFixed(2)}
                              </span>
                            ) : null}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {normalizeDisplayName(book.categoryPath)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
