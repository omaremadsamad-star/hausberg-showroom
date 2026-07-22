import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { 
  FaBoxOpen, 
  FaTags, 
  FaEye, 
  FaFileAlt, 
  FaStar, 
  FaPercent, 
  FaExclamationTriangle, 
  FaTrash,
  FaPlusCircle,
  FaDatabase
} from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        setStats(res.data);
      } catch (e) {
        console.error("Failed to load dashboard statistics:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const cardItems = [
    { name: "Total Products", value: stats.total_products, icon: FaBoxOpen, color: "text-brand bg-brand/10 border-brand/20" },
    { name: "Categories", value: stats.total_categories, icon: FaTags, color: "text-sky-400 bg-sky-950/20 border-sky-900/30" },
    { name: "Published Products", value: stats.published_products, icon: FaEye, color: "text-emerald-400 bg-emerald-950/20 border-emerald-900/30" },
    { name: "Draft Products", value: stats.draft_products, icon: FaFileAlt, color: "text-neutral-400 bg-neutral-900/40 border-neutral-800/40" },
    { name: "Featured Products", value: stats.featured_products, icon: FaStar, color: "text-amber-400 bg-amber-950/20 border-amber-900/30" },
    { name: "Active Discounts", value: stats.discounted_products, icon: FaPercent, color: "text-pink-400 bg-pink-950/20 border-pink-900/30" },
    { name: "Out Of Stock Items", value: stats.out_of_stock_products, icon: FaExclamationTriangle, color: "text-rose-450 bg-rose-950/20 border-rose-900/30" },
    { name: "Archived in Trash", value: stats.deleted_products, icon: FaTrash, color: "text-red-400 bg-red-950/20 border-red-900/30" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Showroom Overview</h1>
        <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Real-time repository statistics & status metrics</p>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className={`p-6 rounded-2xl border bg-[#0a0a0f]/40 flex items-center justify-between transition-all duration-300 hover:border-neutral-700/60 ${item.color.split(' ')[2]}`}
            >
              <div className="space-y-1">
                <span className="text-neutral-450 text-[10px] font-bold uppercase tracking-wider block">
                  {item.name}
                </span>
                <span className="text-3xl font-black text-white block">
                  {item.value}
                </span>
              </div>
              <div className={`p-3.5 rounded-xl border ${item.color.split(' ')[0]} ${item.color.split(' ')[1]} ${item.color.split(' ')[3]}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts Panel */}
      <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-8 space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Quick Administrative Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/admin/products"
            className="flex items-center gap-4 p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 hover:border-brand/40 text-neutral-300 hover:text-brand transition-all duration-300 group"
          >
            <FaPlusCircle className="text-brand shrink-0 group-hover:scale-108 transition-transform duration-200" size={24} />
            <div className="text-start">
              <span className="text-xs font-bold uppercase tracking-wider block text-white">Create Product</span>
              <span className="text-[10px] text-neutral-500 block mt-0.5">Add showroom item & specifications</span>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center gap-4 p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 hover:border-sky-400/40 text-neutral-300 hover:text-sky-400 transition-all duration-300 group"
          >
            <FaPlusCircle className="text-sky-400 shrink-0 group-hover:scale-108 transition-transform duration-200" size={24} />
            <div className="text-start">
              <span className="text-xs font-bold uppercase tracking-wider block text-white">Manage Categories</span>
              <span className="text-[10px] text-neutral-500 block mt-0.5">Add, edit, or remove classification categories</span>
            </div>
          </Link>

          <Link
            to="/admin/backups"
            className="flex items-center gap-4 p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-450 transition-all duration-300 group"
          >
            <FaDatabase className="text-emerald-450 shrink-0 group-hover:scale-108 transition-transform duration-200" size={24} />
            <div className="text-start">
              <span className="text-xs font-bold uppercase tracking-wider block text-white">Database Backup</span>
              <span className="text-[10px] text-neutral-500 block mt-0.5">Generate SQL backup of showroom tables</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
