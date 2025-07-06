"use client";

import type { EmailLog } from "../page";

type EmailLogListProps = {
  logs: EmailLog[];
};

export default function EmailLogList({ logs }: EmailLogListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border-b py-2">
            <div className="flex justify-between">
              <span>
                <strong>{log.subject}</strong> (To: {log.to.join(", ")})
                <br />
                <span className={`text-sm ${log.status === "failed" ? "text-red-500" : log.status === "sent" ? "text-green-500" : "text-yellow-500"}`}>
                  Status: {log.status}
                </span>
                {log.error && <p className="text-xs text-red-500">Error: {log.error}</p>}
                <p className="text-xs text-gray-500">Sent at: {new Date(log.sentAt).toLocaleString()}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}