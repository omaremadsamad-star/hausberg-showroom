import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { FaDatabase, FaPlus, FaTrash, FaDownload, FaUpload, FaSpinner, FaHistory } from "react-icons/fa";

export default function AdminBackups() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const fileInputRef = useRef(null);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const res = await api.getBackups();
      setBackups(res.data || []);
    } catch (e) {
      setError("Failed to load backups list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    try {
      setError("");
      setSuccess("");
      setSaving(true);
      const res = await api.createBackup();
      setSuccess(`Database SQL backup generated successfully: ${res.data.filename}`);
      await fetchBackups();
    } catch (err) {
      setError(err.message || "Failed to create database backup.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (filename) => {
    // Navigate standard browser download route
    window.location.href = `/api/admin/backups/${filename}/download`;
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete the backup file "${filename}"?`)) return;
    try {
      setError("");
      setSuccess("");
      await api.deleteBackup(filename);
      setSuccess(`Backup file ${filename} deleted successfully.`);
      await fetchBackups();
    } catch (err) {
      setError(err.message || "Failed to delete backup file.");
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Are you sure you want to RESTORE the database from "${file.name}"? This will overwrite the current database tables and flush all website caches!`)) {
      e.target.value = ""; // Clear file
      return;
    }

    try {
      setError("");
      setSuccess("");
      setRestoring(true);

      const formData = new FormData();
      formData.append("backup_file", file);

      await api.restoreBackup(formData);
      setSuccess("Database successfully restored! All website caches have been cleared.");
      await fetchBackups();
    } catch (err) {
      setError(err.message || "Failed to restore database from backup file.");
    } finally {
      setRestoring(false);
      e.target.value = ""; // Reset file input
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Database Backups</h1>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Generate database snapshots, download SQL dumps, or restore tables</p>
        </div>
        
        <div className="flex gap-3">
          {/* Hidden File Input for Restore */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".sql"
            className="hidden"
          />
          
          <button
            onClick={handleRestoreClick}
            disabled={saving || restoring}
            className="px-5 py-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 hover:bg-neutral-900/60 text-neutral-300 hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {restoring ? <FaSpinner className="animate-spin" /> : <FaUpload />}
            <span>{restoring ? "Restoring..." : "Restore Database"}</span>
          </button>

          <button
            onClick={handleCreateBackup}
            disabled={saving || restoring}
            className="px-6 py-3 bg-brand hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaPlus />}
            <span>{saving ? "Generating..." : "Generate Backup"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-rose-455 text-xs leading-relaxed max-w-3xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 text-emerald-455 text-xs leading-relaxed max-w-3xl">
          {success}
        </div>
      )}

      {/* SQL Backups List Table */}
      <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-xl max-w-3xl">
        <div className="bg-[#0c0c13] px-6 py-4 border-b border-neutral-900 flex items-center gap-2 text-neutral-300 text-xs font-bold uppercase tracking-wider">
          <FaDatabase className="text-brand" />
          <span>Available Backup Dumps ({backups.length})</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-start">
                  <th className="py-4 px-6 text-start">SQL Filename</th>
                  <th className="py-4 px-6 text-center">File Size</th>
                  <th className="py-4 px-6 text-center">Created At</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60 text-xs text-start">
                {backups.length > 0 ? (
                  backups.map((bak) => (
                    <tr key={bak.filename} className="hover:bg-neutral-900/10 transition-colors duration-200">
                      <td className="py-4.5 px-6 font-bold text-white text-start font-mono">{bak.filename}</td>
                      <td className="py-4.5 px-6 text-center text-neutral-300 font-semibold">{formatBytes(bak.size)}</td>
                      <td className="py-4.5 px-6 text-center text-neutral-450">{bak.created_at}</td>
                      <td className="py-4.5 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDownload(bak.filename)}
                            className="p-2.5 rounded-lg border border-neutral-850 hover:border-brand/40 hover:bg-neutral-900/40 text-neutral-400 hover:text-brand transition-all duration-300 cursor-pointer"
                            title="Download backup file"
                          >
                            <FaDownload size={11} />
                          </button>
                          <button
                            onClick={() => handleDelete(bak.filename)}
                            className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-500 hover:text-rose-455 transition-all duration-300 cursor-pointer"
                            title="Delete backup file"
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-neutral-500 font-light">
                      No SQL backups generated yet. Click "Generate Backup" to save current tables.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
