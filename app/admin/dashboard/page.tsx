// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import MetricsCard from "./components/MetricsCard";
import ChartComponent from "./components/ChartComponent";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../utils/api";
import DashboardContext from "../context/DashboardContext";


export default function Dashboard() {
  const [metrics, setMetrics] = useState<{
    userCount: number | null;
    orderCount: number | null;
    completedOrders: number | null;
  }>({
    userCount: null,
    orderCount: null,
    completedOrders: null,
  });

  const [loading, setLoading] = useState(true);

  type ChartData = {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
    }[];
  };

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const router = useRouter();
  
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`,{headers:{
          "Content-Type":"application/json",
          
        },credentials:"include"});
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setMetrics((prev) => ({
          ...prev,
          userCount: Array.isArray(data) ? data.length : 0,
        }));
      } catch  {
        
        setMetrics((prev) => ({ ...prev, userCount: 0 }));
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`,{credentials:"include"});
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        const orders = Array.isArray(data.orders) ? data.orders : [];
        const orderCount = orders.length;
        const completedOrders = orders.filter(
          (order: { status?: string }) => order.status === "Delivered"
        ).length;

        setMetrics((prev) => ({
          ...prev,
          orderCount,
          completedOrders,
        }));

        // Dummy chart trend
        const labels = Array.from({ length: 31 }, (_, i) => `Jul ${i + 1}`);
        const orderTrend = Array.from({ length: 31 }, (_, i) =>
          Math.floor((orderCount * (i + 1)) / 31)
        );
        const completedTrend = Array.from({ length: 31 }, (_, i) =>
          Math.floor((completedOrders * (i + 1)) / 31)
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Orders Count Trend",
              data: orderTrend,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Completed Orders Trend",
              data: completedTrend,
              borderColor: "rgb(255, 99, 132)",
              tension: 0.1,
            },
          ],
        });
      } catch  {
        
        setMetrics((prev) => ({ ...prev, orderCount: 0, completedOrders: 0 }));
        setChartData({
          labels: Array.from({ length: 31 }, (_, i) => `Jul ${i + 1}`),
          datasets: [
            {
              label: "Orders Count Trend",
              data: Array(31).fill(0),
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Completed Orders Trend",
              data: Array(31).fill(0),
              borderColor: "rgb(255, 99, 132)",
              tension: 0.1,
            },
          ],
        });
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchOrders()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUserCountClick = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate__fadeIn">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ setMetrics }}>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 animate__fadeIn pt-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-900 text-center sm:text-left">
          Dashboard - Books Store
        </h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsCard
            title="User Count"
            value={metrics.userCount}
            onClick={handleUserCountClick}
          />
          <MetricsCard title="Order Count" value={metrics.orderCount} />
          <MetricsCard
            title="Completed Orders"
            value={metrics.completedOrders}
          />
        </div>

        {/* Chart Section */}
        <div className="card bg-blue-200 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-yellow-900 text-center sm:text-left">
            Daily / Monthly Trends
          </h2>
          <div className="h-64 sm:h-72 lg:h-80">
            <ChartComponent data={chartData} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="card bg-blue-200 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-yellow-900 text-center sm:text-left">
            Quick Links to Major Modules
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-center sm:text-left">
            <li>
              <a
                href="/admin/content-management"
                className="text-teal-500 hover:underline"
              >
                Content Management
              </a>
            </li>
            <li>
              <a
                href="/admin/order-product-management"
                className="text-gray-500 cursor-not-allowed pointer-events-none"
                onClick={(e) => e.preventDefault()}
                aria-disabled="true"
                tabIndex={-1}
              >
                Order Management
              </a>
            </li>
          </ul>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
