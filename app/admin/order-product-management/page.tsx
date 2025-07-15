"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";
import ProductForm from "./components/ProductForm";
import { Order, Product } from "./types";

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
          status: item.status || "Pending",
          createdAt: item.createdAt || new Date().toISOString(),
          items: item.items || [],
        })));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
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
  }, []);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  const handleSaveOrder = async (data: { id?: string; customerName: string; totalAmount: number; status: string; createdAt?: string; items?: any[] }) => {
    const newOrder: Order = {
      id: data.id || Date.now().toString(),
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      status: data.status as Order["status"],
      createdAt: data.createdAt || new Date().toISOString(),
      items: data.items || [],
    };

    try {
      let response;
      if (data.id) {
        // Update existing order
        response = await fetch(`http://localhost:5000/api/bookstore/orderroutes/orders/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: newOrder.customerName,
            totalAmount: newOrder.totalAmount,
            status: newOrder.status,
            createdAt: newOrder.createdAt,
            items: newOrder.items,
          }),
        });
      } else {
        // Create new order
        response = await fetch("http://localhost:5000/api/bookstore/orderroutes/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: newOrder.customerName,
            totalAmount: newOrder.totalAmount,
            status: newOrder.status,
            createdAt: newOrder.createdAt,
            items: newOrder.items,
          }),
        });
      }

      if (!response.ok) throw new Error("Failed to save order");
      const savedData = await response.json();
      newOrder.id = savedData._id || newOrder.id;

      // Update local state
      if (data.id) {
        setOrders((prev) => prev.map((order) => (order.id === newOrder.id ? newOrder : order)));
      } else {
        setOrders((prev) => [...prev, newOrder]);
      }

      // Dispatch event to notify order-management
      window.dispatchEvent(new Event("orderUpdated"));
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    }

    setIsOrderFormOpen(false);
    setSelectedOrder(null);
  };

  const handleSaveProduct = async (data: { id?: string; name: string; price: number; inventory: number; description: string; createdAt?: string }) => {
    const newProduct: Product = {
      id: data.id || "",
      name: data.name,
      price: data.price,
      inventory: data.inventory,
      description: data.description,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      let response;
      if (data.id) {
        response = await fetch(`http://localhost:5000/api/bookstore/productroutes/products/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: newProduct.name,
            price: newProduct.price,
            inventory: newProduct.inventory,
            description: newProduct.description,
            createdAt: newProduct.createdAt,
          }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/bookstore/productroutes/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: newProduct.name,
            price: newProduct.price,
            inventory: newProduct.inventory,
            description: newProduct.description,
            createdAt: newProduct.createdAt,
          }),
        });
      }

      if (!response.ok) throw new Error("Failed to save product");
      const savedData = await response.json();
      newProduct.id = savedData._id || newProduct.id;

      // Update local state
      if (data.id) {
        setProducts((prev) => prev.map((product) => (product.id === newProduct.id ? newProduct : product)));
      } else {
        setProducts((prev) => [...prev, newProduct]);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }

    setIsProductFormOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    window.dispatchEvent(new Event("orderUpdated"));
  };

  const handleDeleteProduct = async (id: string) => {
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