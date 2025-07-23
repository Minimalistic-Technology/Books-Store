// components/ErrorLogList.tsx
"use client";

import type { ErrorLog } from "../page";

type ErrorLogListProps = {
  logs: ErrorLog[];
};

export default function ErrorLogList({ logs }: ErrorLogListProps) {
  return (
    <div className="card overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="border-b py-3 animate__fadeIn">
            <div className="flex justify-between items-start">
              <span className="text-gray-800">
                <strong className="text-lg">{log.message}</strong>
                <p
                  className={`text-sm ${
                    log.severity === "high"
                      ? "text-red-500"
                      : log.severity === "medium"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                >
                  Severity: {log.severity}
                </p>
                <p className="text-xs text-gray-500 mt-1">Time: {new Date(log.timestamp).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Stack Trace: {log.stackTrace}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}