import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ProductCard from "../ProductCard/ProductCard";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductGrid({ products, activeCategory, onSelectCategory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const { t, lang } = useLanguage();

  // Filter products based on search query, active category, and featured status
  const filteredProducts = products.filter((product) => {
    // 1. Filter by category
    if (activeCategory !== "all" && product.category !== activeCategory) {
      return false;
    }

    // 2. Filter by featured status
    if (showOnlyFeatured && !product.featured) {
      return false;
    }

    // 3. Filter by search query (check all translations: English, Arabic, and Kurdish)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const matchesName = 
        (product.name.en && product.name.en.toLowerCase().includes(query)) ||
        (product.name.ar && product.name.ar.toLowerCase().includes(query)) ||
        (product.name.ku && product.name.ku.toLowerCase().includes(query));
      
      const matchesModel = product.model.toLowerCase().includes(query);
      
      const matchesCategory = 
        (product.categoryTrans?.en && product.categoryTrans.en.toLowerCase().includes(query)) ||
        (product.categoryTrans?.ar && product.categoryTrans.ar.toLowerCase().includes(query)) ||
        (product.categoryTrans?.ku && product.categoryTrans.ku.toLowerCase().includes(query));

      return matchesName || matchesModel || matchesCategory;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    onSelectCategory("all");
    setShowOnlyFeatured(false);
  };

  const emptyStateDesc = 
    lang === "ar"
      ? "لم نتمكن من العثور على أي أجهزة تطابق معايير البحث الحالية أو تصفية الفئات. حاول توسيع نطاق البحث أو إعادة تعيين الفلاتر النشطة."
      : lang === "ku"
        ? "نەمانتوانى هیچ بەرهەمێک بدۆزینەوە کە هاوتای مەرجەکانی گەڕانی ئێستات یان فلتەری هاوپۆلەکان بێت. هەوڵبدە گەڕانەکەت فراوانتر بکەیت یان فلتەرەکان پاک بکەیتەوە."
        : "We couldn't find any products matching your current search criteria or category filter. Try widening your search or resetting active filters.";

  return (
    <section id="products-section" className="py-24 bg-[#07070a] min-h-screen">
      <div id="products-grid-section" className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {t("gridLabel")}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
            {t("gridTitle")}
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base font-light">
            {t("gridSubtitle")}
          </p>
        </div>

        {/* Dashboard Control Bar */}
        <div className="mb-12">
          {/* Reactive Search */}
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
            resultCount={filteredProducts.length} 
          />

          {/* Toggle Tab (All vs Featured) */}
          <div className="flex justify-center items-center mt-6">
            <div className="inline-flex bg-[#0f0f15] p-1.5 rounded-xl border border-neutral-850">
              <button
                onClick={() => setShowOnlyFeatured(false)}
                className={`px-6 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  !showOnlyFeatured
                    ? "bg-brand text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t("tabAllProducts")}
              </button>
              <button
                onClick={() => setShowOnlyFeatured(true)}
                className={`px-6 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  showOnlyFeatured
                    ? "bg-brand text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t("tabFeatured")}
              </button>
            </div>
          </div>
        </div>

        {/* Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0f0f15]/30 rounded-3xl border border-neutral-900 px-6 max-w-xl mx-auto">
            <div className="text-4xl text-neutral-600 mb-4">🔍</div>
            <h3 className="text-lg font-bold text-white mb-2">{t("searchResultNone")}</h3>
            <p className="text-neutral-400 text-xs md:text-sm font-light mb-8 leading-relaxed">
              {emptyStateDesc}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-neutral-900 border border-neutral-880 hover:border-brand/40 text-neutral-200 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer"
            >
              {t("resetFilters")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
