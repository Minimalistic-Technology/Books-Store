"use client";

import { useState, useEffect } from "react";
import BannerForm from "./components/BannerForm";
import BannerList from "./components/BannerList";

export interface Banner {
  id: string;
  message: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  isActive: boolean;
}

export default function Notifications() {
  const [banners, setBanners] = useState<Banner[]>([]);

  // Initialize banners with dynamic dates on client side to avoid hydration mismatch
  useEffect(() => {
    setBanners([
      { id: "1", message: "Welcome to our Summer Sale!", startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), isActive: true },
    ]);
  }, []); // Empty dependency array ensures this runs once on client mount

  const addBanner = (banner: Banner) => {
    setBanners([...banners, { ...banner, id: Date.now().toString(), isActive: true }]);
  };

  return (
    <div className="space-y-6 w-full h-full">
      <h1 className="text-3xl font-bold">Notifications/Banners - Books Store</h1>
      <BannerForm onAddBanner={addBanner} />
      <BannerList banners={banners} onUpdateBanners={setBanners} />
    </div>
  );
}