// app/admin/order-management/page.tsx
"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string; // ISO date string
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setOrders([
      { id: "1", customerName: "John Doe", totalAmount: 50.00, status: "Pending", createdAt: new Date().toISOString() },
      { id: "2", customerName: "Jane Smith", totalAmount: 75.00, status: "Shipped", createdAt: new Date().toISOString() },
      { id: "3", customerName: "Alice Johnson", totalAmount: 30.00, status: "Delivered", createdAt: new Date().toISOString() },
      { id: "4", customerName: "Bob Brown", totalAmount: 120.00, status: "Processing", createdAt: new Date().toISOString() },
    ]);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Order Management - Books Store</h1>
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
      <OrderList orders={filteredOrders} onUpdateOrder={(updatedOrder) => {
        setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      }} />
    </div>
  );
}