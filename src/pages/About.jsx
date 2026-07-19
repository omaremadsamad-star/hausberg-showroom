import React from "react";
import { FaAward, FaShieldAlt, FaLeaf, FaHistory, FaCheckCircle, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar" || lang === "ku";

  return (
    <div className="min-h-screen bg-[#07070a] pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand block">
            {t("aboutLabel")}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {t("aboutTitle")} <span className="text-neutral-400 font-light">{t("aboutSubtitle")}</span>
          </h1>
          <div className="h-1 w-20 bg-brand mx-auto mt-6 rounded-full" />
        </div>

        {/* Corporate Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              {lang === "ar" 
                ? "دقة الهندسة، رفاهية العيش" 
                : lang === "ku" 
                  ? "وردەکاری ئەندازیاری، لوکسی ژیان" 
                  : "Engineering Precision, Elevating Life"}
            </h2>
            <p className="text-neutral-300 text-base font-light leading-relaxed">
              {t("aboutDesc")}
            </p>
            <p className="text-neutral-455 text-sm font-light leading-relaxed">
              {lang === "ar"
                ? "تلتزم هاوسبيرغ بتزويد الأسر بأجهزة لا تسهل الأعمال المنزلية فحسب، بل تصبح جزءًا لا يتجزأ من التصميم الداخلي الحديث. تم تصميم كل تفصيل بدقة متناهية لتحقيق الكفاءة والأناقة."
                : lang === "ku"
                  ? "هاوسبێرگ پابەندە بە دابینکردنی ئامێرگەلێک بۆ ماڵەکان کە نەک تەنها ئەرکەکان ئاسان بکەن، بەڵکو ببنە بەشێکی سەرەکی لە دیزاینی ناوخۆیی مۆدێرن. هەموو وردەکارییەک بە وردی دیزاین کراوە بۆ کارایی و جوانی."
                  : "Hausberg is dedicated to providing households with appliances that don't just ease daily chores, but integrate seamlessly as key design elements of modern interiors. Every control, texture, and component is carefully selected to meet strict quality guidelines."}
            </p>
          </div>

          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl opacity-50 transition-all duration-500" />
            <div className="relative rounded-2xl border border-neutral-850 overflow-hidden bg-neutral-950 aspect-4/3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
                alt="Minimalist design interior"
                className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
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

        {/* Pillars Grid */}
        <div className="border-t border-neutral-900/60 pt-20">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {lang === "ar" ? "ركائز التميز لدينا" : lang === "ku" ? "کۆڵەکەکانی سەرکەوتنمان" : "Our Core Pillars of Excellence"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* German Integrity */}
            <div className="bg-[#0f0f15]/50 border border-neutral-900 rounded-2xl p-8 hover:border-brand/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                <FaShieldAlt size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t("pillar1Title")}</h4>
              <p className="text-neutral-400 text-sm font-light leading-relaxed">
                {t("pillar1Desc")}
              </p>
            </div>

            {/* Ergonomic Design */}
            <div className="bg-[#0f0f15]/50 border border-neutral-900 rounded-2xl p-8 hover:border-brand/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                <FaAward size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t("pillar2Title")}</h4>
              <p className="text-neutral-400 text-sm font-light leading-relaxed">
                {t("pillar2Desc")}
              </p>
            </div>

            {/* Eco-Conscious */}
            <div className="bg-[#0f0f15]/50 border border-neutral-900 rounded-2xl p-8 hover:border-brand/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                <FaLeaf size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t("pillar3Title")}</h4>
              <p className="text-neutral-400 text-sm font-light leading-relaxed">
                {t("pillar3Desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Global Standards Map Info */}
        <div className="mt-24 bg-[#0a0a0f] border border-neutral-900/60 rounded-3xl p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10">
            <div className="flex items-center gap-3 text-brand">
              <FaGlobe size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === "ar" ? "الانتشار والخدمة" : lang === "ku" ? "کۆمەڵە و بڵاوبوونەوە" : "Global Distribution & Reach"}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {lang === "ar" ? "صالة عرض معتمدة في العراق" : lang === "ku" ? "پێشانگای فەرمی لە عێراق" : "Authorized Presence in Iraq"}
            </h3>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              {lang === "ar"
                ? "تتوفر منتجات هاوسبيرغ الأصلية في جميع أنحاء العراق من خلال قنوات التوزيع والشركاء المعتمدين، مع الالتزام التام بخدمات الضمان وقطع الغيار الأصلية."
                : lang === "ku"
                  ? "بەرهەمە ڕەسەنەکانی هاوسبێرگ لە سەرانسەری عێراق لە ڕێگەی کەناڵەکانی دابەشکردن و هاوبەشە فەرمییەکانمانەوە بەردەستن، لەگەڵ پابەندبوونی تەواو بە خزمەتگوزارییەکانی گەرەنتی و پارچەی ڕەسەن."
                  : "Hausberg products are available across Iraq via premium distribution channels and authorized dealers, maintaining strict adherence to German manufacturing excellence and comprehensive customer service."}
            </p>
            <div className="pt-2 text-xs text-neutral-500 font-light flex items-center gap-2">
              <FaCheckCircle className="text-brand" />
              <span>{t("footerAddress")}</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center z-10">
            <div className="w-32 h-32 md:w-40 md:w-40 rounded-full border border-neutral-800 bg-neutral-950 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-2xl md:text-3xl font-black text-brand">100%</span>
              <span className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest mt-1">
                {lang === "ar" ? "أصلي" : lang === "ku" ? "ڕەسەن" : "Genuine"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
