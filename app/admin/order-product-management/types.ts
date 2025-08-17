export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  zipCode: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  address: Address;
  paymentType: "Credit Card" | "Debit Card" | "UPI" | "Cash on Delivery";
  quantity: number;
  price: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  condition: "New" | "Old";
  createdAt: string;
  bookId: string;
  title: string;
  imageUrl?: string;
  userId: string;
  products: { productId: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: Address;
  updatedAt: string;
}
