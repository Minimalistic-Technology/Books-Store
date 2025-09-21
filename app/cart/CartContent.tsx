"use client";
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler?: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: string,
    callback: (response: RazorpayResponseError) => void
  ) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayResponseError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "../../utils/api";
import Image from "next/image";
import axios from "axios";
import { Book } from "../admin/order-product-management/types";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import useCheckIsLoggedIn from "../hooks/useCheckIsLoggedIn";

const defaultImageUrl =
  "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

interface CartItem {
  bookId: string;
  title: string;
  price: number;
  imageUrl: string;
  condition: string;
  discountedPrice: number;
  quantity: number;
  stock: number;
  categoryName?: string;
}
interface CartResponse {
  bookId: Book;
  quantity: number;
  stock: number;
  condition: string;
  _id: string;
}
interface FormData {
  paymentMethod: string;
  cardNumber: string;
  cardholderName: string;
  cvv: string;
  expiryDate: string;
  bankName: string;
  accountNumber: string;
  upiId: string;
}

export default function CartContent() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setQuantityNew] = useState<number | null>(0);
  const [, setQuantityOld] = useState<number | null>(0);

    const { isLoggedIn, checking } = useCheckIsLoggedIn(false);


  const {
    handleSubmit,

    formState: {},
  } = useForm<FormData>({
    defaultValues: {
      paymentMethod: "",
      cardNumber: "",
      cardholderName: "",
      cvv: "",
      expiryDate: "",
      bankName: "",
      accountNumber: "",
      upiId: "",
    },
  });
  const convertCartDataArray = (cartData: CartResponse[]) => {
    const newCartData = cartData.map((item: CartResponse) => {
      const initialDiscount =
        item.condition === "New"
          ? item.bookId.discountNew
          : item.bookId.discountOld;
      const discountedPrice = item.bookId.price * (1 - initialDiscount / 100);
      return {
        bookId: item.bookId._id,
        title: item.bookId.title,
        price: item.bookId.price,
        imageUrl: item.bookId.imageUrl,
        condition: item.condition,
        discountedPrice,
        quantity: item.quantity,
        stock: item.stock,
        categoryName: item.bookId.categoryPath,
      };
    });
    console.log(newCartData);
    return newCartData;
  };
  async function getCart() {
    if (cartItems.length === 0) {
      const cartDataRes = await axios.get(`${API_BASE_URL}/getCart`, {
        withCredentials: true,
      });
      const cartData = cartDataRes.data.items;
      console.log(cartDataRes, cartData);

      setCartItems(() => convertCartDataArray(cartData));
      // console.log(cartData);
    }
  }
  useEffect(() => {
    // const storedItems = JSON.parse(localStorage.getItem("cart") || "[]");

    getCart();

    // const id = searchParams.get("_id");
    // const name = searchParams.get("name");
    // const price = searchParams.get("price");
    // const imageUrl = searchParams.get("imageUrl") || defaultImageUrl;
    // const condition = searchParams.get("condition");
    // const discountedPrice = searchParams.get("discountedPrice");
    // const categoryName = searchParams.get("category") || "Non-Academics";

    // if (
    //   id &&
    //   name &&
    //   price &&
    //   !storedItems.some((item: CartItem) => item._id === id)
    // ) {
    //   const newItem: CartItem = {
    //     _id: id,
    //     name,
    //     price: parseFloat(price),
    //     imageUrl,
    //     condition: condition || "New",
    //     discountedPrice: discountedPrice
    //       ? parseFloat(discountedPrice)
    //       : parseFloat(price),
    //     quantity: 1,
    //     categoryName,
    //   };
    //   const updatedCart = [...storedItems, newItem];
    //   setCartItems(updatedCart);
    //   localStorage.setItem("cart", JSON.stringify(updatedCart));
    // } else {
    //   setCartItems(storedItems);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getEffectivePrice = (item: CartItem) => {
    return item.discountedPrice > 0 ? item.discountedPrice : item.price;
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + getEffectivePrice(item) * (item.quantity || 1),
      0
    );
  };

  const updateQuantity = async (
    id: string,
    newQuantity: number,
    condition: string
  ) => {
    // const updatedCart = cartItems.map((item) =>
    //   item._id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    // );
    // setCartItems(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));
    const updatedCartRes = await axios.put(
      `${API_BASE_URL}/updateCart`,
      {
        bookId: id,
        quantity: newQuantity,
        condition,
      },
      {
        withCredentials: true,
      }
    );
    // setCartItems(updatedCartRes.data.items);
    setCartItems(() => convertCartDataArray(updatedCartRes.data.items));
  };

  // const debouncedUpdateQuantity = useDebouncedCallback(
  //   async (id: string, newQuantity: number, condition: string) => {
  //     try {
  //       await updateQuantity(id, newQuantity, condition);
  //     } catch (err) {
  //       console.error("Failed to update quantity", err);
  //     }
  //   },
  //   300 // delay in ms
  // );

  const debouncedUpdateQuantity = useDebouncedCallback<
    [string, number, string]
  >(async (id, newQuantity, condition) => {
    try {
      await updateQuantity(id, newQuantity, condition);
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  }, 300);

  const removeItem = async (id: string, condition: string) => {
    if (!id) return;
    // const updatedCart = cartItems.filter((item) => item._id !== id);
    // setCartItems(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));
    const updatedCartRes = await axios.delete(
      `${API_BASE_URL}/removeItem/${id}?condition=${condition}`,
      { withCredentials: true }
    );
    // setCartItems(updatedCartRes.data.items);
    setCartItems(() => convertCartDataArray(updatedCartRes.data.items));

    // await getCart();
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!mobileNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.country ||
      !address.postalCode
    ) {
      setError("Please fill in all address fields.");
      return;
    }

    setError(null);
    setShowAddressForm(false);
    setShowPaymentForm(true);
  };

  const mapConditionToOrderSchema = (bookCondition: string): string => {
    if (bookCondition === "NEW - ORIGINAL PRICE" || bookCondition === "New")
      return "New";
    if (
      bookCondition === "OLD " ||
      bookCondition === "Old" ||
      bookCondition === "OLD - 35% OFF"
    )
      return "Old";
    if (bookCondition === "BOTH") return "New";
    throw new Error(`Invalid book condition: ${bookCondition}`);
  };

  const onPaymentSubmit = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty.");
      return;
    }

    for (const item of cartItems) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/books/${item.bookId}?t=${new Date().getTime()}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! Status: ${response.status}`
          );
        }
        const book = await response.json();

        const quantityNew = book.quantityNew ?? 0;
        setQuantityNew(quantityNew);
        const quantityOld = book.quantityOld ?? 0;
        setQuantityOld(quantityOld);
        const itemCondition = mapConditionToOrderSchema(item.condition);

        if (itemCondition === "New" && quantityNew < (item.quantity || 1)) {
          setError(
            `Insufficient new stock for ${item.title}. Only ${quantityNew} available.`
          );
          return;
        }
        if (itemCondition === "Old" && quantityOld < (item.quantity || 1)) {
          setError(
            `Insufficient old stock for ${item.title}. Only ${quantityOld} available.`
          );
          return;
        }
      } catch {
        setError(
          `Unable to verify stock for ${item.title}. Please try again or contact support.`
        );
        return;
      }
    }

    try {
      for (const item of cartItems) {
        const orderCondition = mapConditionToOrderSchema(item.condition);
        const orderData = {
          customerName,
          email,
          mobileNumber,
          address: {
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            pinCode: address.postalCode,
          },

          quantity: item.quantity || 1,
          amount: getEffectivePrice(item) * (item.quantity || 1) * 100,
          price: item.price,

          condition: orderCondition,
          bookId: item.bookId,
        };

        const resp = await fetch(`${API_BASE_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),

          credentials: "include",
        }).then((r) => r.json());

        const options = {
          key: resp.keyId,
          amount: resp.amount,
          currency: resp.currency,
          order_id: resp.orderId,
          name: "Your Store",
          prefill: {
            email: resp.email,
            contact: resp.phone,
            name: resp.username,
          },
          callback_url: resp.callback_url,
          handler: async (response: RazorpayResponse) => {
            try {
              const verifyRes = await fetch(`${API_BASE_URL}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }).then((r) => r.json());

              if (verifyRes.ok) {
                // localStorage.removeItem("cart");
                setCartItems([]);
                setShowPaymentForm(false);
                router.push("/profile?tab=orders");
              } else {
                setError(
                  "Payment verification failed. Please contact support."
                );
              }
            } catch {
              setError("Payment verification failed. Please try again.");
            }
          },

          modal: {
            ondismiss: () => {
              setError("Payment cancelled. You can try again.");
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (response: RazorpayResponseError) => {
          setError(
            `Payment failed: ${response.error.description} (${response.error.reason})`
          );
        });

        rzp.open();
      }
    } catch {}
  };

  if (checking || !isLoggedIn) {
    return (
      <>
        <div className="fixed w-screen h-screen z-100 flex justify-center items-center">
          Loading...
        </div>
      </>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Cart</span>
      </nav>
      <h1 className="text-4xl font-semibold mb-6 text-black">Your Book Cart</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{" "}
          <Link href="/" className="text-teal-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.bookId}
                className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <Image
                  width={100}
                  height={130}
                  src={item.imageUrl || defaultImageUrl}
                  alt={item.title || "Book Image"}
                  className="w-24 h-32 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImageUrl;
                  }}
                />
                <div className="flex-1 ml-4">
                  <div className="flex gap-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <h3 className="text-lg text-gray-500">({item.categoryName?.split("/").reverse()[0]})</h3>
                  </div>
                  <div className="flex  flex-wrap gap-4 items-center space-x-2">
                    {item.discountedPrice > 0 &&
                    item.discountedPrice < item.price ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.price.toFixed(2)}
                        </span>
                        <span className="text-orange-500 font-bold">
                          ₹{item.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-600">
                          (
                          {(
                            (1 - item.discountedPrice / item.price) *
                            100
                          ).toFixed(0)}
                          % off)
                        </span>
                      </>
                    ) : (
                      <span className="text-orange-500 font-bold">
                        ₹{item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Condition: {item.condition}
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock: {item.stock}
                    {/* {item.condition === "New" ? quantityNew : quantityOld} */}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const newQty = Math.max(1, (item.quantity || 1) - 1);
                        // optimistic UI update
                        // setCartItems((prev) =>
                        //   prev.map((i) =>
                        //     i.bookId === item.bookId
                        //       ? { ...i, quantity: newQty }
                        //       : i
                        //   )
                        // );
                        // debounced API call
                        debouncedUpdateQuantity(
                          item.bookId,
                          newQty,
                          item.condition
                        );
                      }}
                      className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => {
                        const newQty = (item.quantity || 1) + 1;
                        // optimistic UI update
                        // setCartItems((prev) =>
                        //   prev.map((i) =>
                        //     i.bookId === item.bookId
                        //       ? { ...i, quantity: newQty }
                        //       : i
                        //   )
                        // );
                        // debounced API call
                        debouncedUpdateQuantity(
                          item.bookId,
                          newQty,
                          item.condition
                        );
                      }}
                      className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.bookId, item.condition)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black">Order Summary</h2>
            <p className="text-gray-600">Subtotal: ₹{getTotal().toFixed(2)}</p>
            <p className="text-gray-600">Shipping: Free (over ₹100)</p>
            <p className="text-gray-600 font-semibold mt-2">
              Total: ₹{getTotal().toFixed(2)}
            </p>
            {showAddressForm ? (
              <form onSubmit={handleAddressSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Mobile Number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="Street Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleAddressChange}
                        placeholder="Postal Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleAddressChange}
                        placeholder="Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white rounded-full py-2 hover:bg-teal-700"
                    >
                      Submit Address
                    </button>
                  </div>
                </div>
              </form>
            ) : showPaymentForm ? (
              <form
                onSubmit={handleSubmit(onPaymentSubmit)}
                className="mt-4 space-y-4"
              >
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white rounded-full py-2 hover:bg-teal-700"
                >
                  Complete Payment
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-4 w-full  md:w-50 bg-teal-600 text-white rounded-full py-2 hover:bg-teal-700"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
