"use client";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function ImageUploadModal({ event, onClose, onSave }) {
  const [imageUrls, setImageUrls] = useState(event.images || []);
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [cloudinaryConfig, setCloudinaryConfig] = useState(null);

  useEffect(() => {
    // Fetch Cloudinary config
    const fetchConfig = async () => {
      try {
        const res = await api.get("/config/cloudinary");
        setCloudinaryConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch Cloudinary config:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      setImageUrls([...imageUrls, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!cloudinaryConfig) {
      setUploadProgress("Cloudinary not configured. Please try again.");
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);
        formData.append("folder", "unievents"); // Optional: organize in folders

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed for image ${i + 1}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }

      setImageUrls([...imageUrls, ...uploadedUrls]);
      setUploadProgress("Upload complete! ✓");
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress("Upload failed. Please try again.");
      setTimeout(() => setUploadProgress(""), 3000);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleRemoveUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(imageUrls);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📸 Add Event Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            disabled={uploading}
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600">
            📅 {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        {/* Upload from device */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            📤 Upload from Device
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading || !cloudinaryConfig}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${
                uploading || !cloudinaryConfig ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB (Multiple files supported)
              </p>
            </label>
          </div>
          {uploadProgress && (
            <div className="mt-3 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {uploadProgress}
            </div>
          )}
          {!cloudinaryConfig && (
            <p className="text-xs text-red-600 mt-2">
              Loading upload configuration...
            </p>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Or add URL */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            🔗 Add Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddUrl()}
              disabled={uploading}
            />
            <button
              onClick={handleAddUrl}
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:bg-gray-400 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Image preview grid */}
        {imageUrls.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-lg">
              📸 Images ({imageUrls.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative border-2 rounded-lg overflow-hidden group hover:border-blue-500 transition-colors"
                >
                  <img
                    src={url}
                    alt={`Event image ${index + 1}`}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Invalid+Image";
                    }}
                  />
                  <button
                    onClick={() => handleRemoveUrl(index)}
                    disabled={uploading}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 shadow-lg"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="truncate">Image {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {imageUrls.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No images added yet. Upload from device or add URLs above.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold disabled:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading || imageUrls.length === 0}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : `Save ${imageUrls.length} Image${imageUrls.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}