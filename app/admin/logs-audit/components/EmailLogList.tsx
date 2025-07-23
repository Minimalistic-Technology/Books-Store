// components/EmailLogList.tsx
"use client";

import type { EmailLog } from "../page";

type EmailLogListProps = {
  logs: EmailLog[];
};

export default function EmailLogList({ logs }: EmailLogListProps) {
  return (
    <div className="card overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="border-b py-3 animate__fadeIn">
            <div className="flex justify-between items-start">
              <span className="text-gray-800">
                <strong className="text-lg">{log.subject}</strong> (To: {log.to.join(", ")})
                <br />
                <span
                  className={`text-sm ${
                    log.status === "failed"
                      ? "text-red-500"
                      : log.status === "sent"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  Status: {log.status}
                </span>
                {log.error && <p className="text-sm text-red-500 mt-1">Error: {log.error}</p>}
                <p className="text-xs text-gray-500 mt-1">Sent at: {new Date(log.sentAt).toLocaleString()}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}