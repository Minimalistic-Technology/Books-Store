"use client";

import { useState, useEffect } from "react";
import type { Order } from "../types";
import { API_BASE_URL } from "../../../../utils/api";

type AddOrderFormProps = {
  onClose: () => void;
  onSave: (order: Order) => void;
};

interface Category {
  _id: string;
  name: string;
  tags: string[];
}

interface Book {
  _id: string;
  title: string;
  price: number;
  subCategory: string;
  quantityNew: number;
  quantityOld: number;
}

export default function AddOrderForm({ onClose, onSave }: AddOrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    mobileNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    paymentType: "Credit Card" as Order["paymentType"],
    price: 0,
    quantity: 1,
    status: "Pending" as Order["status"],
    condition: "New" as Order["condition"],
    bookId: "",
    bookTitle: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/book-categories`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err instanceof Error) {
            
        setErrors((prev) => ({
          ...prev,
          general: "Failed to load categories",
        }));
          
        } else {
            
        setErrors((prev) => ({
          ...prev,
          general: "Failed to load categories",
        }));
        }
    
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setBooks([]);
      return;
    }
    const fetchSubCategories = async () => {
      setIsLoading(true);
      try {
        
        const response = await fetch(
          `${API_BASE_URL}/book-categories/${encodeURIComponent(selectedCategory)}/tags`,
          { cache: "no-store" }
        );
        if (!response.ok) throw new Error("Failed to fetch subcategory tags");
        const data = await response.json();
        
        const tags = Array.isArray(data) ? data : data.tags ? data.tags : [];
        if (!Array.isArray(tags)) {
          
          setErrors((prev) => ({
            ...prev,
            general: "Invalid subcategory data received",
          }));
          setSubCategories([]);
        } else {
          setSubCategories(tags);
        }
        
      } catch  {
        
        setErrors((prev) => ({
          ...prev,
          general: "Failed to load subcategories",
        }));
        setSubCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory || !selectedSubCategory) {
      setBooks([]);
      return;
    }
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/book-categories/${encodeURIComponent(selectedCategory)}`,
          { cache: "no-store" }
        );
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();
        
        const filteredBooks = (data.books || []).filter(
          (book: Book) => book.subCategory === selectedSubCategory
        );
        setBooks(filteredBooks);
      } catch  {
        
        setErrors((prev) => ({ ...prev, general: "Failed to load books" }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [selectedCategory, selectedSubCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const [, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name === "bookId") {
      const selectedBook = books.find((book) => book._id === value);
      setFormData((prev) => ({
        ...prev,
        bookId: value,
        bookTitle: selectedBook?.title || "",
        price: selectedBook?.price || 0,
      }));
    } else if (name === "quantity") {
      const quantity = Math.max(1, Number(value));
      setFormData((prev) => ({
        ...prev,
        quantity,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName)
      newErrors.customerName = "Customer name is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.mobileNumber || !/\+?[1-9]\d{1,14}/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Valid mobile number is required";
    if (!formData.address.street)
      newErrors["address.street"] = "Street is required";
    if (!formData.address.city)
      newErrors["address.city"] = "City is required";
    if (!formData.address.state)
      newErrors["address.state"] = "State is required";
    if (!formData.address.country)
      newErrors["address.country"] = "Country is required";
    if (!formData.address.pinCode)
      newErrors["address.pinCode"] = "Pin code is required";
    if (!formData.paymentType)
      newErrors.paymentType = "Payment type is required";
    if (formData.price < 0)
      newErrors.price = "Price cannot be negative";
    if (formData.quantity < 1)
      newErrors.quantity = "Quantity must be at least 1";
    if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(formData.status))
      newErrors.status = "Invalid status";
    if (!["New", "Old"].includes(formData.condition))
      newErrors.condition = "Invalid condition";
    if (!formData.bookId)
      newErrors.bookId = "Book selection is required";

    if (formData.bookId) {
      const selectedBook = books.find((book) => book._id === formData.bookId);
      if (selectedBook) {
        if (formData.condition === "New" && selectedBook.quantityNew < formData.quantity) {
          newErrors.quantity = `Insufficient new stock. Only ${selectedBook.quantityNew} available.`;
        }
        if (formData.condition === "Old" && selectedBook.quantityOld < formData.quantity) {
          newErrors.quantity = `Insufficient old stock. Only ${selectedBook.quantityOld} available.`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        paymentType: formData.paymentType,
        price: formData.price,
        quantity: formData.quantity,
        status: formData.status,
        condition: formData.condition,
        bookId: formData.bookId,
      };
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }
      const result = await response.json();
      
      onSave({
        id: result.order._id,
        customerName: result.order.customerName,
        email: result.order.email,
        mobileNumber: result.order.mobileNumber,
        address: result.order.address,
        paymentType: result.order.paymentType,
        quantity: result.order.quantity,
        price: result.order.price,
        status: result.order.status,
        condition: result.order.condition,
        createdAt: result.order.createdAt,
        updatedAt: result.order.updatedAt,
        bookId: result.order.bookId,
        date: result.order.date,
        title: result.order.title,
        imageUrl: result.order.imageUrl,
        cancelReason: result.order.cancelReason || null,
        userId: "",
        products: [],
        totalAmount: result.order.price,
        shippingAddress: result.order.address,
      });
      onClose();
    } catch (err) {
      if(err instanceof Error){

        
        setErrors((prev) => ({
          ...prev,
          general: err.message || "Failed to create order. Please try again.",
        }));
      }
      else{
        
        setErrors((prev) => ({
          ...prev,
          general: "Failed to create order. Please try again.",
        }));

      }
    }
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div
        className="card p-6 max-w-lg w-full animate__zoomIn"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          Add New Order
        </h2>
        {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Street
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors["address.street"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.street"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors["address.city"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.city"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors["address.state"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.state"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors["address.country"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.country"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Pin Code
              </label>
              <input
                type="text"
                name="address.pinCode"
                value={formData.address.pinCode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors["address.pinCode"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.pinCode"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory("");
                  setFormData((prev) => ({
                    ...prev,
                    bookId: "",
                    bookTitle: "",
                    price: 0,
                    quantity: 1,
                  }));
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subcategory
              </label>
              <select
                name="subCategory"
                value={selectedSubCategory}
                onChange={(e) => {
                  setSelectedSubCategory(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    bookId: "",
                    bookTitle: "",
                    price: 0,
                    quantity: 1,
                  }));
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading || !selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {subCategories.length > 0 ? (
                  subCategories.map((subCat) => (
                    <option key={subCat || "undefined"} value={subCat}>
                      {subCat || "No Subcategory"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No subcategories available
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Book
              </label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading || !selectedSubCategory}
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title}
                  </option>
                ))}
              </select>
              {errors.bookId && (
                <p className="text-red-500 text-sm mt-1">{errors.bookId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Type
              </label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
              {errors.paymentType && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="New">New</option>
                <option value="Old">Old</option>
              </select>
              {errors.condition && (
                <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
              disabled={isLoading}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}