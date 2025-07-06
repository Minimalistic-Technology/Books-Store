"use client";

import { useState } from "react";
import { SiteSettings } from "../page";

type SiteSettingsFormProps = {
  settings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
};

export default function SiteSettingsForm({ settings, onSave }: SiteSettingsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      logo: file ? URL.createObjectURL(file) : prev.logo,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false); // Exit edit mode after saving
  };

  const handleCancel = () => {
    setFormData({ ...settings }); // Reset to original settings
    setIsEditing(false); // Exit edit mode
  };

  // View mode (read-only)
  if (!isEditing) {
    return (
      <div className="bg-blue-200 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Site Settings</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Edit
          </button>
        </div>
        <div className="space-y-6">
          {/* Logo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            {settings.logo && (
              <img src={settings.logo} alt="Logo Preview" className="mt-2 h-20 w-auto rounded" />
            )}
            {!settings.logo && <p className="mt-2 text-gray-500">No logo uploaded</p>}
          </div>

          {/* Title and Meta Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Title</label>
            <p className="mt-1 p-2 bg-blue-200 border border-gray-300 rounded-lg">{settings.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <p className="mt-1 p-2 bg-blue-200 border border-gray-300 rounded-lg h-20 resize-y overflow-auto">
              {settings.metaDescription}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
            <p className="mt-1 p-2 bg-blue-200 border border-gray-300 rounded-lg">{settings.metaKeywords}</p>
          </div>

          {/* API Keys and Maintenance Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <p className="mt-1 p-2 bg-blue-200 border border-gray-300 rounded-lg">{settings.apiKey || "Not set"}</p>
          </div>
          <div className="flex items-center">
            <span className="mr-2 h-5 w-5 border-2 border-gray-300 rounded flex items-center justify-center">
              {settings.maintenanceMode ? "✓" : ""}
            </span>
            <label className="text-sm text-gray-700">Maintenance Mode</label>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode (form)
  return (
    <div className="bg-blue-200 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Configure Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          {formData.logo && (
            <img src={formData.logo} alt="Logo Preview" className="mt-2 h-20 w-auto rounded" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Title and Meta Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-y"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* API Keys and Maintenance Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="text"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={formData.maintenanceMode}
            onChange={handleChange}
            className="mr-2 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">Enable Maintenance Mode</label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}