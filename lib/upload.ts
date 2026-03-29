import { supabase } from "./supabase";

const BUCKET = "images";

export interface UploadResult {
  url: string;
}

/**
 * Upload a File to Supabase Storage and return the public URL.
 * No external API key required — uses the existing Supabase client.
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  // Generate a unique filename: timestamp + sanitized original name
  const ext = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 40);
  const fileName = `${Date.now()}_${safeName}.${ext}`;
  const filePath = `uploads/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw new Error(error.message || "Image upload failed");
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error("Failed to get public URL for uploaded image");
  }

  return {
    url: urlData.publicUrl,
  };
}
