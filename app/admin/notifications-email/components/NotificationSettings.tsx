// components/NotificationSettings.tsx
"use client";

import { useState } from "react";

export default function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  const handleTogglePush = () => setPushEnabled(!pushEnabled);
  const handleToggleEmailAlerts = () => setEmailAlertsEnabled(!emailAlertsEnabled);

  return (
    <div className="card p-6 animate__fadeIn">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Notification Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={handleTogglePush}
            className="w-5 h-5 accent-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-teal-500 transition-all"
          />
          <label className="ml-3 text-sm text-gray-700">Enable Push Notifications</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={emailAlertsEnabled}
            onChange={handleToggleEmailAlerts}
            className="w-5 h-5 accent-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-teal-500 transition-all"
          />
          <label className="ml-3 text-sm text-gray-700">Enable Email Alerts</label>
        </div>
      </div>
    </div>
  );
}