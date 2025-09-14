"use client";

import { useState, useEffect } from "react";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from '../../utils/api';
import { Order } from "../admin/order-product-management/types";

// interface Order {
//   id: string;
//   customerName: string;
//   email: string;
//   mobileNumber: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     pinCode: string;
//   };
//   paymentType: 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash on Delivery';
//   quantity: number;
//   price: number;
//   status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
//   condition: 'New' | 'Old';
//   createdAt: string;
//   updatedAt: string;
//   bookId: string;
//   date?: string;
//   title?: string;
//   imageUrl?: string | null;
//   cancelReason?: string | null;
// }

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelReasons, setCancelReasons] = useState<{ [key: string]: string }>({});
  const [customReasons, setCustomReasons] = useState<{ [key: string]: string }>({});
  const [reasonOptions, setReasonOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCancelReasons = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cancel-reasons`, {
          cache: "no-store",
          credentials:"include"
        });
        if (!response.ok) throw new Error(`Failed to fetch cancel reasons: ${response.status}`);
        const data = await response.json();
        
        setReasonOptions(data.reasons || []);
      } catch  {
        
      }
    };
    fetchCancelReasons();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/my-orders`, {
          cache: "no-store",
          credentials:"include"
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        const ordersArray = Array.isArray(data) ? data : data.orders || [];
        
        const mappedOrders = ordersArray.map((order:Order) => ({
          id: order._id,
          customerName: order.customerName,
          email: order.email,
          mobileNumber: order.mobileNumber,
          address: order.address,
          paymentType: order.paymentType,
          quantity: order.quantity,
          price: order.price,
          status: order.status,
          condition: order.condition,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          bookId: order.bookId,
          date: order.date,
          title: order.title || "Unknown Book",
          imageUrl: order.imageUrl || null,
          cancelReason: order.cancelReason || null,
        }));
        
        setOrders(mappedOrders);
        setError(null);
      } catch (err) {
        if(err instanceof Error)
        setError(err.message || "Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    
    if (!orderId) {
      
      setError("Invalid order ID.");
      return;
    }
    const reason = cancelReasons[orderId] === "Other" ? customReasons[orderId] || "" : cancelReasons[orderId];
    if (!reason) {
      setError("Please select or enter a cancellation reason.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const updatedOrder = await response.json();
      
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedOrder.order.status,
                cancelReason: updatedOrder.order.cancelReason,
                updatedAt: updatedOrder.order.updatedAt, 
              }
            : order
        )
      );
      setCancelReasons((prev) => {
        const newReasons = { ...prev };
        delete newReasons[orderId];
        return newReasons;
      });
      setCustomReasons((prev) => {
        const newCustomReasons = { ...prev };
        delete newCustomReasons[orderId];
        return newCustomReasons;
      });
      setError(null);
    } catch (err) {
      if(err instanceof Error)
      setError(err.message || "Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50 text-yellow-900 ">
      <Header />
      <main className="flex-col p-6 w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Your Orders</h1>
        {loading && <p className="text-yellow-900">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {orders.length === 0 && !loading ? (
          <p className="text-yellow-900">
            No orders found.{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollable-orders">
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between w-full">
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
                      {order.cancelReason && (
                        <p className="text-sm text-gray-600">
                          Cancel Reason: {order.cancelReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 space-x-2 items-center">
                    {(order.status === "Processing" || order.status === "Shipped") && (
                      <div className="flex flex-col space-y-2">
                        <select
                          value={cancelReasons[order.id] || ""}
                          onChange={(e) => setCancelReasons((prev) => ({ ...prev, [order.id]: e.target.value }))}
                          className="px-2 w-full py-1 border rounded-lg text-gray-900 my-2"
                        >
                          <option value="" disabled>Select a reason</option>
                          {reasonOptions.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                        {cancelReasons[order.id] === "Other" && (
                          <input
                            type="text"
                            value={customReasons[order.id] || ""}
                            onChange={(e) =>
                              setCustomReasons((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            placeholder="Enter custom reason"
                            className="px-2 py-1 border rounded-lg text-gray-900"
                          />
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={order.status === "Cancelled" || order.status === "Delivered" || !cancelReasons[order.id] || (cancelReasons[order.id] === "Other" && !customReasons[order.id])}
                      className={`px-3 py-1 rounded-lg text-white transition-all ${
                        order.status === "Cancelled" || order.status === "Delivered" || !cancelReasons[order.id] || (cancelReasons[order.id] === "Other" && !customReasons[order.id])
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