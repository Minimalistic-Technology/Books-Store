
"use client";
import dynamic from "next/dynamic";
import Footer from "../../components/footer/page";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Dynamically import Header with SSR disabled to avoid hydration mismatch
const Header = dynamic(() => import("../../components/header/page"), { ssr: false });

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
}

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  createdAt: string;
  itemId: string;
}

export default function Overview() {
  const { id } = useParams(); // Extract the dynamic id from the URL
  const searchParams = useSearchParams(); // Get query params to determine category
  const router = useRouter();
  const category = searchParams.get("category") || "Stationery"; // Default to Stationery
  const [item, setItem] = useState<Item>({
    _id: "",
    name: "Loading...",
    price: 0,
    imageUrl: "",
    description: "",
    estimatedDelivery: "",
    tags: [],
    condition: "NEW - ORIGINAL PRICE",
    subCategory: "",
  });
  const [condition, setCondition] = useState("NEW - ORIGINAL PRICE");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [viewers, setViewers] = useState(46);
  const [rating, setRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (id) {
        try {
          console.log(`Fetching item with ID: ${id} from category: ${category}`);
          const response = await fetch(`http://localhost:5000/api/bookstore/categories/${category}/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Item data received:", data);
          setItem({
            _id: data._id,
            name: data.title,
            price: data.price,
            imageUrl: data.imageUrl,
            description: data.description,
            estimatedDelivery: data.estimatedDelivery,
            tags: data.tags,
            condition: data.condition || "NEW - ORIGINAL PRICE",
            subCategory: data.subCategory,
          });
          setCondition(data.condition || "NEW - ORIGINAL PRICE");
          if (data.condition === "OLD - 30% OFF") {
            setDiscountedPrice(data.price * 0.7);
          } else {
            setDiscountedPrice(0);
          }
          setError(null);
        } catch (err) {
          console.error("Fetch error details:", err);
          setError(`Item not found. Please check the item ID (${id}) or try a different one.`);
          setItem({
            _id: "",
            name: "Not Found",
            price: 0,
            imageUrl: "",
            description: "",
            estimatedDelivery: "",
            tags: [],
            condition: "NEW - ORIGINAL PRICE",
            subCategory: "",
          });
          setCondition("NEW - ORIGINAL PRICE");
          setDiscountedPrice(0);
        }
      }
    };
    fetchItemDetails();
  }, [id, category]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookstore/reviews');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Reviews received:", data);
        const filteredReviews = data.filter((review: Review) => review.itemId === id);
        setReviews(filteredReviews);
        setReviewError(null);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setReviewError("Failed to load reviews. Please try again later.");
      }
    };
    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 100) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCondition = e.target.value;
    setCondition(selectedCondition);
    if (selectedCondition === "OLD - 30% OFF") {
      setDiscountedPrice(item.price * 0.7);
    } else {
      setDiscountedPrice(0);
    }
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
        const response = await fetch('http://localhost:5000/api/bookstore/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            rating,
            review: reviewDescription,
            itemId: item._id,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newReview = await response.json();
        console.log("Review posted:", newReview);
        setShowSuccessMessage(true);
        setRating(0);
        setReviewDescription("");
        setName("");
        setEmail("");
        setSaveDetails(false);
        setReviewError(null);
        // Refetch reviews after 5 seconds
        setTimeout(async () => {
          try {
            const reviewsResponse = await fetch('http://localhost:5000/api/bookstore/reviews');
            if (!reviewsResponse.ok) {
              throw new Error(`HTTP error! Status: ${reviewsResponse.status}`);
            }
            const updatedReviews = await reviewsResponse.json();
            setReviews(updatedReviews.filter((review: Review) => review.itemId === item._id));
            setShowSuccessMessage(false);
          } catch (err) {
            console.error("Fetch reviews error after submit:", err);
            setReviewError("Failed to reload reviews. Please refresh the page.");
            setShowSuccessMessage(false);
          }
        }, 5000);
      } catch (err) {
        console.error("Post review error:", err);
        setReviewError("Failed to submit review. Please try again later.");
      }
    }
  };

  const handleAddToCart = () => {
    if (!error && item._id) {
      const effectivePrice = condition === "OLD - 30% OFF" ? discountedPrice : item.price;
      const query = new URLSearchParams({
        _id: item._id,
        name: item.name,
        price: effectivePrice.toFixed(2),
        imageUrl: item.imageUrl || "",
        condition,
        discountedPrice: discountedPrice.toFixed(2),
      }).toString();
      console.log("Navigating to cart with query:", query);
      router.push(`/cart?${query}`);
    }
  };

  const handleBuyNow = () => {
    if (!error && item._id) {
      const effectivePrice = condition === "OLD - 30% OFF" ? discountedPrice : item.price;
      const query = new URLSearchParams({
        _id: item._id,
        name: item.name,
        price: effectivePrice.toFixed(2),
        imageUrl: item.imageUrl || "",
        condition,
        discountedPrice: discountedPrice.toFixed(2),
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow px-6 sm:px-8 md:px-12 py-6">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg shadow-md">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/2 lg:pl-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{item.name}</h2>
            <div className="text-xl font-bold mb-4 flex items-center space-x-2">
              {condition === "OLD - 30% OFF" && discountedPrice > 0 ? (
                <>
                  <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                  <span className="text-2xl text-green-500">₹{discountedPrice.toFixed(2)}</span>
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
              >
                <option value="NEW - ORIGINAL PRICE">NEW - ORIGINAL PRICE</option>
                <option value="OLD - 30% OFF">OLD - 30% OFF</option>
              </select>
            </div>
            <button onClick={handleAddToCart} className="w-full bg-blue-500 text-white p-2 rounded-lg mb-2 hover:bg-blue-600">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
              Buy Now
            </button>
            <p className="mt-4 text-sm text-gray-600">Estimated delivery: {item.estimatedDelivery || "5 days"}</p>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Tags:</h3>
              <p className="text-sm text-gray-600">{item.tags.join(", ") || "No tags available"}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-md font-medium text-gray-900">Category:</h3>
              <p className="text-sm text-gray-600">{item.subCategory || "Stationery Items"}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Description</h3>
              <p className="text-sm text-gray-600">{item.description || "No description available."}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Reviews ({reviews.length})</h3>
              {showSuccessMessage ? (
                <p className="text-green-500 text-md mt-4 font-semibold">
                  Thanks for your feedback. Have a nice day!
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="saveDetails"
                        checked={saveDetails}
                        onChange={(e) => setSaveDetails(e.target.checked)}
                        className="mr-2 accent-orange-500"
                      />
                      <label htmlFor="saveDetails" className="text-sm text-gray-600">
                        Save my name, email, and website in this browser for the next time I comment.
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                      disabled={!!error}
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
                          <p className="text-sm text-gray-600 mt-1">{review.review}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            By {review.name} on {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 mt-2">No reviews yet. Be the first to review this item!</p>
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
