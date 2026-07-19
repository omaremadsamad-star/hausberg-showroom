import React from "react";
import { 
  MdKitchen, 
  MdBlender, 
  MdCleaningServices, 
  MdLocalLaundryService, 
  MdFireplace, 
  MdAcUnit,
  MdLayers
} from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

const getCategoryList = (t) => [
  {
    id: "all",
    name: t("catAllTitle"),
    description: t("catAllDesc"),
    icon: MdLayers,
  },
  {
    id: "Kitchen Appliances",
    name: t("catKitchenTitle"),
    description: t("catKitchenDesc"),
    icon: MdKitchen,
  },
  {
    id: "Food Preparation",
    name: t("catPrepTitle"),
    description: t("catPrepDesc"),
    icon: MdBlender,
  },
  {
    id: "Cleaning",
    name: t("catCleaningTitle"),
    description: t("catCleaningDesc"),
    icon: MdCleaningServices,
  },
  {
    id: "Laundry",
    name: t("catLaundryTitle"),
    description: t("catLaundryDesc"),
    icon: MdLocalLaundryService,
  },
  {
    id: "Heating",
    name: t("catHeatingTitle"),
    description: t("catHeatingDesc"),
    icon: MdFireplace,
  },
  {
    id: "Cooling",
    name: t("catCoolingTitle"),
    description: t("catCoolingDesc"),
    icon: MdAcUnit,
  }
];

export default function Categories({ activeCategory, onSelectCategory }) {
  const { t, lang } = useLanguage();
  const categoryList = getCategoryList(t);
  const activeLabel = lang === "ar" ? "نشط" : lang === "ku" ? "چالاک" : "Active";

  return (
    <section id="categories-section" className="py-20 bg-gradient-to-b from-[#07070a] to-[#0b0b0f] border-b border-neutral-900/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {t("catLabel")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3 mb-4 tracking-tight">
            {t("catTitle")}
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base font-light">
            {t("catSubtitle")}
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryList.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  // Scroll to products grid after selection
                  const element = document.getElementById("products-grid-section");
                  if (element) {
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className={`relative group p-6 rounded-2xl border cursor-pointer transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[180px] ${
                  isActive
                    ? "bg-neutral-900/80 border-brand/60 shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
                    : "bg-[#0f0f15]/50 hover:bg-neutral-900/40 border-neutral-850 hover:border-neutral-700/70"
                }`}
              >
                {/* Decorative gold spotlight on active / hover */}
                <div 
                  className={`absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none transform translate-x-8 -translate-y-8 transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`} 
                />

                <div>
                  {/* Icon */}
                  <div className="mb-6 flex justify-between items-start">
                    <div 
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-brand text-black" 
                          : "bg-neutral-900 text-neutral-400 group-hover:text-brand group-hover:bg-neutral-850"
                      }`}
                    >
                      <IconComponent size={24} />
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold tracking-wider uppercase text-brand border border-brand/45 px-2.5 py-0.5 rounded-full bg-brand/5">
                        {activeLabel}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-brand transition-colors duration-300">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs mt-2 font-light leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Subtle bottom border accent on active */}
                <div 
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand to-brand-dark transition-all duration-500 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
