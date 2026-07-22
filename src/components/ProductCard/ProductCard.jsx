import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage();
  const { name, model, image, price, description, slug, availability_status, has_active_discount, active_price, discount_percentage } = product;

  const isRtl = lang === "ar" || lang === "ku";

  const localizedName = name[lang] || name["en"];
  const localizedDesc = description[lang] || description["en"];
  const localizedCategory = product.categoryTrans?.[lang] || product.categoryTrans?.['en'] || product.category;

  const formatPrice = (priceIqd) => {
    const formattedNumStandard = new Intl.NumberFormat("en-US").format(priceIqd);
    const currencySuffix = lang === "ar" ? " د.ع" : lang === "ku" ? " دینار" : " IQD";
    const formattedIqd = `${formattedNumStandard}${currencySuffix}`;
    
    const approxUsd = Math.round(priceIqd / 1310);
    const formattedUsd = new Intl.NumberFormat("en-US").format(approxUsd);
    
    const usdText = 
      lang === "ar" 
        ? `(${formattedUsd} $ تقريباً)` 
        : lang === "ku" 
          ? `(نزیکەی $${formattedUsd})` 
          : `($${formattedUsd} USD approx.)`;
    
    return {
      iqd: formattedIqd,
      usd: usdText
    };
  };

  const activePrices = formatPrice(active_price);
  const originalPrices = formatPrice(price);

  const getAvailabilityBadge = () => {
    const status = availability_status;
    const config = {
      'Available': {
        text: lang === "ar" ? "✓ متوفر" : lang === "ku" ? "✓ بەردەستە" : "✓ Available",
        class: "text-emerald-450 border-emerald-500/20 bg-emerald-950/80"
      },
      'Coming Soon': {
        text: lang === "ar" ? "⚠ قريباً" : lang === "ku" ? "⚠ بەم زووانە" : "⚠ Coming Soon",
        class: "text-amber-450 border-amber-500/20 bg-amber-950/80"
      },
      'Out Of Stock': {
        text: lang === "ar" ? "✖ غير متوفر" : lang === "ku" ? "✖ بەردەست نییە" : "✖ Out Of Stock",
        class: "text-rose-450 border-rose-500/20 bg-rose-950/80"
      },
      'Discontinued': {
        text: lang === "ar" ? "⛔ متوقف" : lang === "ku" ? "⛔ بەرهەمناهێنرێت" : "⛔ Discontinued",
        class: "text-neutral-400 border-neutral-700/20 bg-neutral-900/80"
      }
    };
    const badge = config[status] || config['Available'];
    return (
      <span className={`absolute top-4 end-4 text-[9px] font-bold tracking-wider px-2.5 py-1.5 rounded-full border backdrop-blur-md ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div 
      className="group relative bg-[#0f0f15]/40 hover:bg-neutral-900/30 rounded-2xl border border-neutral-900 hover:border-brand/30 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)] hover:-translate-y-1.5"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-neutral-950 overflow-hidden border-b border-neutral-900/40">
        <img
          src={image}
          alt={localizedName}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        {/* Hover overlay sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {/* Model Code Badge */}
        <span className="absolute top-4 start-4 text-[10px] font-bold tracking-widest text-brand bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-850">
          {model}
        </span>

        {/* Availability Badge */}
        {getAvailabilityBadge()}

        {/* Category Tag */}
        <span className="absolute bottom-4 start-4 text-[10px] font-medium tracking-wide text-neutral-300 bg-neutral-900/75 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-800/40">
          {localizedCategory}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Price Tag */}
          <div className="flex flex-wrap items-baseline gap-2 mb-3">
            {has_active_discount ? (
              <>
                <span className="text-lg font-bold text-white tracking-wide">
                  {activePrices.iqd}
                </span>
                <span className="text-xs text-neutral-500 line-through">
                  {originalPrices.iqd}
                </span>
                <span className="text-[9px] font-extrabold text-black bg-brand px-2 py-0.5 rounded ms-1 uppercase">
                  {discount_percentage}% {lang === "ar" ? "خصم" : lang === "ku" ? "داشکاندن" : "OFF"}
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-white tracking-wide">
                  {originalPrices.iqd}
                </span>
                <span className="text-xs text-neutral-500">
                  {originalPrices.usd}
                </span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-brand transition-colors duration-300">
            {localizedName}
          </h3>

          {/* Short Description */}
          <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">
            {localizedDesc}
          </p>
        </div>

        {/* Action Button */}
        <Link
          to={`/product/${slug}`}
          className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 group-hover:bg-brand text-neutral-300 group-hover:text-black font-semibold text-xs rounded-xl tracking-wider uppercase border border-neutral-850 group-hover:border-transparent transition-all duration-300 shadow-md cursor-pointer text-center"
        >
          <span>{t("viewDetails")}</span>
          {isRtl ? (
            <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform duration-300 text-xs" />
          ) : (
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
          )}
        </Link>
      </div>
    </div>
  );
}
