"use client";

import type { Order } from "../page";

type OrderListProps = {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
};

export default function OrderList({ orders, onEdit, onDelete }: OrderListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order.id} className="border-b py-2 flex justify-between items-center">
            <span>
              {order.customerName} - ${order.totalAmount.toFixed(2)} ({order.status})
            </span>
            <div>
              <button
                onClick={() => onEdit(order)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Edit Status
              </button>
              <button
                onClick={() => onDelete(order.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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