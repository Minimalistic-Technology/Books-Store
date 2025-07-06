"use client";

import { createContext, useContext, useEffect, useState } from "react";
import MetricsCard from "./components/MetricsCard";
import ChartComponent from "./components/ChartComponent";

// Create Context
const DashboardContext = createContext<{
  isLoggedIn: boolean;
  handleLogout: () => void;
}>({
  isLoggedIn: false,
  handleLogout: () => {},
});

export { DashboardContext };

// Custom hook to use the context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardContext.Provider");
  }
  return context;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    userCount: 0,
    sales: 0,
    activeUsers: 0,
  });
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage once
    return localStorage.getItem("isLoggedIn") === "true" || false;
  });

  useEffect(() => {
    // Generate random data on mount
    const generateRandomData = () => {
      const randomUserCount = Math.floor(Math.random() * 1000) + 100; // 100 to 1099
      const randomSales = Math.floor(Math.random() * 10000) + 1000; // 1000 to 10999
      const randomActiveUsers = Math.floor(Math.random() * 200) + 50; // 50 to 249

      setMetrics({
        userCount: randomUserCount,
        sales: randomSales,
        activeUsers: randomActiveUsers,
      });

      const labels = Array.from({ length: 31 }, (_, i) => `Jul ${i + 1}`);
      const salesTrend = Array.from({ length: 31 }, () =>
        Math.floor(Math.random() * 200) + 10
      ); // 10 to 209
      const activeUsersTrend = Array.from({ length: 31 }, () =>
        Math.floor(Math.random() * 200) + 50
      ); // 50 to 249

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

    generateRandomData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  return (
    <DashboardContext.Provider value={{ isLoggedIn, handleLogout }}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard - Books Store</h1>
        {!isLoggedIn ? (
          <div className="bg-blue-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricsCard title="User Count" value={metrics.userCount} />
              <MetricsCard title="Sales" value={metrics.sales} />
              <MetricsCard title="Active Users" value={metrics.activeUsers} />
            </div>
            <div className="bg-blue-200 p-4 rounded-lg shadow" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <h2 className="text-xl font-semibold">Daily/Monthly Trends</h2>
              <div style={{ height: "300px" }}>
                <ChartComponent data={chartData} />
              </div>
            </div>
            <div className="bg-blue-200 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Quick Links to Major Modules</h2>
              <ul className="list-disc pl-5">
                <li><a href="/admin/content-management" className="text-blue-500 hover:underline">Content Management</a></li>
                <li>
                  <a
                    href="/admin/order-product-management"
                    className="text-blue-500 cursor-not-allowed pointer-events-none"
                    onClick={(e) => e.preventDefault()}
                    aria-disabled="true"
                    tabIndex={-1}
                  >
                    Order Management
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-right">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardContext.Provider>
  );
}