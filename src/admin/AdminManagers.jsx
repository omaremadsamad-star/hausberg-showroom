import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUserSlash, FaUserCheck, FaSpinner, FaUndo } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function AdminManagers() {
  const { user: currentAdmin } = useAuth();
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editor Form State
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Active");
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.getAdmins();
      setAdmins(res.data || []);
    } catch (e) {
      setError("Failed to load administrator accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setStatus("Active");
    setError("");
    setSuccess("");
    setShowEditor(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingId(admin.id);
    setName(admin.name);
    setUsername(admin.username);
    setEmail(admin.email);
    setPassword(""); // Keep password blank unless changing
    setStatus(admin.status);
    setError("");
    setSuccess("");
    setShowEditor(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || (!editingId && !password)) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const payload = {
        name,
        username,
        email,
        status,
      };

      if (password) {
        payload.password = password;
      }

      if (editingId) {
        await api.updateAdmin(editingId, payload);
        setSuccess("Administrator account updated successfully.");
      } else {
        await api.createAdmin(payload);
        setSuccess("Administrator account created successfully.");
      }

      setShowEditor(false);
      await fetchAdmins();
    } catch (err) {
      setError(err.message || "Failed to save administrator.");
    } finally {
      setSaving(false);
    }
  };

  const handleDisable = async (id) => {
    try {
      setError("");
      setSuccess("");
      await api.disableAdmin(id);
      setSuccess("Administrator disabled. They can no longer log in.");
      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnable = async (id) => {
    try {
      setError("");
      setSuccess("");
      await api.enableAdmin(id);
      setSuccess("Administrator account activated successfully.");
      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Soft delete this administrator account?")) return;
    try {
      setError("");
      setSuccess("");
      await api.deleteAdmin(id);
      setSuccess("Administrator soft-deleted.");
      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">System Administrators</h1>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Manage system users, change passwords, and disable accounts</p>
        </div>
        {!showEditor && (
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 bg-brand hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
          >
            <FaPlus />
            <span>Add Admin</span>
          </button>
        )}
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

      {/* -------------------- EDITOR SCREEN -------------------- */}
      {showEditor ? (
        <form onSubmit={handleSubmit} className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-8 space-y-6 max-w-2xl shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
            {editingId ? "Edit Administrator Details" : "Create New Administrator Account"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@hausberg.com"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">
                Password {editingId ? "(Leave blank to keep current)" : "*"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (minimum 8 characters)"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:ring-0 cursor-pointer"
                disabled={saving}
              >
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900/60 flex justify-end gap-3.5">
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="py-3 px-6 border border-neutral-850 hover:border-neutral-700 text-neutral-450 hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-8 bg-brand hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              <span>Save Admin</span>
            </button>
          </div>
        </form>
      ) : (
        /* -------------------- LIST SCREEN -------------------- */
        <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-start">
                    <th className="py-4 px-6 text-start">Name</th>
                    <th className="py-4 px-6 text-start">Username</th>
                    <th className="py-4 px-6 text-start">Email</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Last Login</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60 text-xs">
                  {admins.map((adm) => {
                    const isSelf = adm.id === currentAdmin?.id;
                    return (
                      <tr key={adm.id} className="hover:bg-neutral-900/10 transition-colors duration-200">
                        <td className="py-4.5 px-6 font-bold text-white text-start">
                          <div className="flex items-center gap-2">
                            <span>{adm.name}</span>
                            {isSelf && (
                              <span className="text-[8px] bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Self</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4.5 px-6 text-neutral-400 text-start">@{adm.username}</td>
                        <td className="py-4.5 px-6 text-neutral-300 text-start">{adm.email}</td>
                        <td className="py-4.5 px-6 text-center">
                          {adm.status === "Active" ? (
                            <span className="text-emerald-450 font-bold text-[9px] uppercase border border-emerald-500/20 bg-emerald-950/20 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-rose-455 font-bold text-[9px] uppercase border border-rose-500/20 bg-rose-950/20 px-2 py-0.5 rounded-full">
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="py-4.5 px-6 text-center text-neutral-450">
                          {adm.last_login_at ? new Date(adm.last_login_at).toLocaleString() : "-"}
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(adm)}
                              className="p-2.5 rounded-lg border border-neutral-850 hover:border-brand/40 hover:bg-neutral-900/40 text-neutral-400 hover:text-brand transition-all duration-300 cursor-pointer"
                              title="Edit user"
                            >
                              <FaEdit size={11} />
                            </button>

                            {!isSelf && (
                              <>
                                {adm.status === "Active" ? (
                                  <button
                                    onClick={() => handleDisable(adm.id)}
                                    className="p-2.5 rounded-lg border border-neutral-850 hover:border-amber-500/45 hover:bg-amber-950/10 text-neutral-500 hover:text-amber-500 transition-all duration-300 cursor-pointer"
                                    title="Disable account"
                                  >
                                    <FaUserSlash size={11} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEnable(adm.id)}
                                    className="p-2.5 rounded-lg border border-neutral-850 hover:border-emerald-500/45 hover:bg-emerald-950/10 text-neutral-500 hover:text-emerald-450 transition-all duration-300 cursor-pointer"
                                    title="Activate account"
                                  >
                                    <FaUserCheck size={11} />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDelete(adm.id)}
                                  className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-500 hover:text-rose-455 transition-all duration-300 cursor-pointer"
                                  title="Delete user account"
                                >
                                  <FaTrash size={11} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
