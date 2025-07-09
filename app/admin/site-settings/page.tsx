// app/admin/site-settings/page.tsx
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
    console.log("Settings saved:", updatedSettings);
  };

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Site Settings - Books Store</h1>
      <SiteSettingsForm settings={settings} onSave={handleSave} />
    </div>
  );
}