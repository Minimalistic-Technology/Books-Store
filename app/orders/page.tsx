"use client";
import { useState, useEffect } from "react";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from '../../utils/api';

interface Order {
  _id: string;
  customerName: string;
  price?: number;
  status: string;
  title: string;
  imageUrl: string | null;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelReasons, setCancelReasons] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/orders`, {
          cache: "no-store",
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.orders || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled", reason: cancelReasons[orderId] || "" }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.order.status } : order
        )
      );
      setCancelReasons((prev) => {
        const newReasons = { ...prev };
        delete newReasons[orderId];
        return newReasons;
      });
    } catch (err: any) {
      setError(err.message || "Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50 text-yellow-900 font-serif">
      <Header />
      <main className="flex-grow p-6 w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Your Orders</h1>
        {loading && <p className="text-yellow-900">Loading...</p>}
        {error && <p className="text-red-500 mb-4">Failed to fetch orders. Please try again later.</p>}
        {orders.length === 0 && !loading ? (
          <p className="text-yellow-900">
            No orders found.{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    {order.imageUrl ? (
                      <Image
                        src={order.imageUrl}
                        alt={order.title || "Unknown Book"}
                        width={64}
                        height={96}
                        className="w-16 h-24 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";
                        }}
                      />
                    ) : (
                      <Image
                        src="https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg"
                        alt="Default Book"
                        width={64}
                        height={96}
                        className="w-16 h-24 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.title || "Unknown Book"}</h3>
                      <p className="text-sm text-gray-600">
                        Price: {order.price != null ? `₹${order.price.toFixed(2)}` : "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status:{" "}
                        <span
                          className={
                            order.status === "Delivered"
                              ? "text-green-600"
                              : order.status === "Processing"
                              ? "text-blue-600"
                              : order.status === "Shipped"
                              ? "text-purple-600"
                              : order.status === "Cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {order.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center">
                    {(order.status === "Processing" || order.status === "Shipped") && (
                      <select
                        value={cancelReasons[order._id] || ""}
                        onChange={(e) => setCancelReasons((prev) => ({ ...prev, [order._id]: e.target.value }))}
                        className="px-2 py-1 border rounded-lg text-gray-900"
                      >
                        <option value="" disabled>Select a reason</option>
                        <option value="I changed my mind">I changed my mind</option>
                        <option value="Found a better price">Found a better price</option>
                        <option value="Item not needed">Item not needed</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={order.status === "Cancelled" || order.status === "Delivered" || !cancelReasons[order._id]}
                      className={`px-3 py-1 rounded-lg text-white transition-all ${
                        order.status === "Cancelled" || order.status === "Delivered" || !cancelReasons[order._id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;