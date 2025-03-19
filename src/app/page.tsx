"use client";

import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<string | null>(null);

  // Handle multiple file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      setProgress(0); // Reset progress when new files are selected
      setMessage(null);
      setStats(null);
    }
  };

  // Handle file upload with progress and performance calculations
  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select files to upload.");
      return;
    }

    const totalFiles = files.length;
    let uploadedFiles = 0;
    let totalSize = 0; // Track total file size in bytes

    // Start time for upload
    const startTime = performance.now();

    for (const file of Array.from(files)) {
      totalSize += file.size; // Sum file sizes

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          uploadedFiles++;
          const percentage = Math.round((uploadedFiles / totalFiles) * 100);
          setProgress(percentage); // Update progress after each file upload
        } else {
          setMessage(`Failed to upload ${file.name}`);
          return;
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        setMessage(`Error uploading ${file.name}`);
        return;
      }
    }

    // End time for upload
    const endTime = performance.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    // Calculate average files per second
    const avgFilesPerSecond = totalFiles / durationInSeconds;

    // Calculate upload speed in MB/s
    const totalSizeInMB = totalSize / (1024 * 1024); // Convert bytes to MB
    const avgSpeedInMBps = totalSizeInMB / durationInSeconds;

    // Set stats with labels
    setStats(
      `⏱️ Total Time: ${durationInSeconds.toFixed(2)}s | 📂 Files/Second: ${avgFilesPerSecond.toFixed(
        2
      )} | 🚀 Upload Speed: ${avgSpeedInMBps.toFixed(2)} MB/s`
    );

    setMessage(`Uploaded ${totalFiles} file(s) successfully.`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Upload Multiple Files</h1>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4 border p-2 w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Upload
        </button>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full">
            <div
              className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* Show total time, files/sec, and MB/s after upload */}
        {stats !== null && (
          <div className="mt-4 text-sm text-gray-600">
            <p>{stats}</p>
          </div>
        )}

        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
