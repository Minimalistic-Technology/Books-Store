"use client";

import type { Order } from "../types";

type OrderListProps = {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
};

export default function OrderList({ orders, onEdit, onDelete }: OrderListProps) {
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookstore/orderroutes/orders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");
      onDelete(id);
      // Trigger event to notify order-management
      window.dispatchEvent(new Event("orderUpdated"));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="card p-6 animate__fadeIn">
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp">
            <span className="text-gray-800">
              {order.customerName} - ₹{order.totalAmount.toFixed(2)} ({order.status})
            </span>
            <div>
              <button
                onClick={() => onEdit(order)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all"
              >
                Edit Status
              </button>
              <button
                onClick={() => handleDelete(order.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}