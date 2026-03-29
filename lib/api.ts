import { supabase } from "./supabase";
import { SiteSettings, Project } from "./types";
import { DEMO_SETTINGS } from "./data";

/** SETTINGS API */

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) {
      console.warn("Supabase settings fetch error, using fallback:", error.message);
      return DEMO_SETTINGS;
    }
    return (data as SiteSettings) || DEMO_SETTINGS;
  } catch (err) {
    console.error("Critical error in getSettings:", err);
    return DEMO_SETTINGS;
  }
}

export async function updateSettings(settingsData: Partial<SiteSettings>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("settings")
      .update({ ...settingsData, updated_at: new Date().toISOString() })
      .eq("id", 1);
    
    if (error) {
      console.error("Error updating settings:", error.message);
      throw new Error(error.message);
    }
    return true;
  } catch (err: any) {
    console.error("Critical error in updateSettings:", err);
    throw err;
  }
}

/** PROJECTS API */

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching projects:", error.message);
      return [];
    }
    return (data as Project[]) || [];
  } catch (err) {
    console.error("Critical error in getProjects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (error) {
      if (error.code !== "PGRST116") { // Filter out "no rows found" from becoming a console error
        console.error("Error fetching project by slug:", error.message);
      }
      return null;
    }
    return data as Project;
  } catch (err) {
    console.error("Critical error in getProjectBySlug:", err);
    return null;
  }
}

export async function addProject(projectData: Partial<Project>): Promise<Project> {
  try {
    const insertData = {
      ...projectData,
      price: projectData.price || projectData.price_min || 0,
      location: projectData.location || "",
      title: projectData.title || "Untitled",
      image: projectData.image || (projectData.images && projectData.images[0]) || "",
      slug: projectData.slug || (projectData.title ? projectData.title.toLowerCase().replace(/ /g, "-") : `project-${Date.now()}`),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);
      throw new Error(error.message);
    }

    if (!data) throw new Error("Insert returned no data");

    return data as Project;
  } catch (err: any) {
    console.error("Critical error in addProject:", err);
    throw err;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting project:", error.message);
      throw new Error(error.message);
    }
    return true;
  } catch (err: any) {
    console.error("Critical error in deleteProject:", err);
    throw err;
  }
}
