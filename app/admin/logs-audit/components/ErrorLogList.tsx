"use client";

import type { ErrorLog } from "../page";

type ErrorLogListProps = {
  logs: ErrorLog[];
};

export default function ErrorLogList({ logs }: ErrorLogListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border-b py-2">
            <div className="flex justify-between">
              <span>
                <strong>{log.message}</strong>
                <p className={`text-sm ${log.severity === "high" ? "text-red-500" : log.severity === "medium" ? "text-yellow-500" : "text-gray-500"}`}>
                  Severity: {log.severity}
                </p>
                <p className="text-xs text-gray-600">Time: {new Date(log.timestamp).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Stack Trace: {log.stackTrace}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}