"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  date?: string;
  updatedAt?: string;
  __v?: number;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/bookstore/orderroutes/orders");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("API Response:", data); // Debug the response
        if (!Array.isArray(data.orders)) {
          throw new Error("Invalid data format: 'orders' is not an array");
        }
        const mappedOrders = data.orders.map((item: any) => ({
          id: item.id || item._id,
          customerName: item.customerName,
          totalAmount: item.totalAmount,
          status: item.status as Order["status"],
          createdAt: item.createdAt,
          date: item.date,
          updatedAt: item.updatedAt,
          __v: item.__v,
        }));
        setOrders(mappedOrders);
        setError(null); // Clear error on success
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Listen for order update event from order-product-management
    const handleOrderUpdate = () => {
      fetchOrders();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);

    // Cleanup event listener
    return () => window.removeEventListener("orderUpdated", handleOrderUpdate);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
    fetch(`http://localhost:5000/api/bookstore/orderroutes/orders/${updatedOrder.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: updatedOrder.customerName,
        totalAmount: updatedOrder.totalAmount,
        status: updatedOrder.status,
        createdAt: updatedOrder.createdAt,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to update order");
        return response.json();
      })
      .catch(err => console.error("Error updating order:", err));
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Order Management - Books Store</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-center">Loading orders...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
            />
          </div>
          <OrderList orders={filteredOrders} onUpdateOrder={handleUpdateOrder} />
        </>
      )}
    </div>
  );
}