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
  products?: []; 
  totalAmount?: number; 
  shippingAddress?: IAddress;
}
export interface OrderApiResponse {
  _id: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  paymentType: string;
  quantity: number;
  price: number;
  status: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  bookId: string;
  title?: string;        
  imageUrl?: string | null;
  cancelReason?: string | null;
}


export interface Content {
  id?: string;
  _id?:string;
  title: string;
  bookName?:string;
  categoryName?: string;
  subCategory?: string;
  categoryPath: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  price: number;
  description: string;
  estimatedDelivery: string;
  condition: string;
  author: string;
  publisher: string;
  imageUrl: string;
  quantityNew: number;
  quantityOld: number;
  discountNew: number;
  discountOld: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
  updatedAt?: string;
}