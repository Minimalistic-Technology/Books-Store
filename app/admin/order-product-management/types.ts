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
