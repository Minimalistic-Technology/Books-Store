"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension?: number;
    }[];
  };
}

export default function ChartComponent({ data }: ChartComponentProps) {
  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Daily & Monthly Trends" },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Value" } },
          x: { title: { display: true, text: "Date" } },
        },
      }}
    />
  );
}