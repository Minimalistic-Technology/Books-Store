"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";

export interface Order {
     id: string
    customerName: string
    totalAmount: number 
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
    createdAt: string
    updatedAt?: string
}


export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/bookstore/orderroutes/orders");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (!Array.isArray(data.orders)) {
        throw new Error("Invalid data format: 'orders' is not an array");
      }
      const mappedOrders = data.orders.map((item: any) => ({
        id: item.id || item._id,
        customerName: item.customerName || "Anonymous",
        totalAmount: item.totalAmount || 0,
        status: item.status || "Pending",
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt,
      }));
      setOrders(mappedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleOrderUpdate = () => {
      console.log("Order updated event received");
      fetchOrders();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);

    return () => window.removeEventListener("orderUpdated", handleOrderUpdate);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookstore/orderroutes/orders/${updatedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: updatedOrder.customerName,
          totalAmount: updatedOrder.totalAmount,
          status: updatedOrder.status,
          createdAt: updatedOrder.createdAt,
          updatedAt: updatedOrder.updatedAt || new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
      window.dispatchEvent(new Event("orderUpdated"));
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order. Reverting to last known state.");
      fetchOrders();
    }
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