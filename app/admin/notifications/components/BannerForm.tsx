"use client";

import { useState } from "react";
import { API_BASE_URL } from '../../../../utils/api';

interface BannerFormProps {
  onAddBanner: (banner: { id: string; message: string; startTime: string; endTime: string; isActive: boolean }) => void;
}

export default function BannerForm({ onAddBanner }: BannerFormProps) {
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({ message: "", startTime: "", endTime: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { message: "", startTime: "", endTime: "" };

    if (!message.trim()) {
      newErrors.message = "Message is required";
      hasErrors = true;
    }
    if (!startTime) {
      newErrors.startTime = "Start time is required";
      hasErrors = true;
    }
    if (!endTime) {
      newErrors.endTime = "End time is required";
      hasErrors = true;
    } else if (new Date(endTime) <= new Date(startTime)) {
      newErrors.endTime = "End time must be after start time";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      const newBanner = {
        id: Date.now().toString(),
        message,
        startTime,
        endTime,
        isActive,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/banner`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBanner),
        });
        if (!response.ok) throw new Error("Failed to add banner");
        const savedBanner = await response.json();
        onAddBanner({ ...savedBanner, id: savedBanner._id || newBanner.id });
        setMessage("");
        setStartTime("");
        setEndTime("");
        setIsActive(true);
      } catch (error) {
        console.error("Error adding banner:", error);
      }
    }
  };

  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Add New Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Banner Message"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
        <div>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
        </div>
        <div>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          <label>Active</label>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Add Banner
        </button>
      </form>
    </div>
  );
}