"use client";

import { useState } from "react";
import type { Order } from "../types";

type OrderFormProps = {
  order?: Order;
  onClose: () => void;
  onSave: (data: { id: string; status: string }) => void;
};

export default function OrderForm({ order, onClose, onSave }: OrderFormProps) {
  const [formData, setFormData] = useState({
    id: order?.id || "",
    status: order?.status || "Pending",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(formData.status))
      newErrors.status = "Invalid status";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Edit Order Status</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                value={order?.customerName || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={order?.email || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                value={order?.mobileNumber || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={order ? `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}` : ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Type</label>
              <input
                type="text"
                value={order?.paymentType || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={order?.quantity || 0}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={order?.price || 0}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <input
                type="text"
                value={order?.condition || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Book Title</label>
              <input
                type="text"
                value={order?.title || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            {order?.cancelReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Cancel Reason</label>
                <input
                  type="text"
                  value={order.cancelReason}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}