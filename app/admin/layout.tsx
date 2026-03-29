"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FolderKanban, Users, Settings,
  Image as ImageIcon, LogOut, Menu, X, MessageSquare
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, setAdminLoggedIn } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAdminLoggedIn(!!session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    };
    checkSession();

    // Listen for auth state changes globally
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminLoggedIn(!!session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, setAdminLoggedIn]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">CH</div>
            <span className="text-white font-semibold">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === href ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}>
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800">
          <button onClick={async () => { 
              await supabase.auth.signOut();
              setAdminLoggedIn(false); 
              router.push("/admin/login"); 
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <LogOut className="w-5 h-5" /> Logout
          </button>
          <Link href="/" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg mt-1">
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm text-gray-500">Welcome, Admin</div>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">A</div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
