"use client";
import { useState } from "react";


export default function NotificationSettings() {
    const [pushEnabled, setPushEnabled] = useState(false);
    const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

    const handleTogglePush = () => setPushEnabled(!pushEnabled);
    const handleToggleEmailAlerts = () => setEmailAlertsEnabled(!emailAlertsEnabled);

    return (
        <div className="bg-blue-200 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={handleTogglePush}
                        className="mr-2 accent-blue-500"
                    />
                    <label className="text-sm text-gray-700">Enable Push Notifications</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={emailAlertsEnabled}
                        onChange={handleToggleEmailAlerts}
                        className="mr-2 accent-blue-500"
                    />
                    <label className="text-sm text-gray-700">Enable Email Alerts</label>
                </div>
                
            </div>
        </div>
    );
}

