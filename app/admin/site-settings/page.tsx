"use client";

import { useState } from "react";
import SiteSettingsForm from "./components/SiteSettingsForm";

export interface SiteSettings {
  logo: string | null;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  apiKey: string;
  maintenanceMode: boolean;
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    logo: null,
    title: "Books Store",
    metaDescription: "Welcome to the best online book store!",
    metaKeywords: "books, online store, reading",
    apiKey: "",
    maintenanceMode: false,
  });

  const handleSave = (updatedSettings: SiteSettings) => {
    setSettings(updatedSettings);
    // In a real app, you'd save to an API here
    console.log("Settings saved:", updatedSettings);
  };

  return (
    <div className="space-y-6 w-full h-full">
      <h1 className="text-3xl font-bold">Site Settings - Books Store</h1>
      <SiteSettingsForm settings={settings} onSave={handleSave} />
    </div>
  );
}