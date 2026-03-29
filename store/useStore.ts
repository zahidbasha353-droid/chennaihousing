import { create } from "zustand";
import { Project, Lead } from "@/lib/types";
import { DEMO_PROJECTS, DEMO_SETTINGS } from "@/lib/data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import * as api from "@/lib/api";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppState {
  // Projects
  projects: Project[];
  fetchProjects: () => Promise<void>;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // Compare
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Lead) => void;

  // Settings
  settings: typeof DEMO_SETTINGS;
  updateSettings: (settings: Partial<typeof DEMO_SETTINGS>) => Promise<void>;
  fetchSettings: () => Promise<void>;

  // UI state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isLeadFormOpen: boolean;
  setLeadFormOpen: (open: boolean) => void;

  // Language
  language: "en" | "ta";
  setLanguage: (lang: "en" | "ta") => void;

  // Admin auth
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (loggedIn: boolean) => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Projects
  projects: [],
  fetchProjects: async () => {
    if (isSupabaseConfigured()) {
      try {
        const data = await api.getProjects();
        if (data && data.length > 0) {
          set({ projects: data });
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }
  },
  setProjects: (projects) => set({ projects }),
  addProject: async (project) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured");
    }
    try {
      const data = await api.addProject(project);
      // Successfully inserted — add to local state
      set((state) => ({ projects: [data, ...state.projects] }));
    } catch (err: any) {
      // Re-throw real error from api.ts so UI can display it
      throw err;
    }
  },
  updateProject: async (id, data) => {
    // optimistic
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from("projects").update(data).eq("id", id);
    if (error) console.error("Error updating project:", error);
  },
  deleteProject: async (id) => {
    // optimistic
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) console.error("Error deleting project:", error);
  },

  // Favorites
  favorites: [],
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),

  // Compare
  compareList: [],
  toggleCompare: (id) =>
    set((state) => {
      if (state.compareList.includes(id)) {
        return { compareList: state.compareList.filter((c) => c !== id) };
      }
      if (state.compareList.length >= 3) return state;
      return { compareList: [...state.compareList, id] };
    }),
  clearCompare: () => set({ compareList: [] }),

  // Leads
  leads: [],
  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),

  // Settings
  settings: DEMO_SETTINGS,
  fetchSettings: async () => {
    if (isSupabaseConfigured()) {
      try {
        const data = await api.getSettings();
        if (data) {
          set({ settings: data });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }
  },
  updateSettings: async (newSettings) => {
    // Optimistic update
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
    
    // Save to Supabase
    if (isSupabaseConfigured()) {
      try {
        const currentState = useStore.getState().settings;
        await api.updateSettings(currentState);
      } catch (err) {
        console.error("Error saving settings to Supabase:", err);
      }
    }
  },

  // UI
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  isLeadFormOpen: false,
  setLeadFormOpen: (open) => set({ isLeadFormOpen: open }),

  // Language
  language: "en",
  setLanguage: (language) => set({ language }),

  // Admin
  isAdminLoggedIn: false,
  setAdminLoggedIn: (loggedIn) => set({ isAdminLoggedIn: loggedIn }),

  // Toasts
  toasts: [],
  addToast: (message, type = "success") =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now().toString(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
