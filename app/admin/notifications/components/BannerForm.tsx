"use client";

import { useState } from "react";
import { Banner } from "../page";

type BannerFormProps = {
  onAddBanner: (banner: Banner) => void;
};

export default function BannerForm({ onAddBanner }: BannerFormProps) {
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && startTime && endTime && new Date(startTime) < new Date(endTime)) {
      onAddBanner({ message, startTime, endTime, id: "", isActive: true });
      setMessage("");
      setStartTime(new Date().toISOString().slice(0, 16));
      setEndTime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    } else {
      alert("Please fill all fields and ensure end time is after start time.");
    }
  };

  return (
    <div className="bg-blue-200 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter banner message..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Banner
        </button>
      </form>
    </div>
  );
}