import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { useApp } from "../../context/AppContext";

export default function Hero() {
  const { t, lang } = useLanguage();
  const { banner } = useApp();
  const isRtl = lang === "ar" || lang === "ku";

  const handleScrollToProducts = () => {
    const element = document.getElementById("products-section");
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

  const bgImage = banner?.image_path || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&auto=format&fit=crop";
  const localizedTitle = banner?.title?.[lang] || banner?.title?.['en'] || "Premium Home Appliances";
  const localizedSubtitle = banner?.subtitle?.[lang] || banner?.subtitle?.['en'] || t("heroDescription");
  const localizedBtnText = banner?.button_text?.[lang] || banner?.button_text?.['en'] || t("heroExploreBtn");

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background image with parallax scale effect and overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 animate-[zoom-out_20s_ease-out_infinite]"
        style={{
          backgroundImage: `url('${bgImage}')`
        }}
      />
      {/* Dark Vignette Overlays for Premium Brand Feeling */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-black/70 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/90 via-transparent to-[#07070a]/90" />
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center animate-fade-in-up">
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 border border-brand/30 px-4 py-1.5 rounded-full bg-brand/5 backdrop-blur-md mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
          <span className="text-xs uppercase tracking-[0.25em] text-brand-light font-semibold">
            {t("heroGermanQuality")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand to-brand-dark">
            {localizedTitle}
          </span>
        </h1>

        {/* Company Description */}
        <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12">
          {localizedSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={handleScrollToProducts}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand to-brand-dark text-black font-semibold rounded-lg hover:from-brand-light hover:to-brand transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 cursor-pointer text-center"
          >
            {localizedBtnText}
          </button>
          <button
            onClick={() => {
              const element = document.getElementById("categories-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full sm:w-auto px-8 py-4 border border-neutral-850 hover:border-neutral-700 bg-neutral-900/30 hover:bg-neutral-900/60 text-neutral-300 hover:text-white rounded-lg transition-all duration-300 backdrop-blur-md cursor-pointer text-center"
          >
            {t("heroBrowseBtn")}
          </button>
        </div>
      </div>

      {/* Smooth scroll indicator */}
      <div 
        onClick={handleScrollToProducts}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer text-neutral-500 hover:text-brand transition-colors duration-300"
      >
        <span className="text-xs uppercase tracking-[0.2em] mb-2 font-medium">{t("heroScrollDown")}</span>
        <FaChevronDown className="animate-bounce" />
      </div>
    </section>
  );
}
