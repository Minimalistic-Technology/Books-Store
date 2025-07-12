// app/admin/dashboard/page.tsx
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
    return localStorage.getItem("isLoggedIn") === "true" || false;
  });

  useEffect(() => {
    const generateRandomData = () => {
      const randomUserCount = Math.floor(Math.random() * 1000) + 100;
      const randomSales = Math.floor(Math.random() * 10000) + 1000;
      const randomActiveUsers = Math.floor(Math.random() * 200) + 50;

      setMetrics({
        userCount: randomUserCount,
        sales: randomSales,
        activeUsers: randomActiveUsers,
      });

      const labels = Array.from({ length: 31 }, (_, i) => `Jul ${i + 1}`);
      const salesTrend = Array.from({ length: 31 }, () =>
        Math.floor(Math.random() * 200) + 10
      );
      const activeUsersTrend = Array.from({ length: 31 }, () =>
        Math.floor(Math.random() * 200) + 50
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

    generateRandomData();
  }, []);

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
      <div className="space-y-8 p-4 animate__fadeIn">
        <h1 className="text-4xl font-bold text-yellow-900">Dashboard - Books Store</h1>
        {!isLoggedIn ? (
          <div className="card bg-blue-200 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Login</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricsCard title="User Count" value={metrics.userCount} />
              <MetricsCard title="Sales" value={metrics.sales} />
              <MetricsCard title="Active Users" value={metrics.activeUsers} />
            </div>
            <div className="card bg-blue-200 p-6 rounded-lg shadow-lg" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Daily/Monthly Trends</h2>
              <div style={{ height: "300px" }}>
                <ChartComponent data={chartData} />
              </div>
            </div>
            <div className="card bg-blue-200 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Quick Links to Major Modules</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><a href="/admin/content-management" className="text-teal-500 hover:underline">Content Management</a></li>
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
            <div className="text-right">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
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