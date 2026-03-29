import { supabase } from "./supabase";
import { SiteSettings, Project } from "./types";
import { DEMO_SETTINGS } from "./data";

/** SETTINGS API */

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
  if (error || !data) {
    console.error("Error fetching settings:", error);
    return DEMO_SETTINGS;
  }
  return data as SiteSettings;
}

export async function updateSettings(settingsData: Partial<SiteSettings>): Promise<boolean> {
  const { error } = await supabase
    .from("settings")
    .update({ ...settingsData, updated_at: new Date().toISOString() })
    .eq("id", 1);
  
  if (error) {
    console.error("Error updating settings:", error);
    return false;
  }
  return true;
}

/** PROJECTS API */

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data as Project[];
}

export async function addProject(projectData: Partial<Project>): Promise<Project> {
  // Ensure required DB columns are always present
  const insertData = {
    ...projectData,
    // 'price' column is NOT NULL in DB — derive from price_min if not provided
    price: projectData.price || projectData.price_min || 0,
    // 'location' is NOT NULL
    location: projectData.location || "",
    // 'title' is NOT NULL
    title: projectData.title || "Untitled",
    // 'image' is a single string column — use first image from images array
    image: projectData.image || (projectData.images && projectData.images[0]) || "",
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    // Throw with the REAL error message so the UI can display it
    throw new Error(error.message || "Database insert failed");
  }

  if (!data) {
    throw new Error("Insert returned no data");
  }

  return data as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    console.error("Error deleting project:", error);
    return false;
  }
  return true;
}
