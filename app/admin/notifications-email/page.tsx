
"use client";

import { useState, useEffect } from "react";
import SubscriberList from "./components/SubscriberList";
import EmailComposer from "./components/EmailComposer";
import {API_BASE_URL} from '../../../utils/api'

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  createdAt: string; 
}

export interface EmailLog {
  id: string;
  subject: string;
  recipients: string[];
  status: "success" | "failed";
  timestamp: string;
  error?: string;
}

export default function NotificationsEmailManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subscribers`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const mappedSubscribers = data.map((sub: any) => ({
          id: sub._id,
          email: sub.email,
          name: sub.name,
          createdAt: sub.createdAt,
        }));
        setSubscribers(mappedSubscribers);
      } catch (error: any) {
        console.error("Failed to fetch subscribers:", error);
        alert(`Failed to fetch subscribers: ${error.message}`);
      }
    };

    const fetchEmailLogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/email-logs`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const logs = await response.json();
        setEmailLogs(logs);
      } catch (error: any) {
        console.error("Failed to fetch email logs:", error);
        alert(`Failed to fetch email logs: ${error.message}`);
      }
    };

    fetchSubscribers();
    fetchEmailLogs();
  }, []);

  const handleDeleteSubscriber = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
      alert("Subscriber deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete subscriber:", error);
      alert(`Failed to delete subscriber: ${error.message}`);
    }
  };

  const handleAddSubscriber = async (newSubscriber: { name: string; email: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribers/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubscriber.name,
          email: newSubscriber.email,
          subject: "Welcome to Harsh Bookstore!",
          body: `Dear ${newSubscriber.name},\n\nThank you for subscribing to Harsh Bookstore! Stay tuned for updates, promotions, and events.\n\nBest regards,\nHarsh Bookstore Team`,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const subscribersResponse = await fetch(`${API_BASE_URL}/subscribers`);
      if (subscribersResponse.ok) {
        const updatedSubscribers = await subscribersResponse.json();
        setSubscribers(
          updatedSubscribers.map((sub: any) => ({
            id: sub._id,
            email: sub.email,
            name: sub.name,
            createdAt: sub.createdAt,
          }))
        );
      }
      alert("Subscriber added and welcome email sent!");
    } catch (error: any) {
      console.error("Failed to add subscriber:", error);
      alert(`Failed to add subscriber: ${error.message}`);
    }
  };

  const handleSendEmail = async (emailData: { subject: string; body: string; recipients: string[] }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const logsResponse = await fetch(`${API_BASE_URL}/email-logs`);
      if (logsResponse.ok) {
        const logs = await logsResponse.json();
        setEmailLogs(logs);
      }
      alert("Emails sent successfully!");
    } catch (error: any) {
      console.error("Failed to send emails:", error);
      alert(`Failed to send emails: ${error.message}`);
    }
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
          <SubscriberList subscribers={subscribers} onDelete={handleDeleteSubscriber} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Email Logs</h2>
          {emailLogs.length === 0 ? (
            <p className="text-gray-600">No email logs available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Timestamp</th>
                    <th className="border px-4 py-2 text-left">Subject</th>
                    <th className="border px-4 py-2 text-left">Recipients</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="border px-4 py-2">{log.subject}</td>
                      <td className="border px-4 py-2">{log.recipients.join(", ")}</td>
                      <td className="border px-4 py-2">
                        <span className={`${log.status === "success" ? "text-green-600" : "text-red-600"} font-semibold`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">{log.error || log.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {isEmailComposerOpen && (
        <EmailComposer
          onClose={() => setIsEmailComposerOpen(false)}
          onSend={handleSendEmail}
          onAddSubscriber={handleAddSubscriber}
          subscribers={subscribers}
        />
      )}
    </div>
  );
}