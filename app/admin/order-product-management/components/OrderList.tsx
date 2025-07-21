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
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");
      onDelete(id);
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {order.imageUrl && (
                  <img
                    src={order.imageUrl}
                    alt={order.title}
                    className="w-16 h-24 object-cover rounded-md"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                  <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-600">Email: {order.email}</p>
                  <p className="text-sm text-gray-600">Mobile: {order.mobileNumber}</p>
                  <p className="text-sm text-gray-600">
                    Address: {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}`}
                  </p>
                  <p className="text-sm text-gray-600">Payment: {order.paymentType}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ₹{order.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Condition: {order.condition}</p>
                  <p className="text-sm text-gray-600">
                    Status: <span
                      className={
                        order.status === "Delivered" ? "text-green-600" :
                        order.status === "Processing" ? "text-blue-600" :
                        order.status === "Shipped" ? "text-purple-600" :
                        order.status === "Cancelled" ? "text-red-600" : "text-yellow-600"
                      }
                    >{order.status}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(order)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}