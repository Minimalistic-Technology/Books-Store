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
export interface BookstoreReview {
  id: string;
  _id?:string;
  bookId: { _id: string; title: string }; // Populated bookId
  categoryName: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'disapproved';
}
export interface Order {
  id: string;
  _id?:string;
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
  date?: string;
  title?: string;
  imageUrl?: string | null;
  cancelReason?: string | null; 
  userId?: string;
  products?: []; 
  totalAmount?: number; 
  shippingAddress?: IAddress;
  bookId:Book;
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
  categoryName: string;
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

export interface Book {
  _id: string;
  bookName: string;
  title: string;
  categoryPath: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  price: number;
  description?: string;
  estimatedDelivery?: string;
  condition: "new" | "used";
  author?: string;
  publisher?: string;
  imageUrl: string;
  quantityNew: number;
  quantityOld: number;
  discountNew: number;
  discountOld: number;
  effectiveDiscount: number;
  discountedPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Category {
  _id: string;
  name: string;
  path: string;
  children: Category[];
  books: Book[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface SiteSettings {
  _id: string;
  logo: string | null;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  apiKey: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  username: string;
  email: string;
}

export interface BookRequest {
  name: string;
  email: string;
  mobile: string;
  bookTitle: string;
  publisher: string;
  author: string;
  classLevel: string;
  message: string;
}