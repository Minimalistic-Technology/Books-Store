// components/MediaUpload.tsx
"use client";

import { useState } from "react";

interface MediaUploadProps {
  onUpload: (file: File) => void;
}

export default function MediaUpload({ onUpload }: MediaUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="max-h-40 mx-auto" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all disabled:bg-gray-400"
      >
        Upload
      </button>
    </div>
  );
}