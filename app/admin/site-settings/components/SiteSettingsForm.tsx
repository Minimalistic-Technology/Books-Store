"use client";

import { useState } from "react";
import { SiteSettings } from "../page";
import Image from "next/image";

type SiteSettingsFormProps = {
  settings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
  saving: boolean; // Added to handle save state
};

export default function SiteSettingsForm({ settings, onSave, saving }: SiteSettingsFormProps) {
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: reader.result as string, // Convert to base64 for API
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...settings });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="card p-6 animate__fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-yellow-900">Site Settings</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all"
            disabled={saving}
          >
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            {settings.logo && (
              <Image width={100} height={100} src={settings.logo} alt="Logo Preview" className="mt-2 h-20 w-auto rounded shadow-md" />
            )}
            {!settings.logo && <p className="mt-2 text-gray-500">No logo uploaded</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Title</label>
            <p className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg">{settings.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <p className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg h-20 resize-y overflow-auto">
              {settings.metaDescription}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
            <p className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg">{settings.metaKeywords}</p>
          </div>
          <div className="flex items-center">
            <span className="mr-2 h-5 w-5 border-2 border-gray-300 rounded flex items-center justify-center">
              {settings.maintenanceMode ? <span className="text-green-500">✓</span> : ""}
            </span>
            <label className="text-sm text-gray-700">Maintenance Mode</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 animate__fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Configure Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          {formData.logo && (
            <Image width={100} height={100} src={formData.logo} alt="Logo Preview" className="mt-2 h-20 w-auto rounded shadow-md" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={saving}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            disabled={saving}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-y"
            required
            disabled={saving}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            disabled={saving}
          />
        </div>
        <div>
         
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={formData.maintenanceMode}
            onChange={handleChange}
            className="mr-2 h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all"
            disabled={saving}
          />
          <label className="text-sm text-gray-700">Enable Maintenance Mode</label>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}