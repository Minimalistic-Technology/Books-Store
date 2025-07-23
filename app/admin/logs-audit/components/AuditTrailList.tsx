// components/AuditTrailList.tsx
"use client";

import type { AuditTrail } from "../page";

type AuditTrailListProps = {
  logs: AuditTrail[];
};

export default function AuditTrailList({ logs }: AuditTrailListProps) {
  return (
    <div className="card overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="border-b py-3 animate__fadeIn">
            <div className="flex justify-between items-start">
              <span className="text-gray-800">
                <strong className="text-lg">{log.action}</strong> by{" "}
                <span className="text-teal-600">{log.user}</span>
                <p className="text-xs text-gray-500 mt-1">Time: {new Date(log.timestamp).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Details: {log.details}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}