import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  const { lang } = useLanguage();
  const isRtl = lang === "ar" || lang === "ku";

  if (lastPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2.5 mt-16 animate-fade-in">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-xl bg-[#0f0f15] border border-neutral-850 hover:border-brand/40 text-neutral-450 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:border-neutral-850 disabled:hover:text-neutral-450 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        {isRtl ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </button>

      {/* Page Numbers */}
      {pages.map((p) => {
        const isActive = currentPage === p;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl font-semibold text-xs tracking-wider transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-brand text-black shadow-md shadow-brand/10 border border-transparent"
                : "bg-[#0f0f15] border border-neutral-850 hover:border-brand/35 text-neutral-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-3 rounded-xl bg-[#0f0f15] border border-neutral-850 hover:border-brand/40 text-neutral-450 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:border-neutral-850 disabled:hover:text-neutral-450 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        {isRtl ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
      </button>
    </div>
  );
}
