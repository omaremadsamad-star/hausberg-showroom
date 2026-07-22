import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { FaShieldAlt, FaHistory, FaBan, FaUnlock, FaSearch, FaSpinner } from "react-icons/fa";

export default function AdminSecurity({ activeTab: initialTab = "logs" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Logs State
  const [logs, setLogs] = useState([]);
  const [logPage, setLogPage] = useState(1);
  const [logLastPage, setLogLastPage] = useState(1);
  const [logSearch, setLogSearch] = useState("");
  const [logsLoading, setLogsLoading] = useState(true);

  // Blocked IPs State
  const [blockedIps, setBlockedIps] = useState([]);
  const [ipsLoading, setIpsLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await api.getLogs({
        search: logSearch,
        page: logPage
      });
      setLogs(res.data.data || []);
      setLogLastPage(res.data.last_page || 1);
    } catch (e) {
      console.error(e);
      setError("Failed to load audit logs.");
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchBlockedIps = async () => {
    try {
      setIpsLoading(true);
      const res = await api.getBlockedIps();
      setBlockedIps(res.data || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load blocked IP addresses list.");
    } finally {
      setIpsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    } else {
      fetchBlockedIps();
    }
  }, [activeTab, logPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLogPage(1);
    fetchLogs();
  };

  const handleUnblock = async (id, ipAddress) => {
    if (!window.confirm(`Unblock and whitelist the IP address ${ipAddress}?`)) return;
    try {
      setError("");
      setSuccess("");
      setSubmitting(true);
      await api.unblockIp(id);
      setSuccess(`IP address ${ipAddress} unblocked successfully.`);
      await fetchBlockedIps();
    } catch (err) {
      setError(err.message || "Failed to unblock IP address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Security & Audit logs</h1>
        <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Monitor administrator actions, search audit logs, and unblock blacklisted IPs</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-900 text-xs uppercase font-bold tracking-wider">
        <button
          onClick={() => { setActiveTab("logs"); setError(""); setSuccess(""); }}
          className={`px-6 py-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "logs" ? "border-brand text-brand bg-[#0a0a0f]/20" : "border-transparent text-neutral-450 hover:text-white"
          }`}
        >
          <FaHistory />
          <span>Audit Activity Logs</span>
        </button>
        <button
          onClick={() => { setActiveTab("ips"); setError(""); setSuccess(""); }}
          className={`px-6 py-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "ips" ? "border-brand text-brand bg-[#0a0a0f]/20" : "border-transparent text-neutral-450 hover:text-white"
          }`}
        >
          <FaBan />
          <span>Blocked IP Addresses ({blockedIps.length})</span>
        </button>
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

      {/* -------------------- TAB: AUDIT LOGS -------------------- */}
      {activeTab === "logs" && (
        <div className="space-y-6">
          {/* Logs Search bar */}
          <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-5 flex items-center shadow-md">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[#0f0f15] border border-neutral-850 focus-within:border-brand/60 rounded-xl px-4 py-2.5 w-full max-w-md transition-colors duration-200">
              <FaSearch className="text-neutral-500 me-2.5 shrink-0" size={12} />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search logs by action, username, IP..."
                className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0 text-xs"
              />
            </form>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-xl">
            {logsLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-900 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-start">
                      <th className="py-4 px-6 text-start">Date / Time</th>
                      <th className="py-4 px-6 text-start">Admin User</th>
                      <th className="py-4 px-6 text-start">Action Description</th>
                      <th className="py-4 px-6 text-center">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900/60 text-xs text-start">
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-900/10 transition-colors duration-200">
                          <td className="py-4 px-6 text-neutral-450">{new Date(log.created_at).toLocaleString()}</td>
                          <td className="py-4 px-6 font-semibold text-white">
                            {log.admin_name} <span className="text-[10px] text-neutral-500 font-light block mt-0.5">@{log.username}</span>
                          </td>
                          <td className="py-4 px-6 text-neutral-300 font-light leading-relaxed">{log.action}</td>
                          <td className="py-4 px-6 text-center text-neutral-450 font-mono text-[10px]">{log.ip_address}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-neutral-500 font-light">
                          No activity logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Log Pagination */}
          {logLastPage > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setLogPage(logPage - 1)}
                disabled={logPage === 1}
                className="px-4 py-2 border border-neutral-850 hover:border-neutral-700 disabled:opacity-30 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-neutral-450 uppercase font-semibold">
                Page {logPage} of {logLastPage}
              </span>
              <button
                onClick={() => setLogPage(logPage + 1)}
                disabled={logPage === logLastPage}
                className="px-4 py-2 border border-neutral-850 hover:border-neutral-700 disabled:opacity-30 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* -------------------- TAB: BLOCKED IPS -------------------- */}
      {activeTab === "ips" && (
        <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-xl max-w-3xl">
          {ipsLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-start">
                    <th className="py-4 px-6 text-start">IP Address</th>
                    <th className="py-4 px-6 text-start">Block Reason</th>
                    <th className="py-4 px-6 text-center">Expires At (24h)</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60 text-xs">
                  {blockedIps.length > 0 ? (
                    blockedIps.map((ip) => (
                      <tr key={ip.id} className="hover:bg-neutral-900/10 transition-colors duration-200">
                        <td className="py-4 px-6 font-bold text-white text-start font-mono text-sm">{ip.ip_address}</td>
                        <td className="py-4 px-6 text-neutral-300 text-start font-light">{ip.reason}</td>
                        <td className="py-4 px-6 text-center text-neutral-450">
                          {ip.expires_at ? new Date(ip.expires_at).toLocaleString() : "Indefinite"}
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleUnblock(ip.id, ip.ip_address)}
                              disabled={submitting}
                              className="px-4 py-2 border border-emerald-500/40 hover:bg-emerald-950/10 text-emerald-450 hover:text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                              title="Unblock and Whitelist IP"
                            >
                              <FaUnlock size={10} />
                              <span>Unblock</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-neutral-500 font-light">
                        No blocked IP addresses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
