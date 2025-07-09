// components/OrderForm.tsx
"use client";

import { useEffect, useState } from "react";
import type { Order } from "../types";

interface OrderFormProps {
  order?: Order;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt?: string;
  }) => void;
}

export default function OrderForm({ order, onClose, onSave }: OrderFormProps) {
  const [formData, setFormData] = useState({
    id: order?.id || "",
    customerName: order?.customerName || "",
    totalAmount: order?.totalAmount || 0,
    status: order?.status || "Pending",
    createdAt: order?.createdAt || new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-yellow-500 bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg space-y-4 w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-800">
          {order ? "Edit Order" : "Add New Order"}
        </h2>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          className="w-full border rounded p-2"
          required
        />
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          placeholder="Total Amount"
          className="w-full border rounded p-2"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Order
          </button>
        </div>
      </form>
    </div>
  );
}
