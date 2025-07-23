// app/admin/notifications-email/page.tsx
"use client";

import { useState } from "react";
import SubscriberList from "./components/SubscriberList";
import EmailComposer from "./components/EmailComposer";
import NotificationSettings from "./components/NotificationSettings";

// Define interfaces
export interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string; // ISO date string
  isActive: boolean;
}

export default function NotificationsEmailManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: "1", email: "john.doe@example.com", name: "John Doe", subscribedAt: new Date().toISOString(), isActive: true },
    { id: "2", email: "jane.smith@example.com", name: "Jane Smith", subscribedAt: new Date().toISOString(), isActive: false },
  ]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setSubscribers((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, isActive: !sub.isActive } : sub))
    );
  };

  const handleAddSubscriber = (newSubscriber: Subscriber) => {
    setSubscribers((prev) => [...prev, { ...newSubscriber, id: Date.now().toString() }]);
  };

  const handleSendEmail = (subject: string, body: string) => {
    console.log("Email sent:", { subject, body, to: subscribers.filter((s) => s.isActive).map((s) => s.email) });
    alert("Email composition completed (API integration pending)");
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-extrabold text-yellow-900">Notifications & Email Management - Books Store</h1>
      <div className="flex justify-end">
        <button
          onClick={() => setIsEmailComposerOpen(true)}
          className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
        >
          Compose Email
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subscriber List</h2>
          <SubscriberList
            subscribers={subscribers}
            onDelete={handleDeleteSubscriber}
            onToggleActive={handleToggleActive}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
          <NotificationSettings />
        </div>
      </div>
      {isEmailComposerOpen && (
        <EmailComposer
          onClose={() => setIsEmailComposerOpen(false)}
          onSend={handleSendEmail}
          onAddSubscriber={handleAddSubscriber}
        />
      )}
    </div>
  );
}