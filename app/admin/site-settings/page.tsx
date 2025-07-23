"use client";

import { useState, useEffect } from "react";
import SiteSettingsForm from "./components/SiteSettingsForm";
import { API_BASE_URL } from '../../../utils/api';

export interface SiteSettings {
  _id?: string; // Optional, as it comes from the API
  logo: string | null;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  apiKey: string;
  maintenanceMode: boolean;
  createdAt?: string; // Optional, from API
  updatedAt?: string; // Optional, from API
  __v?: number; // Optional, from API
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    logo: null,
    title: "",
    metaDescription: "",
    metaKeywords: "",
    apiKey: "",
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        console.log("API Response:", data); // Debug the response
        setSettings({
          _id: data._id,
          logo: data.logo || null,
          title: data.title,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          apiKey: data.apiKey,
          maintenanceMode: data.maintenanceMode,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          __v: data.__v,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Failed to load settings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (updatedSettings: SiteSettings) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo: updatedSettings.logo,
          title: updatedSettings.title,
          metaDescription: updatedSettings.metaDescription,
          metaKeywords: updatedSettings.metaKeywords,
          apiKey: updatedSettings.apiKey,
          maintenanceMode: updatedSettings.maintenanceMode,
        }),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      const data = await response.json();
      setSettings({
        ...updatedSettings,
        _id: data._id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        __v: data.__v,
      });
      console.log("Settings saved:", data);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again."); // Update error state
    }
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Site Settings - Books Store</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-center">Loading settings...</p>
      ) : (
        <SiteSettingsForm settings={settings} onSave={handleSave} />
      )}
    </div>
  );
}