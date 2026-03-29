"use client";

import { useState, useCallback } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, Trash2, Loader2, CheckCircle, Copy } from "lucide-react";
import { useStore } from "@/store/useStore";
import ImageUploader from "@/components/ui/ImageUploader";

export default function AdminMediaPage() {
  const [urlMode, setUrlMode] = useState(false); // Default to upload mode
  const [url, setUrl] = useState("");
  const [savedUrls, setSavedUrls] = useState<string[]>([]);
  const { addToast } = useStore();

  const handleUpload = useCallback((uploadedUrl: string) => {
    if (uploadedUrl) {
      setSavedUrls(prev => [uploadedUrl, ...prev]);
      addToast("Image uploaded successfully!", "success");
    }
  }, [addToast]);

  const handleUrlAdd = () => {
    if (!url || !url.trim()) return;
    setSavedUrls(prev => [url.trim(), ...prev]);
    addToast("Image URL added!", "success");
    setUrl("");
  };

  const copyUrl = (u: string) => {
    navigator.clipboard.writeText(u);
    addToast("URL copied to clipboard!", "info");
  };

  const removeUrl = (idx: number) => {
    setSavedUrls(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
        <p className="text-sm text-gray-500 mt-1">Upload images and manage media for your website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setUrlMode(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!urlMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              <Upload className="w-4 h-4 inline mr-1" /> Upload File
            </button>
            <button
              type="button"
              onClick={() => setUrlMode(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${urlMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              <LinkIcon className="w-4 h-4 inline mr-1" /> Add via URL
            </button>
          </div>

          {!urlMode ? (
            <ImageUploader
              label="Drag & Drop to Upload"
              onUpload={handleUpload}
            />
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUrlAdd}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Media ({savedUrls.length})
          </h2>
          {savedUrls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ImageIcon className="w-12 h-12 opacity-50 mb-2" />
              <span className="text-sm">No media uploaded yet</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {savedUrls.map((u, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u}
                    alt={`Media ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => copyUrl(u)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUrl(i)}
                      className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
