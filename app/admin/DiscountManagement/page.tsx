"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from '../../../utils/api';

interface Category {
  _id: string;
  name: string;
  path: string;
  children: Category[];
}

const normalizeDisplayName = (name: string) => name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function DiscountManagement() {
  const [selectionType, setSelectionType] = useState<"category" | "subcategory" | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/book-categories`);
        const data = await response.json();
        setCategories(data);
      } catch  {
        
        setErrors({ general: "Failed to load categories. Please try again." });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (selectionType === "category" && selectedCategory) {
        try {
          const response = await fetch(`${API_BASE_URL}/book-categories/${selectedCategory}`);
          const data = await response.json();
          setDiscount(data.discount.toString() || "0");
        } catch  {
          
        }
      } else if (selectionType === "subcategory" && selectedSubCategory) {
        const path = `${selectedCategory}/${selectedSubCategory}`;
        try {
          const response = await fetch(`${API_BASE_URL}/book-categories/${path}`);
          const data = await response.json();
          setDiscount(data.discount.toString() || "0");
        } catch  {
          
        }
      } else {
        setDiscount("");
      }
    };
    fetchDiscount();
  }, [selectedCategory, selectedSubCategory, selectionType]);

  const handleSelectionType = (type: "category" | "subcategory") => {
    setSelectionType(type);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setDiscount("");
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!selectedCategory) newErrors.category = "Please select a category";
    if (selectionType === "subcategory" && !selectedSubCategory) newErrors.subCategory = "Please select a subcategory";
    if (!discount || isNaN(Number(discount)) || Number(discount) < 0 || Number(discount) > 100) {
      newErrors.discount = "Discount must be a number between 0 and 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const url =
        selectionType === "category"
          ? `${API_BASE_URL}/book-categories/${selectedCategory}`
          : `${API_BASE_URL}/book-categories/${selectedCategory}/${selectedSubCategory}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: Number(discount) }),
        credentials:"include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to set discount");
      }

      setSuccessMessage(
        `Discount of ${discount}% applied to ${selectionType === "category" ? normalizeDisplayName(selectedCategory) : `${normalizeDisplayName(selectedCategory)} - ${normalizeDisplayName(selectedSubCategory)}`}`
      );
      setDiscount("");
    } catch (err) { 
      if(err instanceof Error){
        
      setErrors({ general: err.message});
      }else{
      
      setErrors({ general: "Failed to set discount. Please try again." });
    }
  }
  };

  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Manage Discounts</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSelectionType("category")}
          className={`px-4 py-2 rounded-lg ${
            selectionType === "category" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-teal-700 transition-all`}
        >
          Category
        </button>
        <button
          onClick={() => handleSelectionType("subcategory")}
          className={`px-4 py-2 rounded-lg ${
            selectionType === "subcategory" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-teal-700 transition-all`}
        >
          Subcategory
        </button>
      </div>

      {selectionType && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory("");
                  setErrors({});
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {normalizeDisplayName(cat.name)}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {selectionType === "subcategory" && selectedCategory && (
              <div>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => {
                    setSelectedSubCategory(e.target.value);
                    setErrors({});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((cat) => cat.name === selectedCategory)
                    ?.children.map((sub) => (
                      <option key={sub._id} value={sub.name}>
                        {normalizeDisplayName(sub.name)}
                      </option>
                    ))}
                </select>
                {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
              </div>
            )}

            <div>
              <input
                type="number"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  setErrors({});
                }}
                placeholder="Discount Percentage (e.g., 20)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
            </div>
          </div>

          {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-1">{successMessage}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Apply Discount
            </button>
          </div>
        </form>
      )}
    </div>
  );
}