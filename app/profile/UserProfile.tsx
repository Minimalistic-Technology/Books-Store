"use client";
import React, { useEffect, useState } from "react";
import {
  // User,
  Package,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserIcon,
  Phone,
} from "lucide-react";
import Header from "../components/header/page";
import { useSearchParams } from "next/navigation";

import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { BookRequest, Order } from "../admin/order-product-management/types";
import useCheckIsLoggedIn from "../hooks/useCheckIsLoggedIn";
import Image from "next/image";
// import { User } from "../admin/order-product-management/types";

interface User {
  username: string;
  email: string;
  phone: number;
}

type OrderStatus =
  | "delivered"
  | "approved"
  | "shipped"
  | "processing"
  | "pending"
  | "rejected";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("orders");

  // const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [requestedBooks, setRequestedBooks] = useState<BookRequest[] | null>(
    null
  );

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { isLoggedIn, checking } = useCheckIsLoggedIn(false);

  useEffect(() => {
    if (tabParam === "orders" || tabParam === "requests") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/profile`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/my-orders`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/my-book-requests`, {
            withCredentials: true,
          }),
        ]);

        if (results[0].status === "fulfilled")
          setUser(results[0].value.data.user);
        if (results[1].status === "fulfilled")
          setOrders(results[1].value.data.orders);
        if (results[2].status === "fulfilled")
          setRequestedBooks(results[2].value.data.requests);
      } catch {}
    };

    fetchUserData();
  }, []);

  const formatName = (name: string) => {
    if (!name) return;
    const nameArray = name.split(" ");
    const newNameArray = nameArray.map(
      (word) => word[0].toUpperCase() + word.slice(1)
    );
    return newNameArray.join(" ");
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shipped":
      case "processing":
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
      case "approved":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-yellow-200  rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {formatName(user?.username || "")}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <br />
                <p className="text-gray-600 flex gap-5 ">
                  <Phone className="w-4" />
                  {user?.phone}
                </p>
              </div>

              <div className="space-y-3"></div>

              {/* Navigation */}
              <div className="mt-8 space-y-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-yellow-200 text-black"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="w-5 h-5 inline mr-3" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "requests"
                      ? "bg-yellow-200 text-black"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="w-5 h-5 inline mr-3" />
                  Book Requests
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
      My Orders
    </h3>

    {orders && orders.length > 0 ? (
      orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {/* Header: Status & Price */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {order.bookId?.title || order.title}
              </h4>
              <p className="text-gray-600 text-sm">
                Placed on{" "}
                {new Date(order.date||"").toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Payment: {order.paymentType}
              </p>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status.toLowerCase() as OrderStatus
                )}`}
              >
                {getStatusIcon(order.status.toLowerCase() as OrderStatus)}
                <span className="capitalize">{order.status}</span>
              </div>
              <p className="text-lg font-bold text-gray-800 mt-2">
                Rs. {order.price}
              </p>
            </div>
          </div>

          {/* Book Info */}
          <div className="border-t pt-4 flex space-x-4">
            {order.bookId?.imageUrl && (
              <Image
              width={100}
              height={150}
                src={order.bookId.imageUrl}
                alt={order.bookId.title}
                className="w-24 h-32 object-cover rounded-md"
              />
            )}
            <div>
              <p className="text-gray-800 font-medium">
                Quantity: {order.quantity}
              </p>
              <p className="text-gray-800 font-medium mt-1">
                Condition: {order.condition}
              </p>
              <p className="text-gray-800 font-medium mt-1">
                Customer: {order.customerName}
              </p>
              <p className="text-gray-800 mt-1">
                Mobile: {order.mobileNumber}
              </p>
              <p className="text-gray-800 mt-1">
                Address: {order.address.street}, {order.address.city},{" "}
                {order.address.state}, {order.address.country} -{" "}
                {order.address.pinCode}
              </p>
            </div>
          </div>

          {/* Placed Date */}
          {order.date && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Placed on{" "}
                {new Date(order.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Cancel Reason */}
          {order.cancelReason && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                Reason for cancellation: {order.cancelReason}
              </p>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-center py-8 text-gray-400">No orders yet</p>
    )}
  </div>
)}

            {activeTab === "requests" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                  Book Requests
                </h3>

                {requestedBooks && requestedBooks.length > 0 ? (
                  requestedBooks.map((request) => (
                    <div
                      key={request.bookTitle + request.classLevel}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {request.bookTitle}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {request.classLevel} • {request.author}
                          </p>
                          {/* <p className="text-gray-600">
                            Requested on{" "}
                            <span className=" text-amber-700  text-sm">
                            {new Date(request.createdAt).toLocaleDateString("en-gb",{
                              day:"numeric",
                              month:"long",
                              year:"numeric"
                            })}
                            </span>
                          </p> */}
                        </div>
                        {/* <div className="text-right">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                          {request.price !== "TBD" && (
                            <p className="text-lg font-bold text-gray-800 mt-2">
                              {request.price}
                            </p>
                          )}
                        </div> */}
                      </div>

                      {/* <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-1">
                              Availability:
                            </h5>
                            <p className="text-gray-700 text-sm">
                              {request.availability}
                            </p>
                          </div>
                          {request.reason && (
                            <div>
                              <h5 className="font-medium text-gray-800 mb-1">
                                Reason:
                              </h5>
                              <p className="text-gray-700 text-sm">
                                {request.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div> */}

                      {/* {request.status === "approved" && (
                        <div className="mt-4">
                          <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-400 transition-colors cursor-pointer">
                            Add to Cart
                          </button>

                          
                        </div>
                      )} */}
                    </div>
                  ))
                ) : (
                  <>
                    <p className="text-center py-8 text-gray-400">
                      You have not requested any books yet
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
