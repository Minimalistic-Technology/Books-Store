"use client";

import type { Subscriber } from "../page";

type SubscriberListProps = {
  subscribers: Subscriber[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
};

export default function SubscriberList({ subscribers, onDelete, onToggleActive }: SubscriberListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <ul className="space-y-2">
        {subscribers.map((sub) => (
          <li key={sub.id} className="border-b py-2 flex justify-between items-center">
            <span>
              {sub.name} ({sub.email}) {sub.isActive ? "(Active)" : "(Inactive)"}
            </span>
            <div>
              <button
                onClick={() => onToggleActive(sub.id)}
                className={`px-2 py-1 rounded mr-2 ${sub.isActive ? "bg-teal-500" : "bg-teal-500"} text-white hover:opacity-80`}
              >
                {sub.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(sub.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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