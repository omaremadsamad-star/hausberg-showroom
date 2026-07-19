import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("hausberg-lang");
      return saved === "ar" || saved === "ku" || saved === "en" ? saved : "en";
    } catch (e) {
      return "en";
    }
  });

  const setLang = (newLang) => {
    if (newLang === "en" || newLang === "ar" || newLang === "ku") {
      setLangState(newLang);
      try {
        localStorage.setItem("hausberg-lang", newLang);
      } catch (e) {
        console.warn("Could not save language to localStorage", e);
      }
    }
  };

  // Keep DOM attributes in sync with active language context
  useEffect(() => {
    const isRtl = lang === "ar" || lang === "ku";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // Translation helper function
  const t = (key, replacements = {}) => {
    const dict = translations[lang] || translations.en;
    let val = dict[key];
    
    // Fallback to English if key is missing in active dialect
    if (val === undefined) {
      val = translations.en[key] || key;
    }

    // Apply any dynamic replacements (like {count} or {year})
    Object.entries(replacements).forEach(([k, v]) => {
      val = val.replace(`{${k}}`, v);
    });

    return val;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
