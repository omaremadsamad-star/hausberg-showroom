import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function SearchBar({ searchQuery, onSearchChange, resultCount }) {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar" || lang === "ku";

  const getResultText = () => {
    if (!searchQuery) {
      if (lang === "ar") {
        return (
          <>
            عرض جميع الأجهزة الـ <strong className="text-brand font-semibold">{resultCount}</strong> الفاخرة
          </>
        );
      }
      if (lang === "ku") {
        return (
          <>
            پیشاندانی هەموو <strong className="text-brand font-semibold">{resultCount}</strong> بەرهەمە ناوازەکە
          </>
        );
      }
      return (
        <>
          Showing all <strong className="text-neutral-300 font-semibold">{resultCount}</strong> premium products
        </>
      );
    } else {
      if (lang === "ar") {
        return (
          <>
            تم العثور على <strong className="text-brand font-semibold">{resultCount}</strong> نتائج لـ "{searchQuery}"
          </>
        );
      }
      if (lang === "ku") {
        return (
          <>
            <strong className="text-brand font-semibold">{resultCount}</strong> ئەنجام دۆزرایەوە بۆ "{searchQuery}"
          </>
        );
      }
      return (
        <>
          Found <strong className="text-neutral-300 font-semibold">{resultCount}</strong> results for "{searchQuery}"
        </>
      );
    }
  };

  const instantSearchLabel = 
    lang === "ar" 
      ? "البحث الفوري نشط" 
      : lang === "ku" 
        ? "گەڕانی خێرا چالاکە" 
        : "Instant search enabled";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Search Input Container */}
      <div className="relative flex items-center bg-[#0f0f15] border border-neutral-850 hover:border-neutral-700/80 focus-within:border-brand/70 rounded-xl transition-all duration-300 shadow-lg px-4 py-3.5">
        {/* Search Icon */}
        <FaSearch className="text-neutral-500 focus-within:text-brand transition-colors duration-300 me-3.5" size={16} />

        {/* Real Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent border-none text-neutral-100 placeholder-neutral-500 font-light text-sm focus:outline-none focus:ring-0"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-neutral-500 hover:text-brand-light focus:outline-none p-1 cursor-pointer transition-colors duration-250"
            aria-label="Clear search query"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Result Status Indicator */}
      <div className="flex justify-between items-center px-2 mt-3 text-xs text-neutral-500">
        <span>{getResultText()}</span>
        <span className="hidden sm:inline italic">{instantSearchLabel}</span>
      </div>
    </div>
  );
}
