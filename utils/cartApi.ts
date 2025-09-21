
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ,
//   withCredentials: true, 
// });

// export interface CartItem {
//   _id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   condition: string;
//   discountedPrice: number;
//   quantity: number;
//   categoryName?: string;
// }

// export const cartApi = {
//   getCart: () => api.get("/cart").then(res => res.data),
//   addToCart: (item: Partial<CartItem>) => api.post("/cart/add", item).then(res => res.data),
//   updateQuantity: (bookId: string, quantity: number) =>
//     api.put("/cart/update", { bookId, quantity }).then(res => res.data),
//   removeFromCart: (bookId: string) =>
//     api.delete(`/cart/remove/${bookId}`).then(res => res.data),
//   clearCart: () => api.delete("/cart/clear").then(res => res.data),
// };



// utils/cartApi.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // ✅ important for cookie auth
});

export interface CartItem {
  _id?: string;
  bookId: string;
  name: string;
  price: number;
  imageUrl?: string;
  condition: string;
  discountedPrice?: number;
  quantity: number;
  categoryName?: string;
}

export const cartApi = {
  // 🛒 Get cart
  getCart: () =>
    api.get("/getCart").then(res => res.data),

  // ➕ Add item to cart
  addToCart: (item: {
    bookId: string;
    title: string;
    price: number;
    quantity?: number;
  }) =>
    api.post("/addCart", item).then(res => res.data),

  // ✏️ Update quantity
  updateQuantity: (bookId: string, quantity: number) =>
    api.put("/updateCart", { bookId, quantity }).then(res => res.data),

  // ❌ Remove item
  removeFromCart: (bookId: string) =>
    api.delete(`/removeItem/${bookId}`).then(res => res.data),

  // 🧹 Clear cart
  clearCart: () =>
    api.delete("/clearCart").then(res => res.data),
};
