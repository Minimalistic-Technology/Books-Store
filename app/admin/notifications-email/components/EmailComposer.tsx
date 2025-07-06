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
    <div className="fixed inset-0 bg-[#fff3cd] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto" style={{ maxHeight: "80vh" }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Compose Email</h2>
        <form onSubmit={handleSubmitEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-y"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Add New Subscriber</h3>
          <form onSubmit={handleAddNewSubscriber} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newSubscriber.name}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Subscriber
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}