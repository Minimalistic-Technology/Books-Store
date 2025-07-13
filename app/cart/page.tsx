"use client";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

interface CartItem {
  _id: string;
  name: string; // Maps to title in orders
  price: number;
  imageUrl: string;
  condition: string;
  discountedPrice: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedItems);

    const id = searchParams.get("_id");
    const name = searchParams.get("name");
    const price = searchParams.get("price");
    const imageUrl = searchParams.get("imageUrl");
    const condition = searchParams.get("condition");
    const discountedPrice = searchParams.get("discountedPrice");

    if (id && name && price && !storedItems.some((item: CartItem) => item._id === id)) {
      const newItem: CartItem = {
        _id: id,
        name,
        price: parseFloat(price),
        imageUrl: imageUrl || "",
        condition: condition || "NEW - ORIGINAL PRICE",
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : 0,
        quantity: 1,
      };
      const updatedCart = [...storedItems, newItem];
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Added new item to cart:", newItem);
    }
  }, [searchParams]);

  const getEffectivePrice = (item: CartItem) => {
    return item.condition === "OLD - 30% OFF" && item.discountedPrice > 0 ? item.discountedPrice : item.price;
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + getEffectivePrice(item) * (item.quantity || 1), 0);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Updated quantity for item:", id, "to", newQuantity);
  };

  const removeItem = (id: string) => {
    console.log("Removing item with id:", id);
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Cart after removal:", updatedCart);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted address:", address);
    setShowAddressForm(false);
    setShowPaymentForm(true);
  };

  const paymentForm = useForm({
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

  const onPaymentSubmit = (data: any) => {
    console.log("Payment details submitted:", data);
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const orderItems = cartItems.map((item: CartItem) => ({
      ...item,
      title: item.name, // Map name to title for order display
      status: "Shipped" as const, // Initial status set to Shipped
    }));
    localStorage.setItem("orders", JSON.stringify(orderItems));
    // Notify admin panel (simulated via localStorage for now)
    const adminOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
    localStorage.setItem("adminOrders", JSON.stringify([...adminOrders, ...orderItems]));
    localStorage.removeItem("cart");
    setCartItems([]);
    setShowPaymentForm(false);
    router.push("/orders");
  };

  const handleUpiVerify = () => {
    const upiId = paymentForm.getValues("upiId");
    console.log("Verifying UPI ID:", upiId);
    alert("UPI verification simulated. Please integrate with a UPI API for real validation.");
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 text-stone-900 font-serif">
      <Header />
      <main className="max-w-6xl mx-auto py-10 px-4">
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">Home</Link> / <span>Cart</span>
        </nav>
        <h1 className="text-4xl font-semibold mb-6 text-black">Your Book Cart</h1>
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
                  key={item._id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; // Fallback image
                    }}
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      {item.condition === "OLD - 30% OFF" && item.discountedPrice > 0 ? (
                        <>
                          <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                          <span className="text-orange-500 font-bold">₹{item.discountedPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-orange-500 font-bold">₹{item.price.toFixed(2)}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                        className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
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
              <p className="text-gray-600 font-semibold mt-2">Total: ₹{getTotal().toFixed(2)}</p>
              {showAddressForm ? (
                <form onSubmit={handleAddressSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        placeholder="Street Address"
                        required
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
                          required
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
                          required
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
                          required
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
                          required
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
                  onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <select
                      value={paymentForm.watch("paymentMethod") || ""}
                      onChange={(e) => paymentForm.setValue("paymentMethod", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="" disabled>
                        Select Payment Method
                      </option>
                      <option value="creditCard">Credit Card</option>
                      <option value="debitCard">Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="netBanking">Net Banking</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>
                  {(paymentForm.watch("paymentMethod") === "creditCard" ||
                    paymentForm.watch("paymentMethod") === "debitCard") && (
                    <>
                      <input
                        type="text"
                        {...paymentForm.register("cardNumber")}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        {...paymentForm.register("cardholderName")}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          {...paymentForm.register("cvv")}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          {...paymentForm.register("expiryDate")}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </>
                  )}
                  {paymentForm.watch("paymentMethod") === "netBanking" && (
                    <>
                      <select
                        value={paymentForm.watch("bankName") || ""}
                        onChange={(e) => paymentForm.setValue("bankName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="" disabled>
                          Select Bank Name
                        </option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                      <input
                        type="text"
                        {...paymentForm.register("accountNumber")}
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </>
                  )}
                  {paymentForm.watch("paymentMethod") === "upi" && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        {...paymentForm.register("upiId")}
                        placeholder="example@upi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={handleUpiVerify}
                        className="bg-gray-200 text-black rounded-full py-2 px-4 hover:bg-gray-300"
                      >
                        Verify
                      </button>
                    </div>
                  )}
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
                  className="mt-4 w-full bg-teal-600 text-white rounded-full py-2 hover:bg-teal-700"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;