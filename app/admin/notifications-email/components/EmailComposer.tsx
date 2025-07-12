// components/EmailComposer.tsx
"use client";

import { useState } from "react";
import type { Subscriber } from "../page";

type EmailComposerProps = {
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
  onAddSubscriber: (subscriber: Subscriber) => void;
};

export default function EmailComposer({ onClose, onSend, onAddSubscriber }: EmailComposerProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [newSubscriber, setNewSubscriber] = useState({ email: "", name: "", subscribedAt: "", isActive: true });

  const handleSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend(subject, body);
    setSubject("");
    setBody("");
    onClose();
  };

  const handleAddNewSubscriber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddSubscriber({ ...newSubscriber, id: crypto.randomUUID(), subscribedAt: new Date().toISOString() });
    setNewSubscriber({ email: "", name: "", subscribedAt: "", isActive: true });
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
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
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