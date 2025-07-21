"use client";
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  condition: string;
  discountedPrice: number;
  quantity: number;
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
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
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

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cart") || "[]");
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
        condition: condition || "New",
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : parseFloat(price),
        quantity: 1,
      };
      const updatedCart = [...storedItems, newItem];
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Added new item to cart:", newItem);
    } else {
      setCartItems(storedItems);
    }
  }, [searchParams]);

  const getEffectivePrice = (item: CartItem) => {
    return item.condition === "Old" && item.discountedPrice > 0 ? item.discountedPrice : item.price;
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
    if (!address.street || !address.city || !address.state || !address.country || !address.postalCode) {
      setError("Please fill in all address fields.");
      return;
    }
    console.log("Submitted address:", address);
    setError(null);
    setShowAddressForm(false);
    setShowPaymentForm(true);
  };

  const mapConditionToOrderSchema = (bookCondition: string): string => {
    if (bookCondition === "NEW - ORIGINAL PRICE" || bookCondition === "New") return "New";
    if (bookCondition === "OLD " || bookCondition === "Old" || bookCondition === "OLD - 35% OFF") return "Old";
    if (bookCondition === "BOTH") return cartItems[0]?.condition || "New";
    throw new Error(`Invalid book condition: ${bookCondition}`);
  };

  const onPaymentSubmit = async (data: FormData) => {
    console.log("Payment details submitted:", data);
    if (cartItems.length === 0) {
      setError("Cart is empty.");
      return;
    }


    const paymentMethod = data.paymentMethod;
    if (!["creditCard", "debitCard", "upi", "cod"].includes(paymentMethod)) {
      setError("Please select a valid payment method.");
      return;
    }

    const paymentTypeMap: { [key: string]: string } = {
      creditCard: "Credit Card",
      debitCard: "Debit Card",
      upi: "UPI",
      cod: "Cash on Delivery",
    };
    const paymentType = paymentTypeMap[paymentMethod] || "Cash on Delivery";

    try {
      const response = await fetch(`http://localhost:5000/api/book-categories/School-Books/${cartItems[0]._id}`);
      if (!response.ok) throw new Error("Failed to fetch book details");
      const book = await response.json();
      if (cartItems[0].condition === "New" && book.quantityNew < cartItems[0].quantity) {
        setError(`Insufficient new stock. Only ${book.quantityNew} available.`);
        return;
      }
      if (cartItems[0].condition === "Old" && book.quantityOld < cartItems[0].quantity) {
        setError(`Insufficient old stock. Only ${book.quantityOld} available.`);
        return;
      }
    } catch (err) {
      console.error("Error checking stock:", err);
      setError("Failed to verify stock availability. Please try again.");
      return;
    }

    try {
      const orderCondition = mapConditionToOrderSchema(cartItems[0].condition);
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
        paymentType,
        quantity: cartItems[0].quantity || 1,
        price: getTotal(),
        status: "Shipped",
        condition: orderCondition,
        bookId: cartItems[0]._id,
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to place order: HTTP ${response.status}`);
      }
      const newOrder = await response.json();
      console.log("Order placed:", newOrder);
      localStorage.removeItem("cart");
      setCartItems([]);
      setShowPaymentForm(false);
      router.push("/orders");
    } catch (err: any) {
      console.error("Error placing order:", err.message);
      setError(err.message || "Failed to place order. Please try again.");
    }
  };

  const handleUpiVerify = () => {
    const upiId = watch("upiId");
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
                  key={item._id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      {item.condition === "Old" && item.discountedPrice > 0 ? (
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
                  <div>
                    <select
                      {...register("paymentMethod", { required: "Payment method is required" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="" disabled>
                        Select Payment Method
                      </option>
                      <option value="creditCard">Credit Card</option>
                      <option value="debitCard">Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="cod Holycow">Cash on Delivery</option>
                    </select>
                    {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                  </div>
                  {(watch("paymentMethod") === "creditCard" || watch("paymentMethod") === "debitCard") && (
                    <>
                      <input
                        type="text"
                        {...register("cardNumber", { required: "Card number is required" })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
                      <input
                        type="text"
                        {...register("cardholderName", { required: "Cardholder name is required" })}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.cardholderName && <p className="text-red-500 text-sm">{errors.cardholderName.message}</p>}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            {...register("cvv", { required: "CVV is required" })}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            {...register("expiryDate", { required: "Expiry date is required" })}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
                        </div>
                      </div>
                    </>
                  )}
                  {watch("paymentMethod") === "upi" && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        {...register("upiId", { required: "UPI ID is required" })}
                        placeholder="example@upi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId.message}</p>}
                      <button
                        type="button"
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