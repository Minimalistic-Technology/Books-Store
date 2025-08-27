"use client";

import type { Subscriber } from "../page";

type SubscriberListProps = {
  subscribers: Subscriber[];
  onDelete: (id: string) => void;
};

export default function SubscriberList({ subscribers, onDelete }: SubscriberListProps) {
  return (
    <div className="card p-6 overflow-y-auto" style={{ maxHeight: "400px" }}>
      <ul className="space-y-3">
        {subscribers.map((sub) => (
          <li key={sub.id} className="border-b py-3 flex md:flex-row flex-col gap-2 md:gap-0 justify-between items-center animate__fadeIn">
            <span className="text-gray-800">
              {sub.name} ({sub.email}) - Subscribed: {new Date(sub.createdAt).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
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