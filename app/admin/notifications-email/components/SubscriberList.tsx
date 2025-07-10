// components/SubscriberList.tsx
"use client";

import type { Subscriber } from "../page";

type SubscriberListProps = {
  subscribers: Subscriber[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
};

export default function SubscriberList({ subscribers, onDelete, onToggleActive }: SubscriberListProps) {
  return (
    <div className="card p-6 overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-3">
        {subscribers.map((sub) => (
          <li key={sub.id} className="border-b py-3 flex justify-between items-center animate__fadeIn">
            <span className="text-gray-800">
              {sub.name} ({sub.email}) {sub.isActive ? "(Active)" : "(Inactive)"}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onToggleActive(sub.id)}
                className={`px-3 py-1 rounded ${
                  sub.isActive ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-500 hover:bg-gray-600"
                } text-white transition-all`}
              >
                {sub.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(sub.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}