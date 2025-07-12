"use client";

import { Banner } from "../page";

interface BannerListProps {
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
}

export default function BannerList({ banners, onUpdateBanners }: BannerListProps) {
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const updatedBanners = banners.map((banner) =>
      banner.id === id ? { ...banner, isActive: !currentActive } : banner
    );
    onUpdateBanners(updatedBanners);

    try {
      await fetch(`http://localhost:5000/api/bookstore/bannerRoutes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
    } catch (error) {
      console.error("Error updating banner status:", error);
      onUpdateBanners(banners); // Revert on failure
    }
  };

  const handleDelete = async (id: string) => {
    const updatedBanners = banners.filter((banner) => banner.id !== id);
    onUpdateBanners(updatedBanners);

    try {
      await fetch(`http://localhost:5000/api/bookstore/bannerRoutes/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
      onUpdateBanners(banners); // Revert on failure
    }
  };

  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Banner List</h2>
      <ul className="space-y-4">
        {banners.map((banner) => (
          <li key={banner.id} className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center">
            <div>
              <p className="text-gray-800">{banner.message}</p>
              <p className="text-sm text-gray-600">
                {new Date(banner.startTime).toLocaleString()} - {new Date(banner.endTime).toLocaleString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleToggleActive(banner.id, banner.isActive)}
                className={`px-3 py-1 rounded ${banner.isActive ? "bg-red-500" : "bg-green-500"} text-white`}
              >
                {banner.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}