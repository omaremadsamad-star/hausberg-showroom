import React, { useEffect } from "react";
import { FaTimes, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const { lang, t } = useLanguage();
  const { name, model, price, image, description, specifications } = product;

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Resolve translations
  const localizedName = name[lang] || name["en"];
  const localizedDesc = description[lang] || description["en"];
  const localizedCategory = product.categoryTrans[lang] || product.categoryTrans["en"];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Content Wrapper */}
      <div className="relative w-full max-w-5xl bg-[#0f0f15] border border-neutral-850 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 transform animate-fade-in-up my-8 max-h-[90vh] flex flex-col">
        
        {/* Close Button Top Right (Logical positioning: end-5 places it left on RTL, right on LTR) */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 z-20 p-2.5 rounded-full bg-black/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-900 hover:border-neutral-750 transition-all duration-200 cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Column */}
            <div className="relative aspect-4/3 lg:aspect-square bg-neutral-950 flex items-center justify-center border-b lg:border-b-0 lg:border-e border-neutral-900/60">
              <img
                src={image}
                alt={localizedName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f15] via-transparent to-transparent opacity-30" />
            </div>

            {/* Content Column */}
            <div className="p-6 md:p-10 flex flex-col justify-between">
              <div>
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-[10px] font-bold tracking-widest text-brand border border-brand/40 bg-brand/5 px-3 py-1 rounded-full uppercase">
                    {model}
                  </span>
                  <span className="text-[10px] font-medium tracking-wide text-neutral-400 border border-neutral-850 bg-neutral-900 px-3 py-1 rounded-full">
                    {localizedCategory}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  {localizedName}
                </h2>

                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-3 mb-6 pb-6 border-b border-neutral-900">
                  <span className="text-2xl font-bold text-brand-light tracking-wide">
                    {prices.iqd}
                  </span>
                  <span className="text-sm text-neutral-500">
                    ({prices.usd})
                  </span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
                    {t("modalOverview")}
                  </h3>
                  <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">
                    {localizedDesc}
                  </p>
                </div>

                {/* Technical Specifications */}
                {specifications && specifications.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">
                      {t("modalTechSpecs")}
                    </h3>
                    <div className="bg-[#07070a] border border-neutral-900 rounded-xl overflow-hidden">
                      {specifications.map((spec, index) => {
                        const labelText = spec.label[lang] || spec.label["en"];
                        const valueText = spec.value[lang] || spec.value["en"];
                        return (
                          <div 
                            key={index}
                            className={`grid grid-cols-12 text-xs py-3 px-4 ${
                              index % 2 === 0 ? "bg-neutral-900/10" : "bg-neutral-900/30"
                            } ${
                              index !== specifications.length - 1 ? "border-b border-neutral-950/40" : ""
                            }`}
                          >
                            <span className="col-span-5 font-semibold text-neutral-400 tracking-wide uppercase text-[10px] text-start">
                              {labelText}
                            </span>
                            <span className="col-span-7 text-neutral-200 font-light text-start">
                              {valueText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Showroom Disclaimer / Details */}
              <div className="mt-6 pt-6 border-t border-neutral-900 flex items-center gap-3 text-xs text-neutral-500">
                <FaGlobe className="text-brand shrink-0 animate-[spin_10s_linear_infinite]" />
                <span className="leading-relaxed">
                  {t("modalDisclaimer")}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
