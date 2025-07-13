"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";
import ProductForm from "./components/ProductForm";
import { Order, Product } from "./types";

// Named export for updating products
export const updateProducts = (newProducts: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
  setProducts((prev) => [...prev, ...newProducts]);
};

export default function OrderProductManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookstore/orderroutes/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.orders.map((item: any) => ({
          id: item.id || item._id,
          customerName: item.customerName || "Anonymous",
          totalAmount: item.totalAmount || 0,
          status: item.status || "Shipped",
          createdAt: item.createdAt || new Date().toISOString(),
          items: item.items || [], // Array of order items
        })));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Fallback to localStorage if API fails
        const savedOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
        setOrders(savedOrders.map((item: any) => ({
          id: item._id,
          customerName: "Anonymous",
          totalAmount: item.price * item.quantity,
          status: item.status || "Shipped",
          createdAt: new Date().toISOString(),
          items: [item],
        })));
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookstore/productroutes/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || item.productName,
          price: item.price,
          inventory: item.inventory,
          description: item.description,
          createdAt: item.createdAt,
        })));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchOrders();
    fetchProducts();

    // Sync with localStorage updates from cart
    const syncOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
      setOrders((prev) => {
        const updatedOrders = [...prev, ...savedOrders.filter((newOrder: any) => 
          !prev.some((order) => order.id === newOrder._id)
        )].map((order) => ({
          id: order.id || order._id,
          customerName: "Anonymous",
          totalAmount: order.items.reduce((sum: number, item: any) => sum + (item.discountedPrice || item.price) * item.quantity, 0),
          status: order.status || "Shipped",
          createdAt: order.createdAt || new Date().toISOString(),
          items: order.items || [order],
        }));
        return updatedOrders;
      });
    };
    window.addEventListener("orderUpdated", syncOrders);
    return () => window.removeEventListener("orderUpdated", syncOrders);
  }, []);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  const handleSaveOrder = (data: { id?: string; customerName: string; totalAmount: number; status: string; createdAt?: string; items?: any[] }) => {
    const newOrder: Order = {
      id: data.id || Date.now().toString(),
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      status: data.status as Order["status"],
      createdAt: data.createdAt || new Date().toISOString(),
      items: data.items || [],
    };
    if (selectedOrder) {
      setOrders((prev) => prev.map((order) => (order.id === selectedOrder.id ? newOrder : order)));
      // Update localStorage and notify
      const allOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
      const updatedOrders = allOrders.map((order: any) => order._id === newOrder.id ? { ...order, status: newOrder.status } : order);
      localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
      const userOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedUserOrders = userOrders.map((order: any) => order._id === newOrder.id ? { ...order, status: newOrder.status } : order);
      localStorage.setItem("orders", JSON.stringify(updatedUserOrders));
    } else {
      setOrders((prev) => [...prev, newOrder]);
    }
    window.dispatchEvent(new Event("orderUpdated"));
    setIsOrderFormOpen(false);
  };

  const handleSaveProduct = (data: { id?: string; name: string; price: number; inventory: number; description: string; createdAt?: string }) => {
    const newProduct: Product = {
      id: data.id || "",
      name: data.name,
      price: data.price,
      inventory: data.inventory,
      description: data.description,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    if (selectedProduct) {
      setProducts((prev) => prev.map((product) => (product.id === selectedProduct.id ? newProduct : product)));
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }
    setIsProductFormOpen(false);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    const allOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
    localStorage.setItem("adminOrders", JSON.stringify(allOrders.filter((order: any) => order._id !== id)));
    const userOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify(userOrders.filter((order: any) => order._id !== id)));
    window.dispatchEvent(new Event("orderUpdated"));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Order & Product Management - Books Store</h1>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setIsOrderFormOpen(true)}
          className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Add New Order
        </button>
        <button
          onClick={() => setIsProductFormOpen(true)}
          className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Add New Product
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
          <OrderList orders={orders} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
          <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        </div>
      </div>
      {isOrderFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
          <div className="card bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate__zoomIn">
            <button
              onClick={() => {
                setSelectedOrder(null);
                setIsOrderFormOpen(false);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <OrderForm
              order={selectedOrder ?? undefined}
              onClose={() => {
                setSelectedOrder(null);
                setIsOrderFormOpen(false);
              }}
              onSave={handleSaveOrder}
            />
          </div>
        </div>
      )}
      {isProductFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
          <div className="card bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate__zoomIn">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsProductFormOpen(false);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <ProductForm
              product={selectedProduct ?? undefined}
              onClose={() => {
                setSelectedProduct(null);
                setIsProductFormOpen(false);
              }}
              onSave={handleSaveProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
}