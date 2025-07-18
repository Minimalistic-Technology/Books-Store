"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";
import OrderForm from "./components/OrderForm";
import type { Order } from "./types";

export default function OrderProductManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookstore/orderroutes/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.orders.map((order: any) => ({
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
        bookId: order.bookId,
        title: order.title,
        imageUrl: order.imageUrl,
      })));
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    const event = new CustomEvent("orderUpdated");
    window.dispatchEvent(event);
  };

  const handleSaveOrder = async (data: { id: string; status: string }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookstore/orderroutes/orders/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: data.status }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.id ? { ...order, status: updatedOrder.order.status } : order
        )
      );
      const event = new CustomEvent("orderUpdated");
      window.dispatchEvent(event);
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen w-full bg-yellow-50 text-yellow-900 font-serif p-6">
      <h1 className="text-3xl font-semibold mb-6">Order Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <OrderList orders={orders} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />
          {isOrderModalOpen && selectedOrder && (
            <OrderForm order={selectedOrder} onClose={closeOrderModal} onSave={handleSaveOrder} />
          )}
        </>
      )}
    </div>
  );
}