import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/Modals/ConfirmModal";
import EmptyState from "../components/EmptyState/EmptyState";

import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast and Confirmation modal states
  const { showToast } = useToast();
  const [confirmDeleteCat, setConfirmDeleteCat] = useState(null);

  // Form State & Refs
  const [editingId, setEditingId] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameKu, setNameKu] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const nameEnRef = useRef(null);
  const nameArRef = useRef(null);
  const nameKuRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCategories();
      setCategories(res.data);
    } catch (e) {
      showToast(e.message || "Failed to load categories.", "error");
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
    setFieldErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setNameEn("");
    setNameAr("");
    setNameKu("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!nameEn) errors.nameEn = "English name is required.";
    if (!nameAr) errors.nameAr = "Arabic name is required.";
    if (!nameKu) errors.nameKu = "Kurdish name is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Please fill in all translated names.", "error");
      
      // Auto focus first invalid field
      if (errors.nameEn) {
        nameEnRef.current?.focus();
      } else if (errors.nameAr) {
        nameArRef.current?.focus();
      } else if (errors.nameKu) {
        nameKuRef.current?.focus();
      }
      return;
    }

    try {
      setFieldErrors({});
      setSaving(true);

      const payload = {
        name_en: nameEn,
        name_ar: nameAr,
        name_ku: nameKu
      };

      if (editingId) {
        await api.updateCategory(editingId, payload);
        showToast("Category updated successfully.", "success");
      } else {
        await api.createCategory(payload);
        showToast("Category created successfully.", "success");
      }

      handleCancel();
      await fetchCategories();
    } catch (err) {
      showToast(err.message || "Failed to save category.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrigger = (cat) => {
    setConfirmDeleteCat(cat);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteCat) return;
    const cat = confirmDeleteCat;
    setConfirmDeleteCat(null);

    try {
      await api.deleteCategory(cat.id);
      showToast("Category deleted successfully.", "success");
      await fetchCategories();
    } catch (err) {
      showToast(err.message || "Failed to delete category.", "error");
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

          {/* English translation */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">English Name</label>
            <input
              ref={nameEnRef}
              type="text"
              value={nameEn}
              onChange={(e) => {
                setNameEn(e.target.value);
                if (fieldErrors.nameEn) setFieldErrors(prev => ({ ...prev, nameEn: null }));
              }}
              placeholder="e.g. Kitchen Appliances"
              className={`w-full bg-[#0f0f15] border rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 ${
                fieldErrors.nameEn ? "border-red-500/80 focus:border-red-500" : "border-neutral-850 focus:border-brand/60"
              }`}
              disabled={saving}
            />
            {fieldErrors.nameEn && (
              <span className="text-[10px] font-semibold text-red-500 tracking-wide animate-fade-in block mt-1">
                {fieldErrors.nameEn}
              </span>
            )}
          </div>

          {/* Arabic translation */}
          <div className="space-y-1.5" dir="rtl">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">الاسم بالعربية</label>
            <input
              ref={nameArRef}
              type="text"
              value={nameAr}
              onChange={(e) => {
                setNameAr(e.target.value);
                if (fieldErrors.nameAr) setFieldErrors(prev => ({ ...prev, nameAr: null }));
              }}
              placeholder="مثال: أجهزة المطبخ"
              className={`w-full bg-[#0f0f15] border rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 text-start ${
                fieldErrors.nameAr ? "border-red-500/80 focus:border-red-500" : "border-neutral-850 focus:border-brand/60"
              }`}
              disabled={saving}
            />
            {fieldErrors.nameAr && (
              <span className="text-[10px] font-semibold text-red-500 tracking-wide animate-fade-in block mt-1 text-start">
                {fieldErrors.nameAr}
              </span>
            )}
          </div>

          {/* Kurdish translation */}
          <div className="space-y-1.5" dir="rtl">
            <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">ناو بە کوردی</label>
            <input
              ref={nameKuRef}
              type="text"
              value={nameKu}
              onChange={(e) => {
                setNameKu(e.target.value);
                if (fieldErrors.nameKu) setFieldErrors(prev => ({ ...prev, nameKu: null }));
              }}
              placeholder="وێنە: ئامێرەکانی چێشتخانە"
              className={`w-full bg-[#0f0f15] border rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 text-start ${
                fieldErrors.nameKu ? "border-red-500/80 focus:border-red-500" : "border-neutral-850 focus:border-brand/60"
              }`}
              disabled={saving}
            />
            {fieldErrors.nameKu && (
              <span className="text-[10px] font-semibold text-red-500 tracking-wide animate-fade-in block mt-1 text-start">
                {fieldErrors.nameKu}
              </span>
            )}
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
                className="py-3 px-5 border border-neutral-850 hover:border-neutral-700 text-neutral-455 hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center"
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
          ) : categories.length > 0 ? (
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
                  {categories.map((cat) => (
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
                            onClick={() => handleDeleteTrigger(cat)}
                            className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-450 hover:text-rose-455 transition-all duration-300 cursor-pointer"
                            title="Delete category"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No Categories Available"
              description="You have not created any categories yet. Create your first category on the left panel."
            />
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteCat}
        title="Delete Category?"
        message={`Are you sure you want to delete the category "${confirmDeleteCat?.name_en}"? This will restrict database mappings and cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteCat(null)}
      />
    </div>
  );
}
