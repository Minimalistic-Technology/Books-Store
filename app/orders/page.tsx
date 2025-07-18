"use client";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  title: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  condition?: string;
  discountedPrice?: number;
  status:
    | "Delivered"
    | "Shipping"
    | "On the Way"
    | "Out for Delivery"
    | "Shipped";
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CartItem[]>([]);

  useEffect(() => {
    // Sync with localStorage and listen for admin updates
    const syncOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      if (savedOrders.length === 0) {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cartItems.length > 0) {
          const orderItems: CartItem[] = cartItems.map((item: CartItem) => ({
            ...item,
            title: item.name, // Ensure title is set
            status: "Shipped", // Initial status set to Shipped
          }));
          localStorage.setItem("orders", JSON.stringify(orderItems));
          setOrders(orderItems);
        }
      } else {
        setOrders(savedOrders);
      }
    };

    syncOrders();
    window.addEventListener("orderUpdated", syncOrders);
    return () => window.removeEventListener("orderUpdated", syncOrders);
  }, []);

  return (
    <div className="min-h-screen w-full bg-stone-50 text-stone-900 font-serif">
      <Header />
      <main className="max-w-6xl mx-auto py-10 px-4">
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span>Orders</span>
        </nav>
        <h1 className="text-4xl font-semibold mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">
            No orders yet.{" "}
            <Link href="/" className="text-teal-600 hover:underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((item: CartItem) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-32 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"; // Hide if image fails
                  }}
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-orange-500 font-bold mt-1">
                    ₹
                    {item.condition === "OLD - 30% OFF" &&
                    item.discountedPrice !== undefined &&
                    item.discountedPrice > 0
                      ? item.discountedPrice
                      : item.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Condition: {item.condition || "NEW - ORIGINAL PRICE"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 font-medium">
                    Status:{" "}
                    <span
                      className={
                        item.status === "Delivered"
                          ? "text-green-600"
                          : item.status === "Shipping"
                          ? "text-blue-600"
                          : item.status === "On the Way"
                          ? "text-yellow-600"
                          : item.status === "Out for Delivery"
                          ? "text-orange-600"
                          : item.status === "Shipped"
                          ? "text-purple-600"
                          : ""
                      }
                    >
                      {item.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/"
          className="mt-6 inline-block bg-teal-600 text-white font-medium py-2 px-4 rounded hover:bg-teal-700"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
