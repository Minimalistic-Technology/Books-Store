
"use client";
import dynamic from "next/dynamic";
import Footer from "../components/footer/page";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Link from "next/link";

// Dynamically import Header with SSR disabled to avoid hydration mismatch
const Header = dynamic(() => import("../components/header/page"), { ssr: false });

interface Item {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  subCategory: string;
  viewCount: number;
}

export default function Stationery() {
  const categories = [
    "Pens & Pencils",
    "Notebooks & Registers",
    "Art Supplies",
    "Office Stationery",
    "School Essentials",
    "Calculators",
    "Bags & Accessories",
    "Miscellaneous",
  ];

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [status, setStatus] = useState("");
  const [itemsToShow, setItemsToShow] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookstore/categories/Stationery');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched items:', data.books);
        setItems(data.books.map((item: any) => ({
          _id: item._id,
          name: item.title,
          price: item.price,
          imageUrl: item.imageUrl,
          subCategory: item.subCategory,
          viewCount: item.viewCount,
        })));
        setItemsToShow(data.books.length || 0);
      } catch (err) {
        setError('Error loading items. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const mapSubCategory = (subCat: string) => {
    return (
      subCat === "Pens and Pencils" ? "Pens & Pencils" :
      subCat === "Notebooks and Registers" ? "Notebooks & Registers" :
      subCat === "Office Stationary" ? "Office Stationery" :
      categories.includes(subCat) ? subCat : "Miscellaneous"
    );
  };

  const itemCountPerCategory = categories.reduce((acc, category) => {
    acc[category] = items.filter((item) => mapSubCategory(item.subCategory) === category).length;
    return acc;
  }, {} as Record<string, number>);

  const getNumericPrice = (price: number) => price;

  const filteredItems = items
    .filter((item) => {
      const mappedSubCategory = mapSubCategory(item.subCategory);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(mappedSubCategory);
      const matchesPrice = priceRange === "" ||
        (priceRange === "0to500" && item.price <= 500) ||
        (priceRange === "500to1000" && item.price > 500 && item.price <= 1000) ||
        (priceRange === "1000to1500" && item.price > 1000 && item.price <= 1500) ||
        (priceRange === "1500to2000" && item.price > 1500 && item.price <= 2000);
      const matchesStatus = status === "" || status === "inStock" || status === "outOfStock" || status === "onSale";
      return matchesCategory && matchesPrice && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") return getNumericPrice(a.price) - getNumericPrice(b.price);
      else if (sortOption === "price-high-low") return getNumericPrice(b.price) - getNumericPrice(a.price);
      return 0;
    })
    .slice(0, itemsToShow);

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

  const handleItemsToShowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setItemsToShow(value === "all" ? items.length : parseInt(value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleViewToggle = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  useEffect(() => {
    setItemsToShow(items.length);
  }, [selectedCategories, priceRange, status, sortOption]);

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
                    {itemCountPerCategory[category] > 0
                      ? `${category} - ${itemCountPerCategory[category]} items`
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Stationery Items</h2>
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
                  onChange={handleItemsToShowChange}
                  value={itemsToShow === items.length ? "all" : itemsToShow.toString()}
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
              <p className="text-center text-gray-800">Loading items...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filteredItems.length === 0 ? (
              <p className="text-center text-gray-800">No items found matching the filters.</p>
            ) : (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
                style={{ maxHeight: viewMode === "list" ? "600px" : "auto", overflowY: viewMode === "list" ? "auto" : "visible" }}
              >
                {filteredItems.map((item) => (
                  <Link href={`/overview1/${item._id}?category=Stationery`} key={item._id} passHref>
                    <div
                      className={`border rounded-lg overflow-hidden shadow-md ${viewMode === "list" ? "w-full max-w-2xl mx-auto flex" : ""} cursor-pointer hover:shadow-lg transition-shadow duration-300`}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={150}
                          height={169}
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <div className="w-full h-[169px] flex items-center justify-center bg-gray-100">
                          <p className="text-gray-500 text-sm">No image available</p>
                        </div>
                      )}
                      <div className="p-2 text-center lg:text-left">
                        <p className="text-sm text-gray-800">{item.name}</p>
                        <p className="text-orange-500 font-bold mt-1">₹{item.price}.00</p>
                        <p className="text-gray-600 text-xs mt-1">{mapSubCategory(item.subCategory)}</p>
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
