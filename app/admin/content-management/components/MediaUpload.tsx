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
      onUpload(file); // Pass file to parent for API upload
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded"
      />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="max-h-40" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Upload
      </button>
    </div>
  );
}