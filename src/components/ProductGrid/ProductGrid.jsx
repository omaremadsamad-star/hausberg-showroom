import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ProductCard from "../ProductCard/ProductCard";
import Pagination from "../Pagination/Pagination";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";

export default function ProductGrid({ activeCategory, onSelectCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const { t, lang } = useLanguage();

  // Debounce search query to optimize API load
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset page when category or featured state toggles
  useEffect(() => {
    setPage(1);
  }, [activeCategory, showOnlyFeatured]);

  // Fetch products from Laravel API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({
        category: activeCategory,
        featured: showOnlyFeatured ? 1 : 0,
        search: debouncedSearch,
        sort: sortBy,
        page: page
      });
      setProducts(res.data || []);
      setTotalProducts(res.meta?.total ?? res.data?.length ?? 0);
      setLastPage(res.meta?.last_page ?? 1);
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, showOnlyFeatured, debouncedSearch, sortBy, page]);

  const handleResetFilters = () => {
    setSearchQuery("");
    onSelectCategory("all");
    setShowOnlyFeatured(false);
    setSortBy("featured");
    setPage(1);
  };

  const emptyStateDesc = 
    lang === "ar"
      ? "لم نتمكن من العثور على أي أجهزة تطابق معايير البحث الحالية أو تصفية الفئات. حاول توسيع نطاق البحث أو إعادة تعيين الفلاتر النشطة."
      : lang === "ku"
        ? "نەمانتوانى هیچ بەرهەمێک بدۆزینەوە کە هاوتای مەرجەکانی گەڕانی ئێستات یان فلتەری هاوپۆلەکان بێت. هەوڵبدە گەڕانەکەت فراوانتر بکەیت یان فلتەرەکان پاک بکەیتەوە."
        : "We couldn't find any products matching your current search criteria or category filter. Try widening your search or resetting active filters.";

  const getSortLabel = (key) => {
    const labels = {
      en: {
        featured: "Featured First",
        newest: "Newest",
        oldest: "Oldest",
        price_low: "Price: Low → High",
        price_high: "Price: High → Low",
        name_asc: "Name: A → Z",
        name_desc: "Name: Z → A",
        discount: "Biggest Discount"
      },
      ar: {
        featured: "المميز أولاً",
        newest: "الأحدث",
        oldest: "الأقدم",
        price_low: "السعر: من الأقل للأعلى",
        price_high: "السعر: من الأعلى للأقل",
        name_asc: "الاسم: أ → ي",
        name_desc: "الاسم: ي → أ",
        discount: "أكبر خصم"
      },
      ku: {
        featured: "تایبەتەکان یەکەم جار",
        newest: "نوێترین",
        oldest: "کۆنترین",
        price_low: "نرخ: کەم بۆ زۆر",
        price_high: "نرخ: زۆر بۆ کەم",
        name_asc: "ناو: أ → ي",
        name_desc: "ناو: ي → أ",
        discount: "گەورەترین داشکاندن"
      }
    };
    return labels[lang]?.[key] || labels.en[key];
  };

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

        <div className="mb-12">
          {/* Reactive Search */}
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
            resultCount={totalProducts} 
          />

          {/* Toggle Tab (All vs Featured) & Sorting Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-6 max-w-2xl mx-auto">
            {/* Featured filter toggle */}
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

            {/* Sorting Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="bg-[#0f0f15] border border-neutral-850 hover:border-neutral-700 text-neutral-300 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-brand/60 cursor-pointer transition-all duration-200"
              >
                <option value="featured">{getSortLabel("featured")}</option>
                <option value="newest">{getSortLabel("newest")}</option>
                <option value="oldest">{getSortLabel("oldest")}</option>
                <option value="price_low">{getSortLabel("price_low")}</option>
                <option value="price_high">{getSortLabel("price_high")}</option>
                <option value="name_asc">{getSortLabel("name_asc")}</option>
                <option value="name_desc">{getSortLabel("name_desc")}</option>
                <option value="discount">{getSortLabel("discount")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
          </div>
        ) : (
          /* Grid or Empty State */
          <>
            {products.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={page}
                  lastPage={lastPage}
                  onPageChange={setPage}
                />
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
          </>
        )}
      </div>
    </section>
  );
}
