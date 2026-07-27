import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/Modals/ConfirmModal";
import EmptyState from "../components/EmptyState/EmptyState";

import { FaDatabase, FaPlus, FaTrash, FaDownload, FaUpload, FaSpinner, FaHistory } from "react-icons/fa";

export default function AdminBackups() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Notifications and Modals state
  const { showToast } = useToast();
  const [confirmDeleteFile, setConfirmDeleteFile] = useState(null);
  const [pendingRestoreFile, setPendingRestoreFile] = useState(null);
  
  const fileInputRef = useRef(null);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const res = await api.getBackups();
      setBackups(res.data || []);
    } catch (e) {
      showToast("Failed to load backups list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    try {
      setSaving(true);
      const res = await api.createBackup();
      showToast(`Database SQL backup generated successfully: ${res.data.filename}`, "success");
      await fetchBackups();
    } catch (err) {
      showToast(err.message || "Failed to create database backup.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (filename) => {
    // Navigate standard browser download route
    window.location.href = `/api/admin/backups/${filename}/download`;
  };

  const handleDeleteTrigger = (filename) => {
    setConfirmDeleteFile(filename);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteFile) return;
    const filename = confirmDeleteFile;
    setConfirmDeleteFile(null);

    try {
      await api.deleteBackup(filename);
      showToast(`Backup file ${filename} deleted successfully.`, "success");
      await fetchBackups();
    } catch (err) {
      showToast(err.message || "Failed to delete backup file.", "error");
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingRestoreFile(file);
  };

  const handleConfirmRestore = async () => {
    if (!pendingRestoreFile) return;
    const file = pendingRestoreFile;
    setPendingRestoreFile(null);

    try {
      setRestoring(true);
      showToast("Starting database restoration...", "info");

      const formData = new FormData();
      formData.append("backup_file", file);

      await api.restoreBackup(formData);
      showToast("Database successfully restored! Caches cleared.", "success");
      await fetchBackups();
    } catch (err) {
      showToast(err.message || "Failed to restore database.", "error");
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        ) : backups.length > 0 ? (
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
                {backups.map((bak) => (
                  <tr key={bak.filename} className="hover:bg-neutral-900/10 transition-colors duration-200">
                    <td className="py-4.5 px-6 font-bold text-white text-start font-mono">{bak.filename}</td>
                    <td className="py-4.5 px-6 text-center text-neutral-300 font-semibold">{formatBytes(bak.size)}</td>
                    <td className="py-4.5 px-6 text-center text-neutral-455">{bak.created_at}</td>
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
                          onClick={() => handleDeleteTrigger(bak.filename)}
                          className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-500 hover:text-rose-455 transition-all duration-300 cursor-pointer"
                          title="Delete backup file"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FaHistory}
            title="No Backups Generated"
            description="You have not created any SQL backup dumps yet. Click 'Generate Backup' above to save the current showroom database states."
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteFile}
        title="Delete SQL Backup?"
        message={`Are you sure you want to delete the backup file "${confirmDeleteFile}"? This database dump will be permanently lost.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteFile(null)}
      />

      {/* Restore Confirmation Modal */}
      <ConfirmModal
        isOpen={!!pendingRestoreFile}
        title="Restore Database?"
        message={`Warning: Restoring the database from "${pendingRestoreFile?.name}" will overwrite all current categories, products, and admin accounts. This cannot be undone!`}
        confirmText="Restore Now"
        onConfirm={handleConfirmRestore}
        onCancel={() => setPendingRestoreFile(null)}
      />
    </div>
  );
}
