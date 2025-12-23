"use client";
import { useState } from "react";

export default function ImageUploadModal({ event, onClose, onSave }) {
  const [imageUrls, setImageUrls] = useState(event.images || []);
  const [newUrl, setNewUrl] = useState("");

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      setImageUrls([...imageUrls, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const handleRemoveUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(imageUrls);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📸 Add Event Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">{event.title}</h3>
          <p className="text-sm text-gray-600">
            Date: {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        {/* Add new URL */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Add Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddUrl()}
            />
            <button
              onClick={handleAddUrl}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You can use image hosting services like Imgur, Cloudinary, or direct image URLs
          </p>
        </div>

        {/* Image preview grid */}
        {imageUrls.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">
              Images ({imageUrls.length})
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden group"
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
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {url}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
          >
            Save Images
          </button>
        </div>
      </div>
    </div>
  );
}