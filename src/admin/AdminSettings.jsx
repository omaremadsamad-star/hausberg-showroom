import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { FaSave, FaCog, FaImage, FaSpinner } from "react-icons/fa";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("settings"); // 'settings' or 'banner'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Settings State
  const [companyName, setCompanyName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [addressAr, setAddressAr] = useState("");
  const [addressKu, setAddressKu] = useState("");
  const [fbUrl, setFbUrl] = useState("");
  const [igUrl, setIgUrl] = useState("");
  const [twUrl, setTwUrl] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Banner State
  const [bannerImage, setBannerImage] = useState("");
  const [bannerTitleEn, setBannerTitleEn] = useState("");
  const [bannerTitleAr, setBannerTitleAr] = useState("");
  const [bannerTitleKu, setBannerTitleKu] = useState("");
  const [bannerSubtitleEn, setBannerSubtitleEn] = useState("");
  const [bannerSubtitleAr, setBannerSubtitleAr] = useState("");
  const [bannerSubtitleKu, setBannerSubtitleKu] = useState("");
  const [bannerBtnTextEn, setBannerBtnTextEn] = useState("");
  const [bannerBtnTextAr, setBannerBtnTextAr] = useState("");
  const [bannerBtnTextKu, setBannerBtnTextKu] = useState("");
  const [bannerBtnLink, setBannerBtnLink] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminSettings();
      const { settings, banner } = res.data;

      if (settings) {
        setCompanyName(settings.company_name);
        setWhatsappNumber(settings.whatsapp_number);
        setPhoneNumber(settings.phone_number);
        setEmail(settings.email);
        setAddressEn(settings.address_en);
        setAddressAr(settings.address_ar);
        setAddressKu(settings.address_ku);
        setFbUrl(settings.facebook_url || "");
        setIgUrl(settings.instagram_url || "");
        setTwUrl(settings.twitter_url || "");
        setYtUrl(settings.youtube_url || "");
        setMaintenanceMode(!!settings.maintenance_mode);
      }

      if (banner) {
        setBannerImage(banner.image_path);
        setBannerTitleEn(banner.title_en);
        setBannerTitleAr(banner.title_ar);
        setBannerTitleKu(banner.title_ku);
        setBannerSubtitleEn(banner.subtitle_en);
        setBannerSubtitleAr(banner.subtitle_ar);
        setBannerSubtitleKu(banner.subtitle_ku);
        setBannerBtnTextEn(banner.button_text_en);
        setBannerBtnTextAr(banner.button_text_ar);
        setBannerBtnTextKu(banner.button_text_ku);
        setBannerBtnLink(banner.button_link);
      }
    } catch (e) {
      setError("Failed to load settings data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const payload = {
        company_name: companyName,
        whatsapp_number: whatsappNumber,
        phone_number: phoneNumber,
        email: email,
        address_en: addressEn,
        address_ar: addressAr,
        address_ku: addressKu,
        facebook_url: fbUrl || null,
        instagram_url: igUrl || null,
        twitter_url: twUrl || null,
        youtube_url: ytUrl || null,
        maintenance_mode: maintenanceMode
      };

      await api.updateSettings(payload);
      setSuccess("Settings updated successfully. Front-end cache cleared.");
    } catch (err) {
      setError(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const payload = {
        image_path: bannerImage,
        title_en: bannerTitleEn,
        title_ar: bannerTitleAr,
        title_ku: bannerTitleKu,
        subtitle_en: bannerSubtitleEn,
        subtitle_ar: bannerSubtitleAr,
        subtitle_ku: bannerSubtitleKu,
        button_text_en: bannerBtnTextEn,
        button_text_ar: bannerBtnTextAr,
        button_text_ku: bannerBtnTextKu,
        button_link: bannerBtnLink
      };

      await api.updateBanner(payload);
      setSuccess("Homepage banner updated successfully. Front-end cache cleared.");
    } catch (err) {
      setError(err.message || "Failed to update homepage banner.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">System Settings</h1>
        <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Configure showroom company details and hero home banner configs</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-900 text-xs uppercase font-bold tracking-wider">
        <button
          onClick={() => { setActiveTab("settings"); setError(""); setSuccess(""); }}
          className={`px-6 py-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "settings" ? "border-brand text-brand bg-[#0a0a0f]/20" : "border-transparent text-neutral-450 hover:text-white"
          }`}
        >
          <FaCog />
          <span>Showroom Settings</span>
        </button>
        <button
          onClick={() => { setActiveTab("banner"); setError(""); setSuccess(""); }}
          className={`px-6 py-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "banner" ? "border-brand text-brand bg-[#0a0a0f]/20" : "border-transparent text-neutral-450 hover:text-white"
          }`}
        >
          <FaImage />
          <span>Home Hero Banner</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-rose-455 text-xs leading-relaxed max-w-3xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 text-emerald-455 text-xs leading-relaxed max-w-3xl">
          {success}
        </div>
      )}

      {/* -------------------- TAB: SHOWROOM SETTINGS -------------------- */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-8 space-y-6 max-w-3xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 col-span-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900">
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">Maintenance Mode</span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">When active, restricts access to the Admin APIs to logged-in admins only.</span>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 rounded text-brand focus:ring-brand bg-[#0f0f15] border-neutral-800 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Hausberg Appliances"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">WhatsApp Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. +964 750 964 8944"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Phone Number (Showroom Contact)</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +964 750 123 4567"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Company Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. showroom@hausberg-appliances.com"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="space-y-1.5 col-span-2 pt-4 border-t border-neutral-900/60">
              <span className="text-[10px] font-black text-brand uppercase tracking-widest block mb-2">Showroom Address Translation</span>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  placeholder="Address (English)"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  placeholder="العنوان (العربية)"
                  dir="rtl"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={addressKu}
                  onChange={(e) => setAddressKu(e.target.value)}
                  placeholder="ناونیشان (کوردی)"
                  dir="rtl"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-3 col-span-2 pt-4 border-t border-neutral-900/60">
              <span className="text-[10px] font-black text-brand uppercase tracking-widest block mb-2">Social Networks</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={fbUrl}
                  onChange={(e) => setFbUrl(e.target.value)}
                  placeholder="Facebook URL"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-2.5 text-xs text-neutral-200"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={igUrl}
                  onChange={(e) => setIgUrl(e.target.value)}
                  placeholder="Instagram URL"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-2.5 text-xs text-neutral-200"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={twUrl}
                  onChange={(e) => setTwUrl(e.target.value)}
                  placeholder="Twitter URL"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-2.5 text-xs text-neutral-200"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="YouTube URL"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-2.5 text-xs text-neutral-200"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900/60 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-brand hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* -------------------- TAB: HERO BANNER -------------------- */}
      {activeTab === "banner" && (
        <form onSubmit={handleSaveBanner} className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-8 space-y-6 max-w-3xl shadow-xl">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Background Image URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="Background URL (e.g. /images/hero-bg.jpg or Unsplash URL)"
                className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                disabled={saving}
              />
            </div>

            <div className="pt-4 border-t border-neutral-900/60 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Headline (English)</label>
                <input
                  type="text"
                  value={bannerTitleEn}
                  onChange={(e) => setBannerTitleEn(e.target.value)}
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5" dir="rtl">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">العنوان (العربية)</label>
                <input
                  type="text"
                  value={bannerTitleAr}
                  onChange={(e) => setBannerTitleAr(e.target.value)}
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5" dir="rtl">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">العنوان (کوردی)</label>
                <input
                  type="text"
                  value={bannerTitleKu}
                  onChange={(e) => setBannerTitleKu(e.target.value)}
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900/60 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Subtitle Description (English)</label>
                <textarea
                  value={bannerSubtitleEn}
                  onChange={(e) => setBannerSubtitleEn(e.target.value)}
                  rows="3"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5" dir="rtl">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">الوصف الفرعي (العربية)</label>
                <textarea
                  value={bannerSubtitleAr}
                  onChange={(e) => setBannerSubtitleAr(e.target.value)}
                  rows="3"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5" dir="rtl">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">وەسف (کوردی)</label>
                <textarea
                  value={bannerSubtitleKu}
                  onChange={(e) => setBannerSubtitleKu(e.target.value)}
                  rows="3"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900/60 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Explore Button Text (English)</label>
                <input
                  type="text"
                  value={bannerBtnTextEn}
                  onChange={(e) => setBannerBtnTextEn(e.target.value)}
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5" dir="rtl">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">نص الزر (العربية)</label>
                <input
                  type="text"
                  value={bannerBtnTextAr}
                  onChange={(e) => setBannerBtnTextAr(e.target.value)}
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5" dir="rtl">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">دەقی دوگمە (کوردی)</label>
                <input
                  type="text"
                  value={bannerBtnTextKu}
                  onChange={(e) => setBannerBtnTextKu(e.target.value)}
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 text-start"
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Explore Button Target Link</label>
                <input
                  type="text"
                  value={bannerBtnLink}
                  onChange={(e) => setBannerBtnLink(e.target.value)}
                  placeholder="e.g. #products-section"
                  className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900/60 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-brand hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>Save Banner</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
