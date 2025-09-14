"use client";

import { useState } from "react";
import type { Order } from "../types";
import Image from "next/image";

type OrderListProps = {
  orders: Order[];
  cancelReasons: string[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
};

export default function OrderList({
  orders,
  cancelReasons,
  onEdit,
  onDelete,
  onCancel,
}: OrderListProps) {
  const [selectedReasons, setSelectedReasons] = useState<{
    [key: string]: string;
  }>({});
  const [customReasons, setCustomReasons] = useState<{ [key: string]: string }>(
    {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (deletingOrderId) return;
    if (!confirm("Are you sure you want to delete this order?")) return;
    setDeletingOrderId(id);
    try {
      
      await onDelete(id);
      setErrors((prev) => ({ ...prev, [id]: "" }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        setErrors((prev) => ({
          ...prev,
          [id]: err.message,
        }));
      } else {
        
        setErrors((prev) => ({
          ...prev,
          [id]: "Failed to delete order. Please try again.",
        }));
      }
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleCancel = (id: string) => {
    const reason =
      selectedReasons[id] === "Other"
        ? customReasons[id] || ""
        : selectedReasons[id];
    if (!reason) {
      setErrors((prev) => ({
        ...prev,
        [id]: "Please select or enter a cancellation reason.",
      }));
      return;
    }
    onCancel(id, reason);
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-md flex md:flex-row flex-col gap-4 md:gap-0 items-center justify-between"
            >
              <div className="flex flex-col md:flex-row min-w-full md:min-w-auto items-center space-x-4">
                {order.imageUrl && (
                  <Image
                    src={order.imageUrl}
                    alt={order.title || "Unknown Book"}
                    width={100}
                    height={100}
                    className="w-full md:w-16 md:h-24 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.title || "Unknown Book"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer: {order.customerName}
                  </p>
                  <p className="text-sm text-gray-600">Email: {order.email}</p>
                  <p className="text-sm text-gray-600">
                    Mobile: {order.mobileNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Address:{" "}
                    {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentType}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{order.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Condition: {order.condition}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Processing"
                          ? "text-blue-600"
                          : order.status === "Shipped"
                          ? "text-purple-600"
                          : order.status === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {order.status}
                    </span>
                  </p>
                  {order.cancelReason && (
                    <p className="text-sm text-gray-600">
                      Cancel Reason: {order.cancelReason}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full md:w-auto space-y-2">
                {(order.status === "Processing" ||
                  order.status === "Shipped") && (
                  <div className="flex flex-col space-y-2">
                    <select
                      value={selectedReasons[order.id] || ""}
                      onChange={(e) =>
                        setSelectedReasons((prev) => ({
                          ...prev,
                          [order.id]: e.target.value,
                        }))
                      }
                      className="px-2 py-1 border rounded-lg text-gray-900"
                    >
                      <option value="" disabled>
                        Select a reason
                      </option>
                      {cancelReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    {selectedReasons[order.id] === "Other" && (
                      <input
                        type="text"
                        value={customReasons[order.id] || ""}
                        onChange={(e) =>
                          setCustomReasons((prev) => ({
                            ...prev,
                            [order.id]: e.target.value,
                          }))
                        }
                        placeholder="Enter custom reason"
                        className="px-2 py-1 border rounded-lg text-gray-900"
                      />
                    )}
                    {errors[order.id] && (
                      <p className="text-red-500 text-sm">{errors[order.id]}</p>
                    )}
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={
                        !selectedReasons[order.id] ||
                        (selectedReasons[order.id] === "Other" &&
                          !customReasons[order.id])
                      }
                      className={`px-3 py-1 rounded-lg text-white transition-all ${
                        !selectedReasons[order.id] ||
                        (selectedReasons[order.id] === "Other" &&
                          !customReasons[order.id])
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(order)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    disabled={deletingOrderId === order.id}
                    className={`bg-red-500 text-white px-3 py-1 rounded-lg transition-all ${
                      deletingOrderId === order.id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-600"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
