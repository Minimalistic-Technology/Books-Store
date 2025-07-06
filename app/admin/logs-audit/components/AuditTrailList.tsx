"use client";

import type { AuditTrail } from "../page";

type AuditTrailListProps = {
  logs: AuditTrail[];
};

export default function AuditTrailList({ logs }: AuditTrailListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border-b py-2">
            <div className="flex justify-between">
              <span>
                <strong>{log.action}</strong> by {log.user}
                <p className="text-xs text-gray-500">Time: {new Date(log.timestamp).toLocaleString()}</p>
                <p className="text-xs text-gray-600">Details: {log.details}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}