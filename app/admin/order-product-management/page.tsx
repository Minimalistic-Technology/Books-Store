"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";
import OrderForm from "./components/OrderForm";
import AddOrderForm from "./components/AddOrderForm";
import type { Order, OrderApiResponse } from "./types";
import { API_BASE_URL } from "../../../utils/api";

export default function OrderProductManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelReasons, setCancelReasons] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const fetchCancelReasons = async () => {
    try {
      const url = `${API_BASE_URL}/cancel-reasons`;
      
      const response = await fetch(url, { cache: "no-store",credentials:"include" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to fetch cancel reasons: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }
      const data = await response.json();
      setCancelReasons(data.reasons || []);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        setError("Failed to load cancellation reasons.");
      } else {
        
        setError("Failed to load cancellation reasons.");
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const url = `${API_BASE_URL}/orders`;
      
      const response = await fetch(url, { cache: "no-store",credentials:"include" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to fetch orders: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }
      const data = await response.json();
      setOrders(
        data.orders.map((order: OrderApiResponse) => ({
          id: order._id,
          customerName: order.customerName,
          email: order.email,
          mobileNumber: order.mobileNumber,
          address: order.address,
          paymentType: order.paymentType,
          quantity: order.quantity,
          price: order.price,
          status: order.status,
          condition: order.condition,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          bookId: order.bookId,
          title: order.title || "Unknown Book",
          imageUrl: order.imageUrl || null,
          cancelReason: order.cancelReason || null,
          userId: "",
          products: [],
          totalAmount: order.price,
          shippingAddress: order.address,
        }))
      );
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        setError("Failed to fetch orders. Please try again.");
      } else {
        
        setError("Failed to fetch orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCancelReasons();
  }, []);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDeleteOrder = async (id: string) => {
    if (deletingOrderId) return;
    setDeletingOrderId(id);
    
    const orderExists = orders.find((order) => order.id === id);
    if (!orderExists) {
      setError(
        "Order not found in the current list. Please refresh and try again."
      );
      setDeletingOrderId(null);
      return;
    }

    try {
      const url = `${API_BASE_URL}/orders/${id}`;
      
      const response = await fetch(url, {
        method: "DELETE",credentials:"include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
       
        if (response.status === 404) {
          setError(
            "Order not found on the server. It may have been deleted already."
          );
          setOrders((prev) => prev.filter((order) => order.id !== id));
        } else {
          throw new Error(
            errorData.message || `Failed to delete order: ${response.status}`
          );
        }
      } else {
        
        setOrders((prev) => prev.filter((order) => order.id !== id));
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        setError(err.message || "Failed to delete order. Please try again.");
      } else {
        
        setError("Failed to delete order. Please try again.");
      }
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      const url = `${API_BASE_URL}/orders/${orderId}/cancel`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
        credentials:"include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to cancel order: ${response.status}`
        );
      }
      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedOrder.order.status,
                cancelReason: updatedOrder.order.cancelReason,
                updatedAt: updatedOrder.order.updatedAt,
              }
            : order
        )
      );
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        setError("Failed to cancel order. Please try again.");
      } else {
        
        setError("Failed to cancel order. Please try again.");
      }
    }
  };

  const handleSaveOrder = async (data: { id: string; status: string }) => {
    try {
      const url = `${API_BASE_URL}/orders/${data.id}`;
      
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: data.status }),
        credentials:"include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update order: ${response.status}`
        );
      }
      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.id
            ? { ...order, status: updatedOrder.order.status }
            : order
        )
      );
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        setError("Failed to update order. Please try again.");
      } else {
        
        setError("Failed to update order. Please try again.");
      }
    }
  };

  const handleAddOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
    setError(null);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const closeAddOrderModal = () => {
    setIsAddOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-yellow-50 text-yellow-900  p-6 pt-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 mb-6">
        <h1 className="text-3xl font-semibold">Order Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchOrders}
            className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
          >
            Refresh Orders
          </button>
          <button
            onClick={() => setIsAddOrderModalOpen(true)}
            className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
          >
            Add New Order
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <>
          <OrderList
            orders={orders}
            cancelReasons={cancelReasons}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onCancel={handleCancelOrder}
          />
          {isOrderModalOpen && selectedOrder && (
            <OrderForm
              order={selectedOrder}
              onClose={closeOrderModal}
              onSave={handleSaveOrder}
            />
          )}
          {isAddOrderModalOpen && (
            <AddOrderForm
              onClose={closeAddOrderModal}
              onSave={handleAddOrder}
            />
          )}
        </>
      )}
    </div>
  );
}
