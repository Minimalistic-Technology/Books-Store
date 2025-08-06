"use client";

import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "../../utils/api";

interface SubCategory {
  name: string;
  subSubCategories: string[];
  subCategoryDiscount?: number;
}

interface Book {
  _id: string;
  title: string;
  price: number;
  subCategory: string;
  subSubCategory?: string;
  tags: string[];
  imageUrl?: string;
  effectiveDiscount?: number;
  discountedPrice?: number;
  quantityNew?: number;
  quantityOld?: number;
}

interface CategoryData {
  name: string;
  subCategories: SubCategory[];
  books: Book[];
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const subCategory = Array.isArray(params.subCategory) ? params.subCategory[0] : params.subCategory;
  const subSubCategory = Array.isArray(params.subSubCategory) ? params.subSubCategory[0] : params.subSubCategory;
  const tagFromUrl = searchParams.get("tag");
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(tagFromUrl ? [tagFromUrl] : []);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    subCategory ? decodeURIComponent(subCategory) : ""
  );
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string>(
    subSubCategory ? decodeURIComponent(subSubCategory) : ""
  );
  const [priceRange, setPriceRange] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [booksToShow, setBooksToShow] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>("default");
  const defaultImageUrl = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";
  const [bookImageUrls, setBookImageUrls] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for category:", category, "subCategory:", subCategory, "subSubCategory:", subSubCategory);
        const url = subSubCategory
          ? `${API_BASE_URL}/book-categories/${encodeURIComponent(category || "")}/${encodeURIComponent(
              subCategory || ""
            )}/${encodeURIComponent(subSubCategory)}`
          : subCategory
          ? `${API_BASE_URL}/book-categories/${encodeURIComponent(category || "")}/${encodeURIComponent(subCategory)}`
          : `${API_BASE_URL}/book-categories/${encodeURIComponent(category || "")}`;
        const booksResponse = await fetch(url);
        if (!booksResponse.ok) {
          if (booksResponse.status === 404) {
            throw new Error(
              `Category '${category}'${subCategory ? ` or subcategory '${subCategory}'` : ""}${
                subSubCategory ? ` or sub-subcategory '${subSubCategory}'` : ""
              } not found.`
            );
          }
          throw new Error("Failed to fetch data");
        }
        const data: CategoryData = await booksResponse.json();
        console.log(`Fetched data for ${category}:`, data);
        setCategoryData(data);
        setBooks(data.books || []);
        setBooksToShow(data.books.length || 0);

        const tagsResponse = await fetch(`${API_BASE_URL}/book-categories/${encodeURIComponent(category || "")}/tags`);
        if (!tagsResponse.ok) throw new Error("Failed to fetch tags");
        const tagsData = await tagsResponse.json();
        setTags(tagsData.tags || []);
      } catch (err: any) {
        setError(err.message || `Error loading data for ${category}. Please try again later.`);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (category) {
      fetchData();
    } else {
      setError("Category not specified.");
      setLoading(false);
    }
  }, [category, subCategory, subSubCategory]);

  useEffect(() => {
    const initialImageUrls = books.reduce(
      (acc, book) => ({
        ...acc,
        [book._id]: book.imageUrl || defaultImageUrl,
      }),
      {}
    );
    setBookImageUrls(initialImageUrls);
  }, [books]);

  const mapSubCategory = (subCat: string) => {
    const classMatch = subCat.match(/Class (\d+)/);
    if (classMatch) {
      const num = parseInt(classMatch[1]);
      return num <= 12 ? `Class ${["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][num - 1]}` : subCat;
    }
    return subCat === "Practical Notebooks"
      ? "Practical NoteBooks"
      : subCat === "Reference Books & Guides"
      ? "Reference Books&Notes"
      : subCat === "School Textbooks"
      ? "School Textbooks"
      : subCat;
  };

  const bookCountPerTag = tags.reduce(
    (acc, tag) => {
      acc[tag] = books.filter((book) => book.tags?.includes(tag)).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const bookCountPerSubCategory =
    categoryData?.subCategories.reduce(
      (acc, subCat) => {
        acc[subCat.name] = books.filter((book) => book.subCategory === subCat.name).length;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  const bookCountPerSubSubCategory =
    categoryData?.subCategories.reduce(
      (acc, subCat) => {
        subCat.subSubCategories.forEach((subSubCat) => {
          acc[subSubCat] = books.filter((book) => book.subSubCategory === subSubCat).length;
        });
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  const filteredBooks = books
    .filter((book) => {
      const matchesTag = selectedCategories.length === 0 || selectedCategories.some((tag) => book.tags?.includes(tag));
      const matchesSubCategory = !selectedSubCategory || book.subCategory === selectedSubCategory;
      const matchesSubSubCategory = !selectedSubSubCategory || book.subSubCategory === selectedSubSubCategory;
      const matchesPrice =
        priceRange === "" ||
        (priceRange === "0to500" && (book.discountedPrice || book.price) <= 500) ||
        (priceRange === "500to1000" && (book.discountedPrice || book.price) > 500 && (book.discountedPrice || book.price) <= 1000) ||
        (priceRange === "1000to1500" && (book.discountedPrice || book.price) > 1000 && (book.discountedPrice || book.price) <= 1500) ||
        (priceRange === "1500to2000" && (book.discountedPrice || book.price) > 1500 && (book.discountedPrice || book.price) <= 2000);
      const matchesStatus =
        status === "" ||
        (status === "inStock" && ((book.quantityNew || 0) + (book.quantityOld || 0) > 0)) ||
        (status === "outOfStock" && ((book.quantityNew || 0) + (book.quantityOld || 0) === 0)) ||
        (status === "onSale" && (book.effectiveDiscount || 0) > 0);
      return matchesTag && matchesSubCategory && matchesSubSubCategory && matchesPrice && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
      else if (sortOption === "price-high-low") return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
      return 0;
    })
    .slice(0, booksToShow);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.id;
    setSelectedCategories((prev) => (e.target.checked ? [...prev, tag] : prev.filter((c) => c !== tag)));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subCat = e.target.id;
    setSelectedSubCategory(subCat);
    setSelectedSubSubCategory(""); // Reset sub-subcategory when changing subcategory
  };

  const handleSubSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSubSubCategory(e.target.id);
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

  useEffect(() => {
    setBooksToShow(books.length);
  }, [selectedCategories, selectedSubCategory, selectedSubSubCategory, priceRange, status, sortOption]);

  const handleViewToggle = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleImageError = (bookId: string) => {
    setBookImageUrls((prev) => ({
      ...prev,
      [bookId]: defaultImageUrl,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow px-6 sm:px-8 md:px-12 py-6">
        <div className="flex flex-col lg:flex-row">
          <aside className="w-full lg:w-1/4 pr-0 lg:pr-6 mb-6 lg:mb-0">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Tags</h2>
            <div className="border rounded-lg p-4 bg-gray-50 shadow-md mb-6">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={tag}
                    className="mr-2 accent-orange-500"
                    onChange={handleTagChange}
                    checked={selectedCategories.includes(tag)}
                  />
                  <label htmlFor={tag} className="text-gray-800 text-sm">
                    {bookCountPerTag[tag] > 0 ? `${tag} - ${bookCountPerTag[tag]} books` : tag}
                  </label>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Subcategories</h2>
            <div className="border rounded-lg p-4 bg-gray-50 shadow-md mb-6">
              {categoryData?.subCategories.map((subCat) => (
                <div key={subCat.name} className="mb-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={subCat.name}
                      name="subCategory"
                      className="mr-2 accent-orange-500"
                      onChange={handleSubCategoryChange}
                      checked={selectedSubCategory === subCat.name}
                    />
                    <label htmlFor={subCat.name} className="text-gray-800 text-sm">
                      {bookCountPerSubCategory[subCat.name] > 0
                        ? `${mapSubCategory(subCat.name)} - ${bookCountPerSubCategory[subCat.name]} books`
                        : mapSubCategory(subCat.name)}
                    </label>
                  </div>
                  {subCat.subSubCategories.length > 0 && selectedSubCategory === subCat.name && (
                    <div className="pl-4 mt-2">
                      {subCat.subSubCategories.map((subSubCat) => (
                        <div key={subSubCat} className="flex items-center mb-2">
                          <input
                            type="radio"
                            id={subSubCat}
                            name="subSubCategory"
                            className="mr-2 accent-orange-500"
                            onChange={handleSubSubCategoryChange}
                            checked={selectedSubSubCategory === subSubCat}
                          />
                          <label htmlFor={subSubCat} className="text-gray-800 text-xs">
                            {bookCountPerSubSubCategory[subSubCat] > 0
                              ? `${subSubCat} - ${bookCountPerSubSubCategory[subSubCat]} books`
                              : subSubCat}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center">
                <input
                  type="radio"
                  id=""
                  name="subCategory"
                  className="mr-2 accent-orange-500"
                  onChange={() => {
                    setSelectedSubCategory("");
                    setSelectedSubSubCategory("");
                  }}
                  checked={selectedSubCategory === ""}
                />
                <label className="text-gray-800 text-sm">All</label>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Filter by Price</h2>
            <div className="border rounded-lg p-4 bg-gray-50 shadow-md mb-6">
              {["0to500", "500to1000", "1000to1500", "1500to2000"].map((range) => (
                <div key={range} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={range}
                    name="price"
                    className="mr-2 accent-orange-500"
                    onChange={handlePriceChange}
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
              ))}
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
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Product Status</h2>
            <div className="border rounded-lg p-4 bg-gray-50 shadow-md">
              {["inStock", "outOfStock", "onSale"].map((stat) => (
                <div key={stat} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={stat}
                    name="status"
                    className="mr-2 accent-orange-500"
                    onChange={handleStatusChange}
                  />
                  <label htmlFor={stat} className="text-gray-800 text-sm">
                    {stat === "inStock" ? "In Stock" : stat === "outOfStock" ? "Out of Stock" : "On Sale"}
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
              {category ? decodeURIComponent(category) : "Category"}
              {selectedSubCategory ? ` > ${mapSubCategory(selectedSubCategory)}` : ""}
              {selectedSubSubCategory ? ` > ${selectedSubSubCategory}` : ""}
            </h2>
            <div className="mb-4 flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center mb-2 lg:mb-0">
                <span className="mr-2 text-3xl cursor-pointer" onClick={() => handleViewToggle("grid")}>
                  <FontAwesomeIcon
                    icon={faThLarge}
                    className={`text-gray-800 ${viewMode === "grid" ? "text-orange-500" : ""} hover:text-orange-500 transition-colors duration-300`}
                  />
                </span>
                <span className="cursor-pointer ml-4 text-3xl" onClick={() => handleViewToggle("list")}>
                  <FontAwesomeIcon
                    icon={faList}
                    className={`text-gray-800 ${viewMode === "list" ? "text-orange-500" : ""} hover:text-orange-500 transition-colors duration-300`}
                  />
                </span>
              </div>
              <div className="flex space-x-4">
                <select
                  className="border rounded p-1 text-lg text-gray-800"
                  onChange={handleBooksToShowChange}
                  value={booksToShow === books.length ? "all" : booksToShow.toString()}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="all">Show All</option>
                </select>
                <select className="border rounded p-1 text-lg text-gray-800" onChange={handleSortChange} value={sortOption}>
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
                No books found for '{category}
                {subCategory ? `/${subCategory}` : ""}
                {subSubCategory ? `/${subSubCategory}` : ""}'. Add books in the admin panel to display them.
              </p>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
                }`}
              >
                {filteredBooks.map((book) => (
                  <Link
                    href={`/overview1/${book._id}?category=${encodeURIComponent(category || "")}&imageUrl=${encodeURIComponent(
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
                      <Image
                        src={bookImageUrls[book._id] || defaultImageUrl}
                        alt={book.title}
                        width={150}
                        height={viewMode === "grid" ? 192 : 128}
                        className="w-full h-48 object-cover md:h-48 lg:h-48"
                        onError={() => handleImageError(book._id)}
                        style={{ objectFit: "cover" }}
                      />
                      <div className={`p-2 ${viewMode === "grid" ? "text-center" : "text-left flex-1"}`}>
                        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-orange-500 font-bold mt-1">
                          ₹{book.discountedPrice || book.price}
                          {book.effectiveDiscount ? (
                            <span className="text-gray-500 text-sm line-through ml-2">₹{book.price}</span>
                          ) : null}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">{mapSubCategory(book.subCategory)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}