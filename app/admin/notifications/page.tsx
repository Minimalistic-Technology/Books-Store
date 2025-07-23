// app/admin/notifications/page.tsx
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

  useEffect(() => {
    setBanners([
      { id: "1", message: "Welcome to our Summer Sale!", startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), isActive: true },
    ]);
  }, []);

  const addBanner = (banner: Banner) => {
    setBanners([...banners, { ...banner, id: Date.now().toString(), isActive: true }]);
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-extrabold text-yellow-900">Notifications/Banners - Books Store</h1>
      <div className="space-y-6">
        <BannerForm onAddBanner={addBanner} />
        <BannerList banners={banners} onUpdateBanners={setBanners} />
      </div>
    </div>
  );
}