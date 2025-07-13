export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: "Shipped" | "Delivered" | "Shipping" | "On the Way" | "Out for Delivery";
  createdAt: string;
  items?: any[]; // Array of order items
}

export interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  description: string;
  createdAt: string;
}