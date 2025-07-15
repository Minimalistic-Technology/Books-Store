"use client";

import type { Order } from "../types";

type OrderListProps = {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
};

export default function OrderList({ orders, onEdit, onDelete }: OrderListProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/bookstore/orderroutes/orders/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete order");
        onDelete(id);
        window.dispatchEvent(new Event("orderUpdated"));
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order. Please try again.");
      }
    }
  };

  return (
    <div className="card p-6 animate__fadeIn" role="region" aria-label="Order List">
      <ul className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp"
              role="listitem"
            >
              <span className="text-gray-800">
                {order.customerName} - ₹{order.totalAmount.toFixed(2)} ({order.status})
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(order)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label={`Edit status of ${order.customerName}'s order`}
                >
                  Edit Status
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete ${order.customerName}'s order`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No orders available.</li>
        )}
      </ul>
    </div>
  );
}