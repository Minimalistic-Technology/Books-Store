// components/OrderList.tsx
"use client";

import type { Order } from "../page";

type OrderListProps = {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
};

export default function OrderList({ orders, onEdit, onDelete }: OrderListProps) {
  return (
    <div className="card p-6 animate__fadeIn">
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp">
            <span className="text-gray-800">
              {order.customerName} - ${order.totalAmount.toFixed(2)} ({order.status})
            </span>
            <div>
              <button
                onClick={() => onEdit(order)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all"
              >
                Edit Status
              </button>
              <button
                onClick={() => onDelete(order.id)}
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