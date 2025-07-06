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
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="border-b py-2 flex justify-between items-center">
              <span>
                {order.customerName} - ${order.totalAmount.toFixed(2)} ({order.status}) - {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-teal-500 text-white px-2 py-1 rounded hover:bg-teal-600"
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