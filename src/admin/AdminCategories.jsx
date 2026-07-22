import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameKu, setNameKu] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCategories();
      setCategories(res.data);
    } catch (e) {
      setError(e.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setNameEn(cat.name_en);
    setNameAr(cat.name_ar);
    setNameKu(cat.name_ku);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setNameEn("");
    setNameAr("");
    setNameKu("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameEn || !nameAr || !nameKu) {
      setError("Please fill in all translated names (English, Arabic, Kurdish).");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const payload = {
        name_en: nameEn,
        name_ar: nameAr,
        name_ku: nameKu
      };

      if (editingId) {
        await api.updateCategory(editingId, payload);
        setSuccess("Category updated successfully.");
      } else {
        await api.createCategory(payload);
        setSuccess("Category created successfully.");
      }

      handleCancel();
      await fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete the category "${cat.name_en}"?`)) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await api.deleteCategory(cat.id);
      setSuccess("Category deleted successfully.");
      await fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Product Categories</h1>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Classify showroom items into organizational sections</p>
        </div>
      </div>

      {/* Grid: Form on Left, Categories Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-6 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-rose-450 text-xs leading-relaxed animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 text-emerald-450 text-xs leading-relaxed animate-fade-in">
              {success}
            </div>
          )}

          {/* English translation */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">English Name</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Kitchen Appliances"
              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0"
              disabled={saving}
            />
          </div>

          {/* Arabic translation */}
          <div className="space-y-1.5" dir="rtl">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">الاسم بالعربية</label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: أجهزة المطبخ"
              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 text-start"
              disabled={saving}
            />
          </div>

          {/* Kurdish translation */}
          <div className="space-y-1.5" dir="rtl">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">ناو بە کوردی</label>
            <input
              type="text"
              value={nameKu}
              onChange={(e) => setNameKu(e.target.value)}
              placeholder="وێنە: ئامێرەکانی چێشتخانە"
              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 text-start"
              disabled={saving}
            />
          </div>

          {/* Submit / Cancel Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-brand hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : editingId ? <FaCheck /> : <FaPlus />}
              <span>{editingId ? "Update" : "Create"}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="py-3 px-5 border border-neutral-850 hover:border-neutral-700 text-neutral-450 hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </form>

        {/* Categories Table Grid */}
        <div className="lg:col-span-8 bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-start">
                    <th className="py-4 px-6 text-start">English</th>
                    <th className="py-4 px-6 text-start">العربية</th>
                    <th className="py-4 px-6 text-start">کوردی</th>
                    <th className="py-4 px-6 text-center">Products</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60 text-xs">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-neutral-900/10 transition-colors duration-200">
                        <td className="py-4.5 px-6 font-bold text-white text-start">{cat.name_en}</td>
                        <td className="py-4.5 px-6 text-neutral-300 text-start" dir="rtl">{cat.name_ar}</td>
                        <td className="py-4.5 px-6 text-neutral-300 text-start" dir="rtl">{cat.name_ku}</td>
                        <td className="py-4.5 px-6 text-center font-semibold text-neutral-400">
                          {cat.products_count}
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="p-2.5 rounded-lg border border-neutral-850 hover:border-brand/40 hover:bg-neutral-900/40 text-neutral-400 hover:text-brand transition-all duration-300 cursor-pointer"
                              title="Edit category"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat)}
                              className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-450 hover:text-rose-450 transition-all duration-300 cursor-pointer"
                              title="Delete category"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-neutral-500 font-light">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
