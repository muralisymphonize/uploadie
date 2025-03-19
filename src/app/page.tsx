"use client";

import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Handle multiple file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
    }
  };

  // Handle multiple file uploads
  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Uploaded ${result.files.length} file(s) successfully.`);
      } else {
        setMessage("Failed to upload the files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage("Error occurred while uploading the files.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload Multiple Files</h1>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4 border p-2 w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
