"use client";

import { useState } from "react";
import { Order } from "../page";
import { saveAs } from "file-saver"; // For exporting invoice (install via npm install file-saver)

type OrderDetailsProps = {
  order: Order;
  onClose: () => void;
  onUpdateOrder: (order: Order) => void;
};

export default function OrderDetails({ order, onClose, onUpdateOrder }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status);
  const [isRefundProcessing, setIsRefundProcessing] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order["status"];
    setStatus(newStatus);
    const updatedOrder: Order = { ...order, status: newStatus as Order["status"] };
    onUpdateOrder(updatedOrder);
  };

  const handleRefundCancel = () => {
    if (window.confirm(`Confirm ${isRefundProcessing ? "refund" : "cancel"} for Order #${order.id}?`)) {
      const updatedOrder = { ...order, status: "Cancelled" as Order["status"] };
      onUpdateOrder(updatedOrder);
      setIsRefundProcessing(false);
      alert(`${isRefundProcessing ? "Refund" : "Cancellation"} processed for Order #${order.id}`);
    }
  };

  const generateInvoice = () => {
    const invoiceContent = `
      Invoice for Order #${order.id}
      Customer: ${order.customerName}
      Amount: $${order.totalAmount.toFixed(2)}
      Status: ${order.status}
      Date: ${new Date(order.createdAt).toLocaleDateString()}
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `invoice_order_${order.id}.txt`);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Order Details - #{order.id}</h2>
        <div className="space-y-4">
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <button
            onClick={() => setIsRefundProcessing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
            disabled={order.status === "Cancelled" || order.status === "Delivered"}
          >
            Process Refund
          </button>
          <button
            onClick={() => {
              setIsRefundProcessing(false);
              handleRefundCancel();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={order.status === "Cancelled"}
          >
            Cancel Order
          </button>
          <button
            onClick={generateInvoice}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Generate/Export Invoice
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}