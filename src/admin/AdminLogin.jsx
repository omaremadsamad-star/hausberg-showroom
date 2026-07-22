import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLock, FaUser } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      setSubmitting(true);
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0a0a0f] border border-neutral-900 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center font-black text-black text-2xl mx-auto mb-4">
            H
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Hausberg Showroom Management</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-rose-400 text-xs leading-relaxed animate-fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Username</label>
            <div className="relative flex items-center bg-[#0f0f15] border border-neutral-850 focus-within:border-brand/60 rounded-xl px-4 py-3 transition-colors duration-200">
              <FaUser className="text-neutral-600 me-3 shrink-0" size={12} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0 text-xs font-medium"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Password</label>
            <div className="relative flex items-center bg-[#0f0f15] border border-neutral-850 focus-within:border-brand/60 rounded-xl px-4 py-3 transition-colors duration-200">
              <FaLock className="text-neutral-600 me-3 shrink-0" size={12} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0 text-xs font-medium"
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-brand to-brand-dark text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity duration-300 shadow-md shadow-brand/10 cursor-pointer mt-2"
          >
            {submitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
