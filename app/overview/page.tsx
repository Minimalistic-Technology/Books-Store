"use client";

import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

export default function Overview() {
  const book = {
    _id: "sample-id",
    title: "Algebra Textbook for Class 10",
    price: 300,
    imageUrl: "https://m.media-amazon.com/images/I/71wrIZujPIL._SY522_.jpg",
  };

  const [condition, setCondition] = useState("NEW - ORIGINAL BOOK");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [viewers, setViewers] = useState(46); // Static initial value, updated client-side
  const [rating, setRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);

  // Update viewers count client-side only
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => Math.floor(Math.random() * 100) + 1); // Random between 1 and 100
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCondition = e.target.value;
    setCondition(selectedCondition);
    if (selectedCondition === "OLD - 35% OFF") {
      setDiscountedPrice(book.price * 0.65); // 35% off
    } else {
      setDiscountedPrice(0);
    }
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, reviewDescription, name, email, saveDetails });
    // Add your submit logic here (e.g., API call)
    setRating(0);
    setReviewDescription("");
    setName("");
    setEmail("");
    setSaveDetails(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header onSearch={(results) => { /* handle search results here if needed */ }} />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Product Image */}
              <div className="w-full lg:w-1/3">
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-2/3">
                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-xl font-semibold text-orange-600 mb-4">
                  ₹{book.price}.00{" "}
                  {condition === "OLD - 35% OFF" && discountedPrice > 0 && (
                    <span className="text-green-600 ml-2">
                      ₹{discountedPrice.toFixed(2)} (35% OFF)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {viewers} people are viewing this product right now
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Choose Book Condition
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={handleConditionChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NEW - ORIGINAL BOOK">NEW - ORIGINAL BOOK</option>
                    <option value="OLD - 35% OFF">OLD - 35% OFF</option>
                  </select>
                </div>
                <div className="flex gap-4 mb-4">
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                    Add to Cart
                  </button>
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                    Buy Now
                  </button>
                </div>
                <p className="text-sm text-gray-600">Estimated delivery: 5 days</p>
              </div>
            </div>
          </section>

          {/* Product Info */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Tags:</h3>
                <p className="text-sm text-gray-600">
                  Algebra Study Material, Algebra Textbook, Class 10 Math Book, Class 10 Mathematics, English Medium Algebra,
                  Maharashtra Board Algebra, Maharashtra SSC Algebra Book, School Textbook for Class 10, SSC Algebra Book,
                  SSC Board Textbooks
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Categories:</h3>
                <p className="text-sm text-gray-600">Class 10, School Textbooks</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="text-sm text-gray-600">
                  Master mathematical concepts with the Algebra Textbook for SSC (Class 10, English Medium), designed as per the
                  Maharashtra State Board syllabus. This textbook provides:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Step-by-step explanations of algebraic concepts to strengthen core understanding.</li>
                  <li>Plenty of examples and solved problems for easy comprehension.</li>
                  <li>Practice exercises to enhance problem-solving skills and prepare for exams effectively.</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Whether preparing for exams or building a solid foundation in mathematics, this book is an invaluable resource
                  for Class 10 students.
                </p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <p className="text-sm text-gray-600 mb-4">(0 Reviews)</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                <div className="flex mt-2">
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
                <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                  Your Review
                </label>
                <textarea
                  id="review"
                  value={reviewDescription}
                  onChange={(e) => setReviewDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write your review here..."
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-200"
              >
                Submit Review
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}