"use client";

import React from "react";

interface MetricsCardProps {
  title: string;
  value: number | undefined | null; 
  onClick?: () => void;
}

export default function MetricsCard({ title, value, onClick }: MetricsCardProps) {
  return (
    <div
      className="card bg-blue-200 p-5 rounded-lg shadow-lg hover:bg-blue-300 transition-all duration-300 animate__fadeInUp cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-yellow-900">
        {typeof value === "number" ? value.toLocaleString() : "N/A"}
      </p>
    </div>
  );
}