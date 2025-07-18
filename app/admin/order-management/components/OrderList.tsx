"use client";

import { useState } from "react";
import { Order } from "../page";
import OrderDetails from "./OrderDetails";

type OrderListProps = {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
};

export default function OrderList({ orders, onUpdateOrder }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="card p-6 animate__fadeIn" role="region" aria-label="Order List">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp"
            >
              <span className="text-gray-800">
                {order.customerName} - ₹{order.totalAmount.toFixed(2)} ({order.status}) - {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label={`View details of ${order.customerName}'s order`}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateOrder={onUpdateOrder}
        />
      )}
    </div>
  );
}