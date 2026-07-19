import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Categories from "./components/Categories/Categories";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import ProductModal from "./components/ProductModal/ProductModal";
import Footer from "./components/Footer/Footer";
import { products } from "./data/products";
import { FaAward, FaShieldAlt, FaLeaf } from "react-icons/fa";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

function MainShowroom() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t, lang } = useLanguage();

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
  };

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const isRtl = lang === "ar" || lang === "ku";

  return (
    <div className="relative min-h-screen bg-[#07070a] text-neutral-100 selection:bg-brand selection:text-black overflow-x-hidden">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero Banner */}
      <Hero />

      {/* 3. Categories Filtering Panel */}
      <Categories 
        activeCategory={activeCategory} 
        onSelectCategory={handleSelectCategory} 
      />

      {/* 4. Interactive Product Grid (Search + Cards) */}
      <ProductGrid 
        products={products} 
        onViewDetails={handleOpenDetails} 
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 5. Brand Legacy / About Section */}
      <section id="about-section" className="py-24 bg-[#0a0a0f] border-t border-b border-neutral-900/60 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className={`absolute bottom-0 ${isRtl ? "left-0" : "right-0"} w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px] pointer-events-none`} />

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Column 1: Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand block">
                {t("aboutLabel")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {t("aboutTitle")} <br />
                <span className="text-neutral-400 font-light">{t("aboutSubtitle")}</span>
              </h2>
              <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
                {t("aboutDesc")}
              </p>

              {/* Pillars list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="space-y-2">
                  <FaShieldAlt className="text-brand" size={20} />
                  <h4 className="text-sm font-bold text-white tracking-wide">{t("pillar1Title")}</h4>
                  <p className="text-neutral-450 text-[11px] font-light leading-relaxed">
                    {t("pillar1Desc")}
                  </p>
                </div>
                <div className="space-y-2">
                  <FaAward className="text-brand" size={20} />
                  <h4 className="text-sm font-bold text-white tracking-wide">{t("pillar2Title")}</h4>
                  <p className="text-neutral-450 text-[11px] font-light leading-relaxed">
                    {t("pillar2Desc")}
                  </p>
                </div>
                <div className="space-y-2">
                  <FaLeaf className="text-brand" size={20} />
                  <h4 className="text-sm font-bold text-white tracking-wide">{t("pillar3Title")}</h4>
                  <p className="text-neutral-450 text-[11px] font-light leading-relaxed">
                    {t("pillar3Desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Image Card */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl opacity-50 transition-all duration-500" />
              <div className="relative rounded-2xl border border-neutral-850 overflow-hidden bg-neutral-950 aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
                  alt="Minimalist design interior"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className={`absolute bottom-6 ${isRtl ? "right-6" : "left-6"} right-6`}>
                  <p className="text-[10px] font-bold tracking-widest text-brand uppercase mb-1">
                    {t("heroGermanQuality")}
                  </p>
                  <p className="text-sm font-bold text-white">
                    {t("navShowroomMode")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer Brand Information */}
      <Footer />

      {/* 7. Product Detail Modal overlay */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainShowroom />
    </LanguageProvider>
  );
}
