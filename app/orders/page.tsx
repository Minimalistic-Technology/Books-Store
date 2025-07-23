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
        console.log("Fetched orders:", data.orders);
        setOrders(data.orders || []);
        setError(null);
      } catch (err: any) {
        console.error("Fetch orders error:", { message: err.message, stack: err.stack });
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
        body: JSON.stringify({ status: "Cancelled" }),
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
      console.log("Order cancelled:", orderId);
    } catch (err: any) {
      console.error("Cancel order error:", { message: err.message, stack: err.stack, orderId });
      setError(err.message || "Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50 text-yellow-900 font-serif">
      <Header />
      <main className="flex-grow p-6">
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
                <div key={order._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {order.imageUrl ? (
                      <Image
                        src={order.imageUrl}
                        alt={order.title || "Unknown Book"}
                        width={64}
                        height={96}
                        className="w-16 h-24 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-24 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500 text-sm">No image</p>
                      </div>
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={order.status === "Cancelled" || order.status === "Delivered"}
                      className={`px-3 py-1 rounded-lg text-white transition-all ${
                        order.status === "Cancelled" || order.status === "Delivered"
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