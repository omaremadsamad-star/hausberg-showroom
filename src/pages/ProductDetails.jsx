import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaGlobe, FaTag, FaCheck, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";

export default function ProductDetails() {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const { settings } = useApp();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRtl = lang === "ar" || lang === "ku";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.getProduct(slug);
        setProduct(res.data);
        setActiveImage(res.data.image);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] pt-32 pb-24 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

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
              : "We couldn't find the product you're looking for. It may have been removed or the URL is incorrect."}
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

  const { name, model, brand, sku, price, description, specifications = [], gallery_images = [], availability_status, has_active_discount, active_price, discount_percentage } = product;

  const localizedName = name[lang] || name["en"];
  const localizedDesc = description[lang] || description["en"];
  const localizedCategory = product.categoryTrans?.[lang] || product.categoryTrans?.["en"];

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
      <span className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  // Generate WhatsApp prefilled message
  const getWhatsappLink = () => {
    const rawNumber = settings?.whatsapp_number || "9647517897977";
    const cleanNumber = rawNumber.replace(/[^0-9]/g, "");
    
    let message = "";
    if (lang === "ar") {
      message = `مرحباً هوزبيرغ، أنا مهتم بشراء منتج ${brand} ${model} - ${localizedName}. يرجى تزويدي بتفاصيل التوفر والأسعار. (رمز المنتج SKU: ${sku})`;
    } else if (lang === "ku") {
      message = `سڵاو هاوسبێرگ، من ئارەزوومەندم لە کڕینی بەرهەمی ${brand} ${model} - ${localizedName}. تکایە زانیاری لەسەر بەردەستبوون و نرخ پێشکەش بکەن. (کۆدی بەرهەم SKU: ${sku})`;
    } else {
      message = `Hello Hausberg, I am interested in purchasing the product ${brand} ${model} - ${localizedName}. Please provide availability and pricing details. (SKU: ${sku})`;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

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
          
          {/* Left Column: Image Gallery Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-3xl border border-neutral-900 overflow-hidden bg-neutral-950/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              <img
                src={activeImage}
                alt={localizedName}
                className="w-full h-auto max-h-[500px] object-cover mx-auto transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              {/* Featured Badge */}
              {product.featured && (
                <span className="absolute top-6 start-6 text-[10px] font-extrabold tracking-widest text-black bg-brand px-3 py-1.5 rounded-full uppercase">
                  {lang === "ar" ? "مميز" : lang === "ku" ? "تایبەت" : "Featured"}
                </span>
              )}
            </div>

            {/* Thumbnail switcher if there are multiple images */}
            {gallery_images && gallery_images.length > 1 && (
              <div className="flex flex-wrap gap-3.5 justify-center">
                {gallery_images.map((img) => {
                  const isSelected = activeImage === img.path;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.path)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        isSelected ? "border-brand scale-105" : "border-neutral-900 hover:border-neutral-700/60 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.path} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Content Details */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category, Model, and Availability */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold tracking-widest text-brand border border-brand/35 bg-brand/5 px-3.5 py-1.5 rounded-full uppercase">
                  {model}
                </span>
                <span className="text-[10px] font-medium tracking-wide text-neutral-450 border border-neutral-900 bg-neutral-950 px-3.5 py-1.5 rounded-full">
                  {localizedCategory}
                </span>
                {getAvailabilityBadge()}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {localizedName}
              </h1>

              {/* Price Details with Active Discount support */}
              <div className="flex flex-wrap items-baseline gap-3.5 py-4 border-t border-b border-neutral-900/60">
                {has_active_discount ? (
                  <>
                    <span className="text-3xl font-black text-white tracking-wide">
                      {activePrices.iqd}
                    </span>
                    <span className="text-sm text-neutral-500 line-through">
                      {originalPrices.iqd}
                    </span>
                    <span className="text-xs font-bold text-black bg-brand px-2.5 py-1 rounded uppercase">
                      {discount_percentage}% {lang === "ar" ? "خصم" : lang === "ku" ? "داشکاندن" : "OFF"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-black text-white tracking-wide">
                      {originalPrices.iqd}
                    </span>
                    <span className="text-sm text-neutral-500 font-light">
                      ({originalPrices.usd})
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {t("modalOverview")}
                </h3>
                <p className="text-neutral-350 text-base font-light leading-relaxed whitespace-pre-line">
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
                          key={spec.id || index}
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

            {/* WhatsApp Call-to-Action Card */}
            <div className="mt-10 p-6 rounded-2xl bg-[#0f0f15]/50 border border-neutral-900 space-y-4">
              <div className="flex items-start gap-3.5 text-xs text-neutral-450 leading-relaxed">
                <FaGlobe className="text-brand shrink-0 text-base mt-0.5 animate-[spin_10s_linear_infinite]" />
                <span>
                  {t("modalDisclaimer")}
                </span>
              </div>
              
              <a 
                href={getWhatsappLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-950/30 border border-emerald-550/40 hover:-translate-y-0.5"
              >
                <FaWhatsapp className="text-base" />
                <span>
                  {lang === "ar" 
                    ? "اطلب الآن عبر واتساب" 
                    : lang === "ku" 
                      ? "داواکردن لە ڕێگەی واتسئەپ" 
                      : "Order Now via WhatsApp"}
                </span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
