import React from "react";
import { FaInbox } from "react-icons/fa";

export default function EmptyState({
  icon: Icon = FaInbox,
  title = "No items found",
  description = "There are no records matching your criteria or currently available in the database.",
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex items-center justify-center text-brand mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-bold text-white tracking-wide mb-1.5 uppercase">
        {title}
      </h3>
      <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="py-2.5 px-5 bg-gradient-to-r from-brand to-brand-dark text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 shadow-md shadow-brand/10 transition-opacity duration-300 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
