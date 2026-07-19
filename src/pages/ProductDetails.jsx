import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaGlobe, FaTag, FaCheck } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { products } from "../data/products";

export default function ProductDetails() {
  const { productId } = useParams();
  const { lang, t } = useLanguage();
  const isRtl = lang === "ar" || lang === "ku";

  // Find product by ID
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#07070a] pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-extrabold text-white mb-4">
          {lang === "ar" ? "المنتج غير موجود" : lang === "ku" ? "بەرهەمەکە نەدۆزرایەوە" : "Product Not Found"}
        </h1>
        <p className="text-neutral-450 text-sm mb-8 max-w-md">
          {lang === "ar" 
            ? "عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه. قد يكون تم إزالته أو تغيير رابطه." 
            : lang === "ku" 
              ? "ببورە، ناتوانین ئەو بەرهەمە بدۆزینەوە کە بەدوایدا دەگەڕێیت. ڕەنگە لادرابێت یان ناونیشانەکەی گۆڕابێت." 
              : "We couldn't find the product you're looking for. It may have been removed or the ID is incorrect."}
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-6 py-3 bg-brand text-black font-semibold rounded-xl text-sm transition-all duration-300 hover:opacity-90"
        >
          {isRtl ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{lang === "ar" ? "العودة لصالة العرض" : lang === "ku" ? "گەڕانەوە بۆ پێشانگا" : "Back to Showroom"}</span>
        </Link>
      </div>
    );
  }

  const { name, model, price, image, description, specifications } = product;

  // Resolve translations
  const localizedName = name[lang] || name["en"];
  const localizedDesc = description[lang] || description["en"];
  const localizedCategory = product.categoryTrans[lang] || product.categoryTrans["en"];

  // Price formatter
  const formatPrice = (priceIqd) => {
    const formattedNumStandard = new Intl.NumberFormat("en-US").format(priceIqd);
    const currencySuffix = lang === "ar" ? " د.ع" : lang === "ku" ? " دینار" : " IQD";
    const formattedIqd = `${formattedNumStandard}${currencySuffix}`;
    
    const approxUsd = Math.round(priceIqd / 1310);
    const formattedUsd = new Intl.NumberFormat("en-US").format(approxUsd);
    
    const usdText = 
      lang === "ar" 
        ? `${formattedUsd} $ تقريباً` 
        : lang === "ku" 
          ? `نزیکەی $${formattedUsd}` 
          : `$${formattedUsd} USD approx.`;
    
    return {
      iqd: formattedIqd,
      usd: usdText
    };
  };

  const prices = formatPrice(price);

  return (
    <div className="min-h-screen bg-[#07070a] pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation Breadcrumb / Back Button */}
        <div className="mb-10 flex items-center">
          <Link 
            to="/" 
            className="group flex items-center gap-2.5 text-neutral-450 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            {isRtl ? (
              <FaArrowRight className="transform group-hover:translate-x-0.5 transition-transform duration-200" />
            ) : (
              <FaArrowLeft className="transform group-hover:-translate-x-0.5 transition-transform duration-200" />
            )}
            <span>{lang === "ar" ? "العودة للمعرض" : lang === "ku" ? "گەڕانەوە بۆ پێشانگا" : "Back to Showroom"}</span>
          </Link>
        </div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-neutral-900 overflow-hidden bg-neutral-950/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              <img
                src={image}
                alt={localizedName}
                className="w-full h-auto max-h-[500px] object-cover mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              {/* Featured Badge */}
              {product.featured && (
                <span className="absolute top-6 start-6 text-[10px] font-extrabold tracking-widest text-black bg-brand px-3 py-1.5 rounded-full uppercase">
                  {lang === "ar" ? "مميز" : lang === "ku" ? "تایبەت" : "Featured"}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Content Details */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Model Code */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold tracking-widest text-brand border border-brand/35 bg-brand/5 px-3.5 py-1.5 rounded-full uppercase">
                  {model}
                </span>
                <span className="text-[10px] font-medium tracking-wide text-neutral-450 border border-neutral-900 bg-neutral-950 px-3.5 py-1.5 rounded-full">
                  {localizedCategory}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {localizedName}
              </h1>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-3.5 py-4 border-t border-b border-neutral-900/60">
                <span className="text-3xl font-black text-white tracking-wide">
                  {prices.iqd}
                </span>
                <span className="text-sm text-neutral-500 font-light">
                  ({prices.usd})
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {t("modalOverview")}
                </h3>
                <p className="text-neutral-350 text-base font-light leading-relaxed">
                  {localizedDesc}
                </p>
              </div>

              {/* Specifications Block */}
              {specifications && specifications.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    {t("modalTechSpecs")}
                  </h3>
                  <div className="bg-[#0f0f15]/30 border border-neutral-900 rounded-2xl overflow-hidden shadow-inner">
                    {specifications.map((spec, index) => {
                      const labelText = spec.label[lang] || spec.label["en"];
                      const valueText = spec.value[lang] || spec.value["en"];
                      return (
                        <div 
                          key={index}
                          className={`grid grid-cols-12 text-sm py-4 px-5 ${
                            index % 2 === 0 ? "bg-neutral-900/5" : "bg-neutral-900/20"
                          } ${
                            index !== specifications.length - 1 ? "border-b border-neutral-950/40" : ""
                          }`}
                        >
                          <span className="col-span-5 font-bold text-neutral-400 tracking-wider uppercase text-[10px] text-start flex items-center gap-2">
                            <FaTag className="text-brand/50 text-[8px]" />
                            {labelText}
                          </span>
                          <span className="col-span-7 text-neutral-200 font-light text-start leading-normal">
                            {valueText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Disclaimer & Action Card */}
            <div className="mt-10 p-6 rounded-2xl bg-[#0f0f15]/50 border border-neutral-900 space-y-4">
              <div className="flex items-start gap-3.5 text-xs text-neutral-450 leading-relaxed">
                <FaGlobe className="text-brand shrink-0 text-base mt-0.5 animate-[spin_10s_linear_infinite]" />
                <span>
                  {t("modalDisclaimer")}
                </span>
              </div>
              
              {/* Optional inquiry button to make it look even more premium */}
              <a 
                href="https://elryan.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-900 hover:bg-brand text-neutral-300 hover:text-black font-semibold text-xs rounded-xl tracking-wider uppercase border border-neutral-850 hover:border-transparent transition-all duration-300 cursor-pointer shadow-md"
              >
                <FaCheck />
                <span>
                  {lang === "ar" 
                    ? "طلب تسعير من الموزع" 
                    : lang === "ku" 
                      ? "داواکردنی نرخ لە بریکار" 
                      : "Request Dealer Quote"}
                </span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
