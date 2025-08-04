export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentType = 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash on Delivery';
export type Condition = 'New' | 'Old';

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  address: IAddress;
  paymentType: PaymentType;
  quantity: number;
  price: number;
  status: OrderStatus;
  condition: Condition;
  createdAt: string;
  updatedAt: string;
  bookId: string;
  date?: string;
  title?: string;
  imageUrl?: string | null;
  cancelReason?: string | null; 
  userId?: string;
  products?: any[]; 
  totalAmount?: number; 
  shippingAddress?: IAddress;
}