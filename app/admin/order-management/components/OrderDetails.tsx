"use client";

import { useState } from "react";
import { Order } from "../page";
import { saveAs } from "file-saver";
import { API_BASE_URL } from '../../../../utils/api';

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
    const updatedOrder: Order = { ...order, status: newStatus, updatedAt: new Date().toISOString() };
    onUpdateOrder(updatedOrder);
  };

  const handleRefundCancel = async () => {
    if (window.confirm(`Confirm ${isRefundProcessing ? "refund" : "cancel"} for Order #${order.id}?`)) {
      const updatedOrder: Order = { ...order, status: "Cancelled", updatedAt: new Date().toISOString() };
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${order.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: updatedOrder.customerName,
            totalAmount: updatedOrder.totalAmount,
            status: updatedOrder.status,
            createdAt: updatedOrder.createdAt,
            updatedAt: updatedOrder.updatedAt,
            email: updatedOrder.email,
            mobileNumber: updatedOrder.mobileNumber,
            address: updatedOrder.address,
            paymentType: updatedOrder.paymentType,
            quantity: updatedOrder.quantity,
            price: updatedOrder.price,
            condition: updatedOrder.condition,
            title: updatedOrder.title,
            imageUrl: updatedOrder.imageUrl,
          }),
        });
        if (!response.ok) throw new Error("Failed to cancel/refund order");
        onUpdateOrder(updatedOrder);
        setIsRefundProcessing(false);
        alert(`${isRefundProcessing ? "Refund" : "Cancellation"} processed for Order #${order.id}`);
      } catch  {
        
        alert("Failed to process refund/cancellation. Please try again.");
      }
    }
  };

  const generateInvoice = () => {
    const invoiceContent = `
      Invoice for Order #${order.id}
      Customer: ${order.customerName}
      Email: ${order.email}
      Mobile Number: ${order.mobileNumber}
      Address: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}
      Payment Type: ${order.paymentType}
      Quantity: ${order.quantity}
      Price: ₹${order.price.toFixed(2)}
      Condition: ${order.condition}
      Book Title: ${order.title}
      Amount: ₹${order.totalAmount.toFixed(2)}
      Status: ${order.status}
      Date: ${new Date(order.createdAt).toLocaleDateString()}
      ${order.updatedAt ? `Updated: ${new Date(order.updatedAt).toLocaleDateString()}` : ""}
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `invoice_order_${order.id}.txt`);
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card p-6 max-w-md w-full animate__zoomIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Order Details - #{order.id}</h2>
        <div className="space-y-6">
          <p className="text-gray-800"><strong>Customer:</strong> {order.customerName}</p>
          <p className="text-gray-800"><strong>Email:</strong> {order.email}</p>
          <p className="text-gray-800"><strong>Mobile Number:</strong> {order.mobileNumber}</p>
          <p className="text-gray-800"><strong>Address:</strong> {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}`}</p>
          <p className="text-gray-800"><strong>Payment Type:</strong> {order.paymentType}</p>
          <p className="text-gray-800"><strong>Quantity:</strong> {order.quantity}</p>
          <p className="text-gray-800"><strong>Price:</strong> ₹{order.price.toFixed(2)}</p>
          <p className="text-gray-800"><strong>Condition:</strong> {order.condition}</p>
          <p className="text-gray-800"><strong>Book Title:</strong> {order.title}</p>
          <p className="text-gray-800"><strong>Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
          <p className="text-gray-800"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          {order.updatedAt && <p className="text-gray-800"><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsRefundProcessing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all disabled:opacity-50"
              disabled={order.status === "Cancelled" || order.status === "Delivered"}
            >
              Process Refund
            </button>
            <button
              onClick={() => {
                setIsRefundProcessing(false);
                handleRefundCancel();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
              disabled={order.status === "Cancelled"}
            >
              Cancel Order
            </button>
          </div>
          <button
            onClick={generateInvoice}
            className="btn-primary w-full mt-4 px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
          >
            Generate/Export Invoice
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}