// components/BannerList.tsx
"use client";

import { useEffect, useState } from "react";
import { Banner } from "../page";

type BannerListProps = {
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
};

export default function BannerList({ banners, onUpdateBanners }: BannerListProps) {
  const [localBanners, setLocalBanners] = useState(banners);

  useEffect(() => {
    setLocalBanners(banners);
  }, [banners]);

  useEffect(() => {
    const updatedBanners = localBanners.map((banner) => ({
      ...banner,
      isActive: new Date(banner.startTime) <= new Date() && new Date(banner.endTime) >= new Date(),
    }));
    if (JSON.stringify(updatedBanners) !== JSON.stringify(localBanners)) {
      setLocalBanners(updatedBanners);
      onUpdateBanners(updatedBanners);
    }
  }, [localBanners, onUpdateBanners]);

  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Active Banners</h2>
      {localBanners.length === 0 ? (
        <p className="text-gray-500 text-center">No banners created yet.</p>
      ) : (
        <ul className="space-y-4">
          {localBanners.map((banner) => (
            <li key={banner.id} className="border p-4 rounded-lg bg-white shadow-md animate__fadeInUp">
              <p className="font-medium text-lg text-gray-800">{banner.message}</p>
              <p className="text-sm text-gray-600">
                Active: {banner.isActive ? (
                  <span className="text-green-500">Yes</span>
                ) : (
                  <span className="text-red-500">No</span>
                )} (Start: {new Date(banner.startTime).toLocaleString()}, End: {new Date(banner.endTime).toLocaleString()})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}