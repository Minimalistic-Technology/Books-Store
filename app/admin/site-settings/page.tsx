"use client";

import { useState, useEffect } from "react";
import SiteSettingsForm from "./components/SiteSettingsForm";
import { API_BASE_URL } from '../../../utils/api';

export interface SiteSettings {
  _id?: string;
  logo: string | null;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  apiKey: string;
  maintenanceMode: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        
        if (data) {
          // Settings exist, update state with API data
          setSettings({
            _id: data._id,
            logo: data.logo || null,
            title: data.title || "",
            metaDescription: data.metaDescription || "",
            metaKeywords: data.metaKeywords || "",
            apiKey: data.apiKey || "",
            maintenanceMode: data.maintenanceMode || false,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            __v: data.__v,
          });
        } else {
          // No settings found, keep default settings and set optional error
          setError("No settings found. You can create new settings.");
        }
      } catch  {
        
        setError("Failed to load settings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (updatedSettings: SiteSettings) => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

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
        credentials:"include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save settings");
      }

      const data = await response.json();
      setSettings({
        ...updatedSettings,
        _id: data._id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        __v: data.__v,
      });
      setSaveSuccess("Settings saved successfully!");
      
    } catch (err) {
      if(err instanceof Error){

        
        setSaveError(err.message || "Failed to save settings. Please try again.");
      }
      else{

        
        setSaveError( "Failed to save settings. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Site Settings - Books Store</h1>
      {error && <p className="text-red-500">{error}</p>}
      {saveError && <p className="text-red-500">{saveError}</p>}
      {saveSuccess && <p className="text-green-500">{saveSuccess}</p>}
      {loading ? (
        <p className="text-gray-500 text-center">Loading settings...</p>
      ) : (
        <SiteSettingsForm settings={settings} onSave={handleSave} saving={saving} />
      )}
    </div>
  );
}