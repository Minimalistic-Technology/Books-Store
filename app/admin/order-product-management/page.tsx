"use client";

import { useState, useEffect } from "react";
import OrderList from "./components/OrderList";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";
import ProductForm from "./components/ProductForm";

// Interfaces
export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  description: string;
  createdAt: string;
}

// Named export for updating products
export const updateProducts = (newProducts: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
  setProducts((prev) => [...prev, ...newProducts]);
};

// Default export for the component
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
        const data = await response.json();
        setOrders(data.map((item: any) => ({
          id: item._id,
          customerName: item.customerName,
          totalAmount: item.totalAmount,
          status: item.status,
          createdAt: item.createdAt,
        })));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookstore/productroutes/products");
        const data = await response.json();
        setProducts(data.map((item: any) => ({
          id: item._id,
          name: item.productName,
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

  const handleSaveOrder = (data: { id?: string; customerName: string; totalAmount: number; status: string; createdAt?: string }) => {
    const newOrder: Order = {
      id: data.id || Date.now().toString(),
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      status: data.status as Order["status"],
      createdAt: data.createdAt || new Date().toISOString(),
    };
    if (selectedOrder) {
      setOrders((prev) => prev.map((order) => (order.id === selectedOrder.id ? newOrder : order)));
    } else {
      setOrders((prev) => [...prev, newOrder]);
    }
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