import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FaLock, FaUser } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const { showToast } = useToast();
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
    const errors = {};
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Please fill in all fields.", "error");
      
      // Auto focus first invalid field
      if (errors.username) {
        usernameRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    try {
      setFieldErrors({});
      setSubmitting(true);
      await login(username, password);
      showToast("Login successful. Welcome back!", "success");
      navigate("/admin/dashboard");
    } catch (err) {
      showToast(err.message || "Invalid credentials.", "error");
      usernameRef.current?.focus();
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Username</label>
            <div className={`relative flex items-center bg-[#0f0f15] border rounded-xl px-4 py-3 transition-colors duration-200 ${
              fieldErrors.username ? "border-red-500/80 focus-within:border-red-500" : "border-neutral-850 focus-within:border-brand/60"
            }`}>
              <FaUser className="text-neutral-600 me-3 shrink-0" size={12} />
              <input
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: null }));
                }}
                placeholder="Enter username"
                className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0 text-xs font-medium"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            {fieldErrors.username && (
              <span className="text-[10px] font-semibold text-red-500 tracking-wide animate-fade-in block mt-1">
                {fieldErrors.username}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Password</label>
            <div className={`relative flex items-center bg-[#0f0f15] border rounded-xl px-4 py-3 transition-colors duration-200 ${
              fieldErrors.password ? "border-red-500/80 focus-within:border-red-500" : "border-neutral-850 focus-within:border-brand/60"
            }`}>
              <FaLock className="text-neutral-600 me-3 shrink-0" size={12} />
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
                }}
                placeholder="Enter password"
                className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0 text-xs font-medium"
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>
            {fieldErrors.password && (
              <span className="text-[10px] font-semibold text-red-500 tracking-wide animate-fade-in block mt-1">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-brand to-brand-dark text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity duration-300 shadow-md shadow-brand/10 cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
