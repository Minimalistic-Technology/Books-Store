// components/OrderForm.tsx
"use client";

import { useState } from "react";
import { Order } from "../types";

type OrderFormProps = {
  order?: Order;
  onClose: () => void;
  onSave: (data: { id?: string; customerName: string; totalAmount: number; status: string; createdAt?: string }) => void;
};

export default function OrderForm({ order, onClose, onSave }: OrderFormProps) {
  const [formData, setFormData] = useState({
    id: order?.id || "",
    customerName: order?.customerName || "",
    totalAmount: order?.totalAmount || 0,
    status: order?.status || "Pending",
    createdAt: order?.createdAt || new Date().toISOString(),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? parseFloat(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer Name is required";
    if (formData.totalAmount <= 0) newErrors.totalAmount = "Total Amount must be greater than 0";
    if (!formData.status) newErrors.status = "Status is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: formData.id,
      customerName: formData.customerName,
      totalAmount: formData.totalAmount,
      status: formData.status,
      createdAt: formData.createdAt,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-yellow-500 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-lg w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
          {order ? "Edit Order" : "Add New Order"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Customer Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
            </div>
            <div>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ""}
                onChange={handleChange}
                placeholder="Total Amount"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                step="0.01"
                min="0.01"
              />
              {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
            </div>
            <div>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
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