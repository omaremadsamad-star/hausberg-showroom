import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toasts Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-2xl transition-all duration-300 animate-slide-in-right bg-[#0f1015] ${
              toast.type === "error"
                ? "border-red-500/40 shadow-red-500/5 text-red-200"
                : "border-[#d4af37]/40 shadow-[#d4af37]/5 text-neutral-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "error" ? (
                <FaExclamationCircle className="text-red-500 shrink-0" size={18} />
              ) : (
                <FaCheckCircle className="text-[#d4af37] shrink-0" size={18} />
              )}
              <span className="text-sm font-medium tracking-wide">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-500 hover:text-white p-1 ml-4 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <FaTimes size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
