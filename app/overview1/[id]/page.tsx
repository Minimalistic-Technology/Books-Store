"use client";

import dynamic from "next/dynamic";
import Footer from "../../components/footer/page";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../utils/api";

const Header = dynamic(() => import("../../components/header/page"), { ssr: false });
const defaultImageUrl = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

interface Item {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  estimatedDelivery: string;
  tags: string[];
  condition: string;
  subCategory: string;
  author: string;
  publisher: string;
  quantityNew: number;
  quantityOld: number;
  discountNew: number;
  discountOld: number;
  effectiveDiscount: number;
  discountedPrice: number;
}

interface BookstoreReview {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookId: { _id: string; title: string };
  status: "pending" | "approved" | "disapproved";
}

export default function Overview() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "Non-Academics";
  const [item, setItem] = useState<Item>({
    _id: "",
    name: "Loading...",
    price: 0,
    imageUrl: defaultImageUrl,
    description: "",
    estimatedDelivery: "",
    tags: [],
    condition: "New",
    subCategory: "",
    author: "",
    publisher: "",
    quantityNew: 0,
    quantityOld: 0,
    discountNew: 0,
    discountOld: 0,
    effectiveDiscount: 0,
    discountedPrice: 0,
  });
  const [condition, setCondition] = useState("New");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [availableConditions, setAvailableConditions] = useState<string[]>([]);
  const [viewers] = useState(Math.floor(Math.random() * 50) + 1);
  const [rating, setRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [reviews, setReviews] = useState<BookstoreReview[]>([]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (id) {
        try {
          console.log(`Fetching item with ID: ${id}`);
          const response = await fetch(
            `${API_BASE_URL}/books/${id}?t=${new Date().getTime()}`,
            { cache: "no-store" }
          );
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          const newItem = {
            _id: data._id || "",
            name: data.bookName || data.title || "Unknown Title",
            price: data.price || 0,
            imageUrl: data.imageUrl || defaultImageUrl,
            description: data.description || "",
            estimatedDelivery: data.estimatedDelivery || "",
            tags: data.tags || [],
            condition: data.condition || "new",
            subCategory: data.categoryPath ? data.categoryPath.split("/").pop() || "Non-Academics" : "Non-Academics",
            author: data.author || "",
            publisher: data.publisher || "",
            quantityNew: data.quantityNew ?? 0,
            quantityOld: data.quantityOld ?? 0,
            discountNew: data.discountNew ?? 0,
            discountOld: data.discountOld ?? 0,
            effectiveDiscount: data.effectiveDiscount ?? 0,
            discountedPrice: (data.discountedPrice ?? data.price) || 0,
          };
          setItem(newItem);
          const selectedCondition = newItem.condition === "BOTH" ? "New" :
            newItem.condition === "new" ? "New" :
            newItem.quantityNew > 0 ? "New" : "Old";
          setCondition(selectedCondition);
          // Calculate initial discounted price based on selected condition
          const initialDiscount = selectedCondition === "New" ? newItem.discountNew : newItem.discountOld;
          const initialDiscountedPrice = newItem.price * (1 - initialDiscount / 100);
          setDiscountedPrice(initialDiscountedPrice);
          setIsOutOfStock(newItem.quantityNew === 0 && newItem.quantityOld === 0);
          const conditions = [];
          if (newItem.quantityNew > 0) conditions.push("New");
          if (newItem.quantityOld > 0) conditions.push("Old");
          setAvailableConditions(conditions);
          setError(null);
        } catch (err: any) {
          console.error("Fetch item error:", {
            message: err.message,
            stack: err.stack,
            id,
          });
          setError(`Item not found. Please check the item ID (${id}) or try a different one.`);
          setItem({
            _id: "",
            name: "Not Found",
            price: 0,
            imageUrl: defaultImageUrl,
            description: "",
            estimatedDelivery: "",
            tags: [],
            condition: "New",
            subCategory: "",
            author: "",
            publisher: "",
            quantityNew: 0,
            quantityOld: 0,
            discountNew: 0,
            discountOld: 0,
            effectiveDiscount: 0,
            discountedPrice: 0,
          });
          setCondition("New");
          setDiscountedPrice(0);
          setIsOutOfStock(true);
          setAvailableConditions([]);
        }
      }
    };
    fetchItemDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/reviews/book/${id}?t=${new Date().getTime()}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Fetch reviews failed:", { status: response.status, errorData });
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const reviews: BookstoreReview[] = data.map((review:BookstoreReview) => ({
          _id: review._id,
          name: review.name,
          email: review.email,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          bookId: {
            _id: review.bookId?._id || review.bookId,
            title: review.bookId?.title || item.name || "Unknown Book",
          },
          status: review.status,
        }));
        setReviews(reviews);
        setReviewError(null);
      } catch (err: any) {
        console.error("Fetch reviews error:", {
          message: err.message,
          stack: err.stack,
          id,
        });
        setReviewError(err.message || "Failed to load reviews. Please try again later.");
      }
    };
    if (id) {
      fetchReviews();
    }
  }, [id, item.name]);

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCondition = e.target.value;
    setCondition(selectedCondition);
    // Calculate discounted price based on selected condition
    const discount = selectedCondition === "New" ? item.discountNew : item.discountOld;
    const newDiscountedPrice = item.price * (1 - discount / 100);
    setDiscountedPrice(newDiscountedPrice);
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!error && item._id) {
      if (rating === 0) {
        setReviewError("Please select a rating.");
        return;
      }
      if (!name.trim()) {
        setReviewError("Please enter your name.");
        return;
      }
      if (!reviewDescription.trim()) {
        setReviewError("Please enter a review description.");
        return;
      }
      try {
        const payload = {
          bookId: item._id,
          name,
          email,
          rating,
          comment: reviewDescription,
          categoryName: category,
        };
        const response = await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Post review failed:", { status: response.status, errorData });
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        const newReview = await response.json();
        console.log("Review posted:", newReview);
        setShowSuccessMessage(true);
        setRating(0);
        setReviewDescription("");
        setName("");
        setEmail("");
        setReviewError(null);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } catch (err: any) {
        console.error("Post review error:", {
          message: err.message,
          stack: err.stack,
          payload: { bookId: item._id, name, email, rating, comment: reviewDescription, categoryName: category },
        });
        setReviewError(err.message || "Failed to submit review. Please try again later.");
      }
    }
  };

  const handleAddToCart = () => {
    if (!error && item._id && !isOutOfStock) {
      const query = new URLSearchParams({
        _id: item._id,
        name: item.name,
        price: item.price.toFixed(2),
        imageUrl: item.imageUrl || defaultImageUrl,
        condition,
        discountedPrice: discountedPrice.toFixed(2),
        category,
      }).toString();
      console.log("Navigating to cart with query:", query);
      router.push(`/cart?${query}`);
    }
  };

  const handleBuyNow = () => {
    if (!error && item._id && !isOutOfStock) {
      const query = new URLSearchParams({
        _id: item._id,
        name: item.name,
        price: item.price.toFixed(2),
        imageUrl: item.imageUrl || defaultImageUrl,
        condition,
        discountedPrice: discountedPrice.toFixed(2),
        category,
      }).toString();
      console.log("Navigating to cart with query:", query);
      router.push(`/cart?${query}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow px-6 sm:px-8 md:px-12 py-6 flex items-center justify-center">
          <p className="text-center text-red-500 text-xl">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isOutOfStock) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow px-6 sm:px-8 md:px-12 py-6 flex items-center justify-center">
          <p className="text-center text-red-500 text-xl">This item is out of stock.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-grow px-6 sm:px-8 md:px-12 py-6">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
            <Image
              src={item.imageUrl || defaultImageUrl}
              alt={item.name}
              width={300}
              height={400}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImageUrl;
              }}
            />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{item.name}</h2>
            <div className="text-xl font-bold mb-4 flex items-center space-x-2">
              {condition === "Old" && item.discountOld > 0 ? (
                <>
                  <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                  <span className="text-2xl text-green-500">₹{discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-600">({item.discountOld}% off)</span>
                </>
              ) : condition === "New" && item.discountNew > 0 ? (
                <>
                  <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                  <span className="text-2xl text-green-500">₹{discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-600">({item.discountNew}% off)</span>
                </>
              ) : (
                <span className="text-orange-500">₹{item.price.toFixed(2)}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{viewers} people are viewing this product right now</p>
            <div className="mb-4">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Choose Item Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={handleConditionChange}
                className="w-full p-2 border rounded-lg text-gray-800"
                disabled={availableConditions.length === 0}
              >
                {availableConditions.map((cond) => {
                  const isNewOutOfStock = cond === "New" && item.quantityNew === 0;
                  const isOldOutOfStock = cond === "Old" && item.quantityOld === 0;
                  const label = `${cond}${isNewOutOfStock || isOldOutOfStock ? " (Out of Stock)" : ""}`;
                  return (
                    <option key={cond} value={cond} disabled={isNewOutOfStock || isOldOutOfStock}>
                      {label}
                    </option>
                  );
                })}
                {availableConditions.length === 0 && (
                  <option value="" disabled>
                    No conditions available
                  </option>
                )}
              </select>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 text-white p-2 rounded-lg mb-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isOutOfStock || (condition === "New" && item.quantityNew === 0) || (condition === "Old" && item.quantityOld === 0)}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isOutOfStock || (condition === "New" && item.quantityNew === 0) || (condition === "Old" && item.quantityOld === 0)}
            >
              Buy Now
            </button>
            <p className="mt-4 text-sm text-gray-600">Estimated delivery: {item.estimatedDelivery || "5 days"}</p>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Tags:</h3>
              <p className="text-sm text-gray-600">{item.tags.join(", ") || "No tags available"}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-md font-medium text-gray-900">Category:</h3>
              <p className="text-sm text-gray-600">{item.subCategory || "Non-Academics"}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-md font-medium text-gray-900">Author:</h3>
              <p className="text-sm text-gray-600">{item.author || "Unknown"}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-md font-medium text-gray-900">Publisher:</h3>
              <p className="text-sm text-gray-600">{item.publisher || "Unknown"}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Description</h3>
              <p className="text-sm text-gray-600">{item.description || "No description available."}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Stock Availability:</h3>
              <p className="text-sm text-gray-600">
                New: {item.quantityNew} {item.quantityNew === 0 ? "(Out of Stock)" : ""},
                Old: {item.quantityOld} {item.quantityOld === 0 ? "(Out of Stock)" : ""}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Reviews ({reviews.length})</h3>
              {showSuccessMessage ? (
                <p className="text-green-500 text-md mt-4 font-semibold">
                  Thanks for your feedback. Your review is pending approval.
                </p>
              ) : (
                <>
                  {reviewError && <p className="text-red-500 text-sm mt-2">{reviewError}</p>}
                  <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                            size={24}
                            onClick={() => handleRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="review" className="block text-sm font-medium text-gray-700">Your Description</label>
                      <textarea
                        id="review"
                        value={reviewDescription}
                        onChange={(e) => setReviewDescription(e.target.value)}
                        className="w-full p-2 border rounded-lg text-gray-800 mt-1"
                        rows={4}
                        placeholder="Write your review here..."
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded-lg text-gray-800 mt-1"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg text-gray-800 mt-1"
                        placeholder="Enter your email"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!!error || isOutOfStock}
                    >
                      Submit
                    </button>
                  </form>
                  <div className="mt-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="border-t pt-4 mt-4">
                          <p className="text-md font-semibold text-gray-900">{item.name}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                                size={18}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            By {review.name} on {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 mt-2">No approved reviews yet. Be the first to review this item!</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}