import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhoneAlt,
  FaClock
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { useApp } from "../../context/AppContext";

export default function Footer() {
  const { t, lang } = useLanguage();
  const { settings } = useApp();
  const isRtl = lang === "ar" || lang === "ku";
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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

  const hoursLabel = 
    lang === "ar" 
      ? "٩:٠٠ ص – ١١:٠٠ م" 
      : lang === "ku" 
        ? "٩:٠٠ی بەیانی – ١١:٠٠ی شەو" 
        : "9:00 AM – 11:00 PM";

  return (
    <footer className="bg-black border-t border-neutral-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Branding & Intro */}
        <div>
          <div className="flex items-center gap-2 mb-6 group cursor-pointer" onClick={() => handleNavClick("/", null)}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center font-extrabold text-black tracking-tight text-xl">
              H
            </div>
            <span className="font-bold text-xl uppercase tracking-widest text-neutral-100 group-hover:text-brand transition-colors duration-300">
              Hausberg
            </span>
          </div>
          <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mb-6">
            {t("footerDesc")}
          </p>
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href={settings?.socials?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-neutral-900 hover:bg-brand hover:text-black text-neutral-400 transition-all duration-300 border border-neutral-850 hover:border-transparent" aria-label="Facebook">
              <FaFacebookF size={14} />
            </a>
            <a href={settings?.socials?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-neutral-900 hover:bg-brand hover:text-black text-neutral-400 transition-all duration-300 border border-neutral-850 hover:border-transparent" aria-label="Instagram">
              <FaInstagram size={14} />
            </a>
            <a href={settings?.socials?.twitter || "#"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-neutral-900 hover:bg-brand hover:text-black text-neutral-400 transition-all duration-300 border border-neutral-850 hover:border-transparent" aria-label="Twitter">
              <FaTwitter size={14} />
            </a>
            <a href={settings?.socials?.youtube || "#"} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-neutral-900 hover:bg-brand hover:text-black text-neutral-400 transition-all duration-300 border border-neutral-850 hover:border-transparent" aria-label="Youtube">
              <FaYoutube size={14} />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">
            {t("footerNavHeader")}
          </h4>
          <ul className="space-y-3.5 text-xs md:text-sm text-neutral-400">
            <li>
              <button onClick={() => handleNavClick("/", null)} className="hover:text-brand transition-colors duration-200 cursor-pointer text-start bg-transparent border-none p-0">
                {t("navHome")}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("/", "products-section")} className="hover:text-brand transition-colors duration-200 cursor-pointer text-start bg-transparent border-none p-0">
                {t("navProducts")}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("/", "categories-section")} className="hover:text-brand transition-colors duration-200 cursor-pointer text-start bg-transparent border-none p-0">
                {t("navCategories")}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("/about", null)} className="hover:text-brand transition-colors duration-200 cursor-pointer text-start bg-transparent border-none p-0">
                {t("navAbout")}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("/", "contact-section")} className="hover:text-brand transition-colors duration-200 cursor-pointer text-start bg-transparent border-none p-0">
                {t("navContact")}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Showroom Details */}
        <div id="contact-section">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">
            {t("footerShowroomHeader")}
          </h4>
          <ul className="space-y-4 text-xs md:text-sm text-neutral-400">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-brand mt-1 shrink-0" size={14} />
              <span className="leading-relaxed text-start">
                {settings?.address?.[lang] || settings?.address?.['en'] || t("footerAddress")}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-brand shrink-0" size={14} />
              <span dir="ltr">{settings?.phone_number || "0750 964 8944"}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-brand shrink-0" size={14} />
              <span dir="ltr">{settings?.email || "showroom@hausberg-appliances.com"}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Hours */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">
            {t("footerHoursHeader")}
          </h4>
          <div className="flex items-start gap-3 text-xs md:text-sm text-neutral-400">
            <FaClock className="text-brand mt-1 shrink-0" size={14} />
            <div className="space-y-1 text-start">
              <p>{t("footerSaturdayThursday")}</p>
              <p className="text-white font-medium">{hoursLabel}</p>
              <p className="text-neutral-500">{t("footerClosedFridays")}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
        <p className="text-center sm:text-start">
          {t("footerCopyright", { year: new Date().getFullYear() })}
        </p>
        <div className="flex gap-6 flex-wrap justify-center">
          <a href="#" className="hover:text-brand transition-colors duration-250">{t("footerPrivacy")}</a>
          <a href="#" className="hover:text-brand transition-colors duration-250">{t("footerAgreement")}</a>
          <a href="#" className="hover:text-brand transition-colors duration-250">{t("footerImprint")}</a>
        </div>
      </div>
    </footer>
  );
}
