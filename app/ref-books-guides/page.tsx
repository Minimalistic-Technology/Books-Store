'use client';

import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function RefBooksGuides() {
  const categories = [
    "School TextBooks",
    "Class II",
    "Class III",
    "Class IV",
    "Class V",
    "Class VI",
    "Class VII",
    "Class VIII",
    "Class IX",
    "Class X",
    "Class XI",
    "Practical NoteBooks",
    "Reference Books&Notes",
    "College Books",
    "B.com",
    "Non Academic Books",
    "Maharashtra State Board",
    "SSC Board",
    "Navneet Digest",
    "Mathematics",
    "Investing",
    "Business",
    "Commerce",
    "Personal Finance",
    "Psychology",
    "Philosophy",
    "Fiction",
    "Romance",
    "Self-Help",
    "Uncategorized",
  ];

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [booksToShow, setBooksToShow] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookstore/categories/Ref-Books-Guides');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        console.log('Fetched books:', data.books);
        setBooks(data.books || []);
        setBooksToShow(data.books.length || 0);
      } catch (err) {
        setError('Error loading books. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const mapSubCategory = (subCat: string) => {
    return subCat === "School TextBooks" ? "School TextBooks" :
           subCat === "Class II" ? "Class II" :
           subCat === "Class III" ? "Class III" :
           subCat === "Class IV" ? "Class IV" :
           subCat === "Class V" ? "Class V" :
           subCat === "Class VI" ? "Class VI" :
           subCat === "Class VII" ? "Class VII" :
           subCat === "Class VIII" ? "Class VIII" :
           subCat === "Class IX" ? "Class IX" :
           subCat === "Class X" ? "Class X" :
           subCat === "Class XI" ? "Class XI" :
           subCat === "Practical NoteBooks" ? "Practical NoteBooks" :
           subCat === "Reference Books & Notes" ? "Reference Books&Notes" :
           subCat === "College Books" ? "College Books" :
           subCat === "B.com" ? "B.com" :
           subCat === "Non Academic Books" ? "Non Academic Books" :
           subCat === "Maharashtra State Board" ? "Maharashtra State Board" :
           subCat === "SSC Board" ? "SSC Board" :
           subCat === "Navneet Digest" ? "Navneet Digest" :
           subCat === "Mathematics" ? "Mathematics" :
           subCat === "Investing" ? "Investing" :
           subCat === "Business" ? "Business" :
           subCat === "Commerce" ? "Commerce" :
           subCat === "Personal Finance" ? "Personal Finance" :
           subCat === "Psychology" ? "Psychology" :
           subCat === "Philosophy" ? "Philosophy" :
           subCat === "Fiction" ? "Fiction" :
           subCat === "Romance" ? "Romance" :
           subCat === "Self-Help" ? "Self-Help" :
           subCat === "Uncategorized" ? "Uncategorized" :
           subCat;
  };

  const bookCountPerCategory = categories.reduce((acc, category) => {
    acc[category] = books.filter((book) => mapSubCategory(book.subCategory) === category).length;
    return acc;
  }, {} as Record<string, number>);

  const getNumericPrice = (price: number) => price;

  const filteredBooks = books
    .filter((book) => {
      const mappedSubCategory = mapSubCategory(book.subCategory);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(mappedSubCategory);
      const matchesPrice = priceRange === "" ||
        (priceRange === "0to500" && book.price <= 500) ||
        (priceRange === "500to1000" && book.price > 500 && book.price <= 1000) ||
        (priceRange === "1000to1500" && book.price > 1000 && book.price <= 1500) ||
        (priceRange === "1500to2000" && book.price > 1500 && book.price <= 2000);
      const matchesStatus = status === "" || status === "inStock" || status === "outOfStock" || status === "onSale";
      return matchesCategory && matchesPrice && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") return getNumericPrice(a.price) - getNumericPrice(b.price);
      else if (sortOption === "price-high-low") return getNumericPrice(b.price) - getNumericPrice(a.price);
      return 0;
    })
    .slice(0, booksToShow);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.id;
    setSelectedCategories((prev) =>
      e.target.checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
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
  }, [selectedCategories, priceRange, status, sortOption]);

  interface Book {
    _id: string;
    bookName: string;
    title: string;
    price: number;
    imageUrl: string;
    subCategory: string;
    viewCount: number;
  }

  type ViewMode = "grid" | "list";
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleViewToggle = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow px-6 sm:px-8 md:px-12 py-6">
        <div className="flex flex-col lg:flex-row">
          <aside className="w-full lg:w-1/4 pr-0 lg:pr-6 mb-6 lg:mb-0">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Categories</h2>
            <div className="border rounded-lg p-4 bg-gray-50 shadow-md mb-6">
              {categories.map((category) => (
                <div key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={category}
                    className="mr-2 accent-orange-500"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={category} className="text-gray-800 text-sm">
                    {bookCountPerCategory[category] > 0
                      ? `${category} - ${bookCountPerCategory[category]} books`
                      : category}
                  </label>
                </div>
              ))}
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
                    {range === "0to500" ? "₹0 - ₹500" :
                     range === "500to1000" ? "₹500 - ₹1,000" :
                     range === "1000to1500" ? "₹1,000 - ₹1,500" :
                     "₹1,500 - ₹2,000"}
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
                  defaultChecked
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
                    {stat === "inStock" ? "In Stock" :
                     stat === "outOfStock" ? "Out of Stock" : "On Sale"}
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
                  defaultChecked
                />
                <label className="text-gray-800 text-sm">All</label>
              </div>
            </div>
          </aside>
          <section className="w-full lg:w-3/4 pl-0 lg:pl-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Reference Books & Guides</h2>
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
              <p className="text-center text-gray-800">No books found matching the filters.</p>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
                }`}
                style={{ maxHeight: viewMode === "list" ? "600px" : "auto", overflowY: viewMode === "list" ? "auto" : "visible" }}
              >
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className={`border rounded-lg overflow-hidden shadow-md ${viewMode === "list" ? "w-full max-w-2xl mx-auto flex" : ""}`}
                  >
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      width={150}
                      height={169}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-2 text-center lg:text-left">
                      <p className="text-sm text-gray-800">{book.title}</p>
                      <p className="text-orange-500 font-bold mt-1">₹{book.price}.00</p>
                      <p className="text-gray-600 text-xs mt-1">{mapSubCategory(book.subCategory)}</p>
                    </div>
                  </div>
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