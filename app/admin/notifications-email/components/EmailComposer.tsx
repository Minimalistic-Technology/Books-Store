"use client";

import { useState } from "react";
import type { Subscriber } from "../page";


type EmailComposerProps = {
  onClose: () => void;
  onSend: (emailData: { subject: string; body: string; recipients: string[] }) => void;
  onAddSubscriber: (subscriber: { name: string; email: string }) => void;
  subscribers: Subscriber[];
};

export default function EmailComposer({ onClose, onSend, onAddSubscriber, subscribers }: EmailComposerProps) {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    selectedSubscribers: [] as string[],
  });
  const [newSubscriber, setNewSubscriber] = useState({ email: "", name: "" });

  const handleSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.selectedSubscribers.length === 0) {
      alert("Please select at least one subscriber.");
      return;
    }
    onSend({
      subject: formData.subject,
      body: `From Harsh Bookstore:\n\n${formData.body}\n\nVisit us at https://harshbookstore.com`,
      recipients: formData.selectedSubscribers,
    });
    setFormData({ subject: "", body: "", selectedSubscribers: [] });
    onClose();
  };

  const handleAddNewSubscriber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newSubscriber.name || !newSubscriber.email) {
      alert("Name and email are required for new subscriber.");
      return;
    }
    onAddSubscriber({ name: newSubscriber.name, email: newSubscriber.email });
    setNewSubscriber({ email: "", name: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubscriberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setFormData((prev) => ({ ...prev, selectedSubscribers: selectedOptions }));
  };

  const handleSelectAll = () => {
    const allSubscriberEmails = subscribers.map((sub) => sub.email);
    setFormData((prev) => ({ ...prev, selectedSubscribers: allSubscriberEmails }));
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
      <div className="card w-full max-w-lg overflow-y-auto" style={{ maxHeight: "80vh" }}>
        <h2 className="text-2xl font-bold mb-4 text-yellow-900 animate__bounceIn">Compose Email</h2>
        <form onSubmit={handleSubmitEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscribers</label>
            <div className="flex space-x-2">
              <select
                name="selectedSubscribers"
                multiple
                value={formData.selectedSubscribers}
                onChange={handleSubscriberChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {subscribers.map((sub) => (
                  <option key={sub.id} value={sub.email}>
                    {sub.name} ({sub.email})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSelectAll}
                className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
              >
                Select All
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-48 resize-y"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Send
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Add New Subscriber</h3>
          <form onSubmit={handleAddNewSubscriber} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newSubscriber.name}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            >
              Add Subscriber
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}