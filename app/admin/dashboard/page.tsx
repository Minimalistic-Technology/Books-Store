"use client";

import { createContext, useContext, useEffect, useState } from "react";
import MetricsCard from "./components/MetricsCard";
import ChartComponent from "./components/ChartComponent";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '../../../utils/api';

// Create Context
const DashboardContext = createContext<{
  setMetrics: React.Dispatch<
    React.SetStateAction<{
      userCount: number | null;
      sales: number | null;
      activeUsers: number | null;
    }>
  >;
}>({
  setMetrics: () => {},
});

export { DashboardContext };

// Custom hook to use the context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboard must be used within a DashboardContext.Provider"
    );
  }
  return context;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<{
    userCount: number | null;
    sales: number | null;
    activeUsers: number | null;
  }>({
    userCount: null,
    sales: null,
    activeUsers: null,
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
        const response = await fetch(`${API_BASE_URL}/registered-users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setMetrics((prev) => ({
          ...prev,
          userCount: Array.isArray(data) ? data.length : 0,
        }));
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setMetrics((prev) => ({ ...prev, userCount: 0 }));
      }
    };

    const generateRandomData = () => {
      const randomSales = Math.floor(Math.random() * 10000) + 1000;
      const randomActiveUsers = Math.floor(Math.random() * 200) + 50;

      setMetrics((prev) => ({
        ...prev,
        sales: randomSales,
        activeUsers: randomActiveUsers,
      }));

      const labels = Array.from({ length: 31 }, (_, i) => `Jul ${i + 1}`);
      const salesTrend = Array.from(
        { length: 31 },
        () => Math.floor(Math.random() * 200) + 10
      );
      const activeUsersTrend = Array.from(
        { length: 31 },
        () => Math.floor(Math.random() * 200) + 50
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Sales Trend",
            data: salesTrend,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Active Users Trend",
            data: activeUsersTrend,
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      });
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchUsers();
      generateRandomData();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUserCountClick = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return (
      <div className="space-y-8 p-4 animate__fadeIn">
        <p className="text-gray-500 text-center">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ setMetrics }}>
      <div className="space-y-8 p-4 animate__fadeIn">
        <h1 className="text-4xl font-bold text-yellow-900">
          Dashboard - Books Store
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard
            title="User Count"
            value={metrics.userCount}
            onClick={handleUserCountClick}
          />
          <MetricsCard title="Sales" value={metrics.sales} />
          <MetricsCard title="Active Users" value={metrics.activeUsers} />
        </div>
        <div
          className="card bg-blue-200 p-6 rounded-lg shadow-lg"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
            Daily/Monthly Trends
          </h2>
          <div style={{ height: "300px" }}>
            <ChartComponent data={chartData} />
          </div>
        </div>
        <div className="card bg-blue-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-900">
            Quick Links to Major Modules
          </h2>
          <ul className="list-disc pl-5 space-y-2">
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