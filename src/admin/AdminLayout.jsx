import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaTags, 
  FaCog, 
  FaUsers, 
  FaShieldAlt, 
  FaDatabase, 
  FaSignOutAlt, 
  FaExternalLinkAlt 
} from "react-icons/fa";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaTachometerAlt },
    { name: "Products", path: "/admin/products", icon: FaBoxOpen },
    { name: "Categories", path: "/admin/categories", icon: FaTags },
    { name: "Settings & Banner", path: "/admin/settings", icon: FaCog },
    { name: "Administrators", path: "/admin/admins", icon: FaUsers },
    { name: "Security & Logs", path: "/admin/logs", icon: FaShieldAlt },
    { name: "Backups", path: "/admin/backups", icon: FaDatabase },
  ];

  return (
    <div className="min-h-screen flex bg-[#07070a] text-neutral-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-e border-neutral-900 bg-[#0a0a0f] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center font-black text-black text-lg">
              H
            </div>
            <div>
              <span className="font-bold text-sm uppercase tracking-widest text-neutral-100 block">
                Hausberg
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                Showroom Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-brand text-black shadow-md shadow-brand/10"
                      : "text-neutral-450 hover:bg-neutral-900/60 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-900 space-y-2">
          {/* View Website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:bg-neutral-900/40 hover:text-brand transition-all duration-300"
          >
            <span className="flex items-center gap-3.5">
              <FaExternalLinkAlt size={12} />
              <span>Public Website</span>
            </span>
          </a>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-400 hover:bg-rose-950/20 hover:text-rose-350 transition-all duration-300 text-start cursor-pointer"
          >
            <FaSignOutAlt size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-neutral-900 bg-[#0a0a0f]/50 backdrop-blur-md px-8 flex justify-between items-center z-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            {menuItems.find((item) => location.pathname.startsWith(item.path))?.name || "Administration"}
          </h2>

          <div className="flex items-center gap-3">
            <div className="text-end">
              <span className="text-xs font-bold block text-white">{user.name}</span>
              <span className="text-[10px] text-neutral-500 block">@{user.username}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center font-bold text-xs text-brand uppercase">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#07070a]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
