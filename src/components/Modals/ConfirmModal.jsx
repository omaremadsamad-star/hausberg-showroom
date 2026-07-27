import React, { useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true
}) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onCancel}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-[#0a0a0f] border border-neutral-900 rounded-3xl p-6 md:p-8 shadow-2xl z-10 transform animate-fade-in-up flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white p-2 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <FaTimes size={16} />
        </button>

        {/* Warning Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
          isDestructive ? "bg-red-950/40 text-red-500 border border-red-900/40" : "bg-brand/10 text-brand border border-brand/20"
        }`}>
          <FaExclamationTriangle size={24} />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-extrabold text-white tracking-tight mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-neutral-450 text-xs leading-relaxed mb-6 px-2">
          {message}
        </p>

        {/* Actions Row */}
        <div className="flex w-full gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-neutral-850 hover:border-neutral-700 bg-[#0f0f15] hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all text-xs font-bold cursor-pointer uppercase tracking-wider"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer uppercase tracking-wider transition-all shadow-md ${
              isDestructive
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white hover:opacity-90 shadow-red-950/20"
                : "bg-gradient-to-r from-brand to-brand-dark text-black hover:opacity-90 shadow-brand/10"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
