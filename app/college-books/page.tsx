'use client';
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function SchoolBooks() {
  const categories = [
    "FYBCom Sem 1",
    "College Books",
    "B.Com - Bachelor of Commerce",
  ];

  const books = [
    {
      src: "https://harshbookcenter.com/wp-content/uploads/2025/02/accountancy-and-financial-management-1-fybcom-sem-1-sheth-punlication-924x1042-2.webp",
      class: "College Books",
      price: "₹290.00",
      description: "Accountancy and Financial Management -1 FYBCom Sem 1 | Sheth Publication | NEP 2020",
    },
    {
      src: "https://harshbookcenter.com/wp-content/uploads/2025/06/FYBCOM-I-Basic-Tools-in-Economics-4-web.jpg",
      price: "₹589.00",
      description: "BASIC TOOLS IN ECONOMICS | FYBCOM SEM 1 | MANAN PRAKASHAN",
      class: "B.Com - Bachelor of Commerce",
    },
    {
      src: "https://harshbookcenter.com/wp-content/uploads/2025/06/basic-tools-of-economics-fybcom-sem-1-manan-prakashan-nep-2020.jpeg-462x521-1.webp",
      price: "₹95.00",
      description: "Basic Tools in Economics FYBCom Sem 1 – Sheth Publication (2024 Edition)",
      class: "FYBCom Sem 1",
    },
  ];

  // Dynamically count books per category
  const bookCountPerCategory = categories.reduce((acc, category) => {
    acc[category] = books.filter((book) => book.class === category).length;
    return acc;
  }, {} as Record<string, number>);

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [booksToShow, setBooksToShow] = useState<number>(8);
  const [sortOption, setSortOption] = useState<string>("default");

  // Extract numeric price for sorting
  const getNumericPrice = (price: string) => {
    return parseFloat(price.replace("₹", "").replace(",", ""));
  };

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.class);
      const matchesPrice = priceRange === "" ||
        (priceRange === "0to500" && getNumericPrice(book.price) <= 500) ||
        (priceRange === "500to1000" && getNumericPrice(book.price) > 500 && getNumericPrice(book.price) <= 1000) ||
        (priceRange === "1000to1500" && getNumericPrice(book.price) > 1000 && getNumericPrice(book.price) <= 1500) ||
        (priceRange === "1500to2000" && getNumericPrice(book.price) > 1500 && getNumericPrice(book.price) <= 2000);
      const matchesStatus = status === "" || status === "inStock" || status === "outOfStock" || status === "onSale"; // Placeholder, assumes all books are in stock
      return matchesCategory && matchesPrice && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") {
        return getNumericPrice(a.price) - getNumericPrice(b.price);
      } else if (sortOption === "price-high-low") {
        return getNumericPrice(b.price) - getNumericPrice(a.price);
      }
      return 0; // Default no sorting
    })
    .slice(0, booksToShow);

  // Handle category filter
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.id;
    setSelectedCategories((prev) =>
      e.target.checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  // Handle price filter
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(e.target.id);
  };

  // Handle status filter
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.id);
  };

  // Handle books to show
  const handleBooksToShowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBooksToShow(value === "all" ? books.length : parseInt(value));
  };

  // Handle sort option
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    // Reset booksToShow to default when filters change to ensure all filtered books are visible
    setBooksToShow(books.length);
  }, [selectedCategories, priceRange, status, sortOption]);

  interface Book {
    src: string;
    alt?: string;
    price: string;
    description: string;
    class: string;
  }

  type ViewMode = "grid" | "list";

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  interface HandleViewToggle {
    (mode: ViewMode): void;
  }

  const handleViewToggle: HandleViewToggle = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow px-29 py-6">
        <div className="flex">
          {/* Left Sidebar for Categories and Filters */}
          <aside className="w-1/4 pr-6">
            <h2 className="text-2xl font-semibold mb-4 text-black">Categories</h2>
            <div className="border rounded-lg p-4 bg-white shadow-md mb-6">
              {categories.map((category) => (
                <div key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={category}
                    className="mr-2 accent-orange-500"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={category} className="text-gray-400 text-sm">
                    {bookCountPerCategory[category] > 0
                      ? `${category} - ${bookCountPerCategory[category]} books`
                      : category}
                  </label>
                </div>
              ))}
            </div>

            {/* Filter by Price */}
            <h2 className="text-xl font-semibold mb-4 text-black">Filter by Price</h2>
            <div className="border rounded-lg p-4 bg-white shadow-md mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="0to500"
                  name="price"
                  className="mr-2 accent-orange-500"
                  onChange={handlePriceChange}
                />
                <label htmlFor="0to500" className="text-gray-400 text-sm">
                  ₹0 - ₹500
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="500to1000"
                  name="price"
                  className="mr-2 accent-orange-500"
                  onChange={handlePriceChange}
                />
                <label htmlFor="500to1000" className="text-gray-400 text-sm">
                  ₹500 - ₹1,000
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="1000to1500"
                  name="price"
                  className="mr-2 accent-orange-500"
                  onChange={handlePriceChange}
                />
                <label htmlFor="1000to1500" className="text-gray-400 text-sm">
                  ₹1,000 - ₹1,500
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="1500to2000"
                  name="price"
                  className="mr-2 accent-orange-500"
                  onChange={handlePriceChange}
                />
                <label htmlFor="1500to2000" className="text-gray-400 text-sm">
                  ₹1,500 - ₹2,000
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id=""
                  name="price"
                  className="mr-2 accent-orange-500"
                  onChange={() => setPriceRange("")}
                  defaultChecked
                />
                <label className="text-gray-400 text-sm">All</label>
              </div>
            </div>

            {/* Product Status */}
            <h2 className="text-xl font-semibold mb-4 text-black">Product Status</h2>
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="inStock"
                  name="status"
                  className="mr-2 accent-orange-500"
                  onChange={handleStatusChange}
                />
                <label htmlFor="inStock" className="text-gray-400 text-sm">
                  In Stock
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="outOfStock"
                  name="status"
                  className="mr-2 accent-orange-500"
                  onChange={handleStatusChange}
                />
                <label htmlFor="outOfStock" className="text-gray-400 text-sm">
                  Out of Stock
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="onSale"
                  name="status"
                  className="mr-2 accent-orange-500"
                  onChange={handleStatusChange}
                />
                <label htmlFor="onSale" className="text-gray-400 text-sm">
                  On Sale
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id=""
                  name="status"
                  className="mr-2 accent-orange-500"
                  onChange={() => setStatus("")}
                  defaultChecked
                />
                <label className="text-gray-400 text-sm">All</label>
              </div>
            </div>
          </aside>

          {/* Right Section for Books */}
          <section className="w-3/4 pl-6">
            <h2 className="text-2xl font-semibold mb-4 text-black">College Books</h2>
            <div className="mb-4 flex justify-between items-center">
              {/* Left Side: Icons */}
              <div className="flex items-center">
                {/* 4-Column Grid Icon */}
                <span
                  className="mr-2 text-3xl cursor-pointer"
                  onClick={() => handleViewToggle("grid")}
                >
                  <FontAwesomeIcon
                    icon={faThLarge}
                    className={`text-black ${viewMode === "grid" ? "text-orange-500" : ""} hover:text-orange-500 transition-colors duration-300`}
                  />
                </span>

                {/* List-Grid Toggle */}
                <span
                  className="cursor-pointer ml-4 text-3xl"
                  onClick={() => handleViewToggle("list")}
                >
                  <FontAwesomeIcon
                    icon={faList}
                    className={`text-black ${viewMode === "list" ? "text-orange-500" : ""} hover:text-orange-500 transition-colors duration-300`}
                  />
                </span>
              </div>

              {/* Right Side: Selects */}
              <div className="flex space-x-4">
                {/* Number of Books to Show */}
                <select
                  className="border rounded p-1 text-lg text-black"
                  onChange={handleBooksToShowChange}
                  value={booksToShow === books.length ? "all" : booksToShow.toString()}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="all">Show All</option>
                </select>

                {/* Sorting Options */}
                <select className="border rounded p-1 text-lg text-black" onChange={handleSortChange} value={sortOption}>
                  <option value="default">Default Sorting</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-4" : "grid-cols-1"
              }`}
              style={{
                maxHeight: viewMode === "list" ? "600px" : "auto",
                overflowY: viewMode === "list" ? "auto" : "visible",
              }}
            >
              {filteredBooks.map((book, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden shadow-md ${
                    viewMode === "list" ? "w-full max-w-2xl mx-auto" : ""
                  }`}
                >
                  <Image
                    src={book.src}
                    alt=""
                    width={150}
                    height={169}
                    className="w-full h-auto"
                  />
                  <div className="p-2 text-center">
                    <p className="text-gray-500 text-xs mt-1"> {book.class}</p>
                    <p className="text-gray-600 text-m font-bold mt-1">{book.description}</p>    
                    <p className="text-orange-500 font-bold mt-1">{book.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}