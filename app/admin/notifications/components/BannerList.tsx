"use client";

import { useEffect, useState } from "react";
import { Banner } from "../page";

type BannerListProps = {
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
};

export default function BannerList({ banners, onUpdateBanners }: BannerListProps) {
  // Local state to avoid direct mutation in useEffect
  const [localBanners, setLocalBanners] = useState(banners);

  useEffect(() => {
    // Update localBanners when props.banners change
    setLocalBanners(banners);
  }, [banners]); // Depend on banners to sync with props

  useEffect(() => {
    // Check active status once on mount or when localBanners change
    const updatedBanners = localBanners.map(banner => ({
      ...banner,
      isActive: new Date(banner.startTime) <= new Date() && new Date(banner.endTime) >= new Date(),
    }));
    if (JSON.stringify(updatedBanners) !== JSON.stringify(localBanners)) {
      setLocalBanners(updatedBanners);
      onUpdateBanners(updatedBanners); // Update parent only if changed
    }
  }, [localBanners, onUpdateBanners]); // Depend on localBanners and onUpdateBanners

  return (
    <div className="bg-blue-200 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Active Banners</h2>
      {localBanners.length === 0 ? (
        <p className="text-gray-500">No banners created yet.</p>
      ) : (
        <ul className="space-y-4">
          {localBanners.map((banner) => (
            <li key={banner.id} className="border p-4 rounded-lg">
              <p className="font-medium">{banner.message}</p>
              <p className="text-sm text-gray-600">
                Active: {banner.isActive ? "Yes" : "No"} (Start: {banner.startTime}, End: {banner.endTime})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}