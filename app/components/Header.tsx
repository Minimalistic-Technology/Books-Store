"use client";

import { useEffect, useState } from "react";
import { Banner } from "../admin/notifications/page";

export default function Header() {
  const [activeBanners, setActiveBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Simulate fetching banners from a global state or API
    const fetchBanners = async () => {
      // For now, use a mock (replace with real API call later)
      const mockBanners: Banner[] = [
        { id: "1", message: "Welcome to our Summer Sale!", startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), isActive: true },
      ];
      setActiveBanners(mockBanners.filter(b => b.isActive));
    };
    fetchBanners();

    // Update banners periodically (e.g., every minute)
    const interval = setInterval(fetchBanners, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-green-100 p-4 shadow">
      {activeBanners.map((banner) => (
        <div key={banner.id} className="banner" style={{ display: banner.isActive ? "block" : "none" }}>
          {banner.message}
        </div>
      ))}
      <h1 className="text-2xl font-bold">Admin Panel</h1>
    </header>
  );
}