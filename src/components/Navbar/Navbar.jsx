import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  
  const navigate = useNavigate();
  const location = useLocation();

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const isRtl = lang === "ar" || lang === "ku";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setIsDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScrollTo = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavClick = (path, sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== path) {
      navigate(path);
      if (sectionId) {
        setTimeout(() => {
          handleScrollTo(sectionId);
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (sectionId) {
        handleScrollTo(sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "ku", label: "کوردی" }
  ];

  const currentLanguageLabel = languages.find((l) => l.code === lang)?.label || "English";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        isScrolled
          ? "bg-black/85 backdrop-blur-md border-neutral-900/60 py-4 shadow-xl"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* LOGO */}
        <div
          onClick={() => handleNavClick("/", null)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center font-extrabold text-black tracking-tight text-xl transform group-hover:scale-105 transition-transform duration-300">
            H
          </div>
          <span className="font-bold text-xl uppercase tracking-widest text-neutral-100 group-hover:text-brand transition-colors duration-300">
            Hausberg
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick("/", null)}
            className="text-sm font-medium tracking-wide text-neutral-300 hover:text-brand transition-colors duration-200 cursor-pointer"
          >
            {t("navHome")}
          </button>
          <button
            onClick={() => handleNavClick("/", "products-section")}
            className="text-sm font-medium tracking-wide text-neutral-300 hover:text-brand transition-colors duration-200 cursor-pointer"
          >
            {t("navProducts")}
          </button>
          <button
            onClick={() => handleNavClick("/", "categories-section")}
            className="text-sm font-medium tracking-wide text-neutral-300 hover:text-brand transition-colors duration-200 cursor-pointer"
          >
            {t("navCategories")}
          </button>
          <button
            onClick={() => handleNavClick("/about", null)}
            className="text-sm font-medium tracking-wide text-neutral-300 hover:text-brand transition-colors duration-200 cursor-pointer"
          >
            {t("navAbout")}
          </button>
          <button
            onClick={() => handleNavClick("/", "contact-section")}
            className="text-sm font-medium tracking-wide text-neutral-300 hover:text-brand transition-colors duration-200 cursor-pointer"
          >
            {t("navContact")}
          </button>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {/* Showroom Badge */}
          <div className="flex items-center text-[10px] uppercase font-semibold text-neutral-400 gap-1.5 border border-neutral-800 px-3 py-1.5 rounded-full bg-neutral-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
            <span>{t("navShowroomMode")}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-brand border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 rounded-full transition-all duration-300 cursor-pointer"
            >
              <FaGlobe className="text-brand shrink-0 animate-[spin_20s_linear_infinite]" />
              <span>{currentLanguageLabel}</span>
            </button>

            {isDesktopDropdownOpen && (
              <div className={`absolute top-full mt-2 ${isRtl ? "left-0" : "right-0"} w-32 bg-[#0f0f15] border border-neutral-850 rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in`}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsDesktopDropdownOpen(false);
                    }}
                    className={`w-full text-start px-4 py-2.5 text-xs transition-colors duration-200 cursor-pointer ${
                      lang === l.code
                        ? "bg-brand text-black font-semibold"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-brand"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE & LANGUAGE GLOBE */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile direct lang quick toggle dropdown */}
          <div className="relative" ref={mobileDropdownRef}>
            <button
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className="p-2 text-neutral-400 hover:text-brand hover:bg-neutral-900/50 rounded-full cursor-pointer"
              aria-label="Select language"
            >
              <FaGlobe size={18} />
            </button>
            {isMobileDropdownOpen && (
              <div className={`absolute top-full mt-2 ${isRtl ? "left-0" : "right-0"} w-32 bg-[#0f0f15] border border-neutral-850 rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in`}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsMobileDropdownOpen(false);
                    }}
                    className={`w-full text-start px-4 py-2.5 text-xs transition-colors duration-200 cursor-pointer ${
                      lang === l.code
                        ? "bg-brand text-black font-semibold"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-brand"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-neutral-300 hover:text-brand focus:outline-none cursor-pointer p-1.5"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-y-0 ${isRtl ? "left-0 border-r" : "right-0 border-l"} w-64 bg-neutral-950/95 backdrop-blur-lg border-neutral-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen 
            ? "translate-x-0 shadow-2xl" 
            : isRtl ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-neutral-300 hover:text-brand focus:outline-none p-1 cursor-pointer"
          >
            <FaTimes size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-6 px-8 pt-4">
          <button
            onClick={() => handleNavClick("/", null)}
            className="text-start font-medium text-lg text-neutral-300 hover:text-brand transition-colors duration-200"
          >
            {t("navHome")}
          </button>
          <button
            onClick={() => handleNavClick("/", "products-section")}
            className="text-start font-medium text-lg text-neutral-300 hover:text-brand transition-colors duration-200"
          >
            {t("navProducts")}
          </button>
          <button
            onClick={() => handleNavClick("/", "categories-section")}
            className="text-start font-medium text-lg text-neutral-300 hover:text-brand transition-colors duration-200"
          >
            {t("navCategories")}
          </button>
          <button
            onClick={() => handleNavClick("/about", null)}
            className="text-start font-medium text-lg text-neutral-300 hover:text-brand transition-colors duration-200"
          >
            {t("navAbout")}
          </button>
          <button
            onClick={() => handleNavClick("/", "contact-section")}
            className="text-start font-medium text-lg text-neutral-300 hover:text-brand transition-colors duration-200"
          >
            {t("navContact")}
          </button>
          
          <div className="pt-6 border-t border-neutral-900 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
              {t("navShowroomMode")}
            </span>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    lang === l.code
                      ? "bg-brand text-black"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
