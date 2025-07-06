"use client";

import React from "react";

interface MetricsCardProps {
  title: string;
  value: number;
}

export default function MetricsCard({ title, value }: MetricsCardProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow hover:bg-blue-300 transition-colors duration-200">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}