"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, CheckCircle, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/upload";

interface ImageUploaderProps {
  label?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  compact?: boolean;
}

export default function ImageUploader({ label = "Upload Image", currentUrl, onUpload, compact = false }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setError("");
    setSuccess(false);
    setUploading(true);

    try {
      const result = await uploadImage(file);
      setPreview(result.url);
      onUpload(result.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Check Supabase Storage bucket.");
      setPreview(currentUrl || "");
    } finally {
      setUploading(false);
    }
  }, [currentUrl, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  if (compact) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-3">
          {preview ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(""); onUpload(""); }}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : null}
          <div
            {...getRootProps()}
            className={`flex-1 flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm text-gray-500">
              {uploading ? "Uploading..." : success ? "Uploaded!" : "Drop file or click"}
            </span>
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-3">
            <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain mx-auto" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(""); onUpload(""); }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {uploading && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Uploading to Supabase...</span>
              </div>
            )}
            {success && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Uploaded successfully!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              {uploading ? (
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              ) : (
                <ImageIcon className="w-7 h-7 text-primary" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isDragActive ? "Drop image here..." : "Drag & drop an image or click to browse"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP up to 5MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
