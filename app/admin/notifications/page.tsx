"use client";

import { useState, useEffect } from "react";
import BannerForm from "./components/BannerForm";
import BannerList from "./components/BannerList";
import { API_BASE_URL } from '../../../utils/api';

export interface Banner {
  id: string;
  message: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function Notifications() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banner`);
        const data = await response.json();
        setBanners(data.map((item: any) => ({
          id: item._id,
          message: item.message,
          startTime: item.startTime,
          endTime: item.endTime,
          isActive: item.isActive,
        })));
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  const addBanner = (banner: Banner) => {
    setBanners([...banners, banner]);
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