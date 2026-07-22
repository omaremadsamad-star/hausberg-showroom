import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUndo, 
  FaCheck, 
  FaTimes, 
  FaImage, 
  FaSlidersH, 
  FaSave, 
  FaTrashAlt, 
  FaStar,
  FaFileAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSearch
} from "react-icons/fa";

export default function AdminProducts() {
  // Navigation & Listing State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters State
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkDiscountPrice, setBulkDiscountPrice] = useState("");
  const [bulkDiscountStart, setBulkDiscountStart] = useState("");
  const [bulkDiscountEnd, setBulkDiscountEnd] = useState("");

  // Editor State
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editorSubTab, setEditorSubTab] = useState("core"); // 'core', 'pricing', 'images', 'specs'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Core Product Fields
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameKu, setNameKu] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descKu, setDescKu] = useState("");
  const [availStatus, setAvailStatus] = useState("Available");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("Draft");
  const [displayOrder, setDisplayOrder] = useState(0);

  // Pricing Fields
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountStart, setDiscountStart] = useState("");
  const [discountEnd, setDiscountEnd] = useState("");

  // Dynamic Specs & Images
  const [specifications, setSpecifications] = useState([]);
  const [images, setImages] = useState([]);

  // Load Initial Lists
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminProducts({
        status: filterStatus,
        category: filterCategory,
        search: searchQuery,
        page: page
      });
      setProducts(res.data || []);
      setTotalProducts(res.meta?.total || 0);
      setLastPage(res.meta?.last_page || 1);
    } catch (e) {
      setError("Failed to load products list.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getAdminCategories();
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    setSelectedIds([]);
  }, [filterStatus, filterCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // Bulk Actions handler
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0 || !bulkAction) return;

    try {
      setError("");
      setSuccess("");
      
      const payload = {
        ids: selectedIds,
        action: bulkAction,
      };

      if (bulkAction === "apply_discount") {
        if (!bulkDiscountPrice) {
          setError("Please specify a bulk discount price.");
          return;
        }
        payload.discount_price = bulkDiscountPrice;
        payload.discount_start_date = bulkDiscountStart || null;
        payload.discount_end_date = bulkDiscountEnd || null;
      }

      await api.bulkProductsAction(payload);
      setSuccess("Bulk action executed successfully.");
      setSelectedIds([]);
      setBulkAction("");
      setBulkDiscountPrice("");
      setBulkDiscountStart("");
      setBulkDiscountEnd("");
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to execute bulk action.");
    }
  };

  // Delete & Restore item
  const handleDelete = async (id) => {
    if (!window.confirm("Move this product to Trash?")) return;
    try {
      setError("");
      setSuccess("");
      await api.deleteProduct(id);
      setSuccess("Product moved to Trash.");
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      setError("");
      setSuccess("");
      await api.restoreProduct(id);
      setSuccess("Product restored successfully.");
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm("PERMANENTLY delete this product? This action is irreversible.")) return;
    try {
      setError("");
      setSuccess("");
      await api.forceDeleteProduct(id);
      setSuccess("Product permanently deleted.");
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Editor Actions
  const handleOpenCreate = () => {
    setEditingId(null);
    setCategoryId(categories[0]?.id || "");
    setSku("");
    setBrand("");
    setModel("");
    setNameEn("");
    setNameAr("");
    setNameKu("");
    setDescEn("");
    setDescAr("");
    setDescKu("");
    setAvailStatus("Available");
    setFeatured(false);
    setStatus("Draft");
    setDisplayOrder(0);
    setPrice("");
    setDiscountPrice("");
    setDiscountStart("");
    setDiscountEnd("");
    setSpecifications([]);
    setImages([{ image_path: "", sort_order: 0 }]); // Start with one empty slot
    setError("");
    setSuccess("");
    setEditorSubTab("core");
    setShowEditor(true);
  };

  const handleOpenEdit = async (prod) => {
    try {
      setError("");
      setSuccess("");
      setSaving(true);
      const res = await api.getAdminProduct(prod.id);
      const data = res.data;

      setEditingId(data.id);
      setCategoryId(data.category_id || (categories.find(c => c.slug === data.category_slug)?.id || ""));
      setSku(data.sku);
      setBrand(data.brand);
      setModel(data.model);
      setNameEn(data.name.en);
      setNameAr(data.name.ar);
      setNameKu(data.name.ku);
      setDescEn(data.description.en);
      setDescAr(data.description.ar);
      setDescKu(data.description.ku);
      setAvailStatus(data.availability_status);
      setFeatured(data.featured);
      setStatus(data.status);
      setDisplayOrder(data.display_order || 0);
      setPrice(data.price);
      setDiscountPrice(data.discount_price || "");
      setDiscountStart(data.discount_start_date ? data.discount_start_date.substring(0, 10) : "");
      setDiscountEnd(data.discount_end_date ? data.discount_end_date.substring(0, 10) : "");

      // Format Specifications
      const formattedSpecs = data.specifications.map(s => ({
        key_en: s.label.en,
        key_ar: s.label.ar,
        key_ku: s.label.ku,
        value_en: s.value.en,
        value_ar: s.value.ar,
        value_ku: s.value.ku,
        sort_order: s.sort_order
      }));
      setSpecifications(formattedSpecs);

      // Format Images
      const formattedImages = data.gallery_images.map(img => ({
        image_path: img.path,
        sort_order: img.sort_order
      }));
      setImages(formattedImages.length > 0 ? formattedImages : [{ image_path: "", sort_order: 0 }]);

      setEditorSubTab("core");
      setShowEditor(true);
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic lists handlers
  const handleAddSpec = () => {
    setSpecifications([...specifications, {
      key_en: "", key_ar: "", key_ku: "",
      value_en: "", value_ar: "", value_ku: "",
      sort_order: specifications.length
    }]);
  };

  const handleRemoveSpec = (idx) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx, field, value) => {
    const updated = [...specifications];
    updated[idx][field] = value;
    setSpecifications(updated);
  };

  const handleAddImageSlot = () => {
    setImages([...images, { image_path: "", sort_order: images.length }]);
  };

  const handleRemoveImageSlot = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleImageChange = (idx, value) => {
    const updated = [...images];
    updated[idx].image_path = value;
    setImages(updated);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!categoryId || !sku || !brand || !model || !nameEn || !nameAr || !nameKu || !price) {
      setError("Please fill in all required fields (Category, SKU, Brand, Model, Names, Price).");
      return;
    }

    // Clean dynamic images
    const cleanedImages = images.filter(img => img.image_path.trim() !== "");

    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const payload = {
        category_id: categoryId,
        sku,
        brand,
        model,
        name_en: nameEn,
        name_ar: nameAr,
        name_ku: nameKu,
        price,
        discount_price: discountPrice || null,
        discount_start_date: discountStart || null,
        discount_end_date: discountEnd || null,
        description_en: descEn,
        description_ar: descAr,
        description_ku: descKu,
        availability_status: availStatus,
        featured,
        status,
        display_order: displayOrder,
        specifications,
        images: cleanedImages
      };

      if (editingId) {
        await api.updateProduct(editingId, payload);
        setSuccess("Product updated successfully.");
      } else {
        await api.createProduct(payload);
        setSuccess("Product created successfully.");
      }

      setShowEditor(false);
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Showroom Products</h1>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-semibold">Manage pricing, specifications, and images of products</p>
        </div>
        {!showEditor && (
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 bg-brand hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
          >
            <FaPlus />
            <span>Create Product</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-rose-455 text-xs leading-relaxed">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 text-emerald-450 text-xs leading-relaxed">
          {success}
        </div>
      )}

      {/* -------------------- EDITOR SCREEN -------------------- */}
      {showEditor ? (
        <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Editor Header */}
          <div className="bg-[#0c0c13] px-8 py-5 border-b border-neutral-900 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              {editingId ? `Edit Product: ${nameEn}` : "Add New Product"}
            </h2>
            <button
              onClick={() => setShowEditor(false)}
              className="text-neutral-500 hover:text-white cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Form Tabs Bar */}
          <div className="flex border-b border-neutral-900 bg-[#07070a]/40 text-xs uppercase font-bold tracking-wider">
            <button
              onClick={() => setEditorSubTab("core")}
              className={`px-6 py-4 border-b-2 transition-colors cursor-pointer ${
                editorSubTab === "core" ? "border-brand text-brand bg-[#0a0a0f]/30" : "border-transparent text-neutral-450 hover:text-white"
              }`}
            >
              Core Information
            </button>
            <button
              onClick={() => setEditorSubTab("pricing")}
              className={`px-6 py-4 border-b-2 transition-colors cursor-pointer ${
                editorSubTab === "pricing" ? "border-brand text-brand bg-[#0a0a0f]/30" : "border-transparent text-neutral-450 hover:text-white"
              }`}
            >
              Pricing & Discounts
            </button>
            <button
              onClick={() => setEditorSubTab("images")}
              className={`px-6 py-4 border-b-2 transition-colors cursor-pointer ${
                editorSubTab === "images" ? "border-brand text-brand bg-[#0a0a0f]/30" : "border-transparent text-neutral-450 hover:text-white"
              }`}
            >
              Image Gallery
            </button>
            <button
              onClick={() => setEditorSubTab("specs")}
              className={`px-6 py-4 border-b-2 transition-colors cursor-pointer ${
                editorSubTab === "specs" ? "border-brand text-brand bg-[#0a0a0f]/30" : "border-transparent text-neutral-450 hover:text-white"
              }`}
            >
              Specifications ({specifications.length})
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSaveProduct} className="p-8 space-y-8">
            {/* SUBTAB: CORE */}
            {editorSubTab === "core" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name_en}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">SKU *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. HB-9005-BL"
                    className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Brand *</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Hausberg"
                    className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Model *</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. HB-9005"
                    className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-900/60">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Name (English) *</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Built-in Oven"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5" dir="rtl">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">الاسم (العربية) *</label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="مثال: فرن بلت ان"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none text-start"
                    />
                  </div>

                  <div className="space-y-1.5" dir="rtl">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">ناو (کوردی) *</label>
                    <input
                      type="text"
                      value={nameKu}
                      onChange={(e) => setNameKu(e.target.value)}
                      placeholder="وێنە: فڕنی ناوکێش"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none text-start"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-900/60">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Description (English)</label>
                    <textarea
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      rows="4"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5" dir="rtl">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">الوصف (العربية)</label>
                    <textarea
                      value={descAr}
                      onChange={(e) => setDescAr(e.target.value)}
                      rows="4"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none text-start"
                    />
                  </div>

                  <div className="space-y-1.5" dir="rtl">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest block text-start">وەسف (کوردی)</label>
                    <textarea
                      value={descKu}
                      onChange={(e) => setDescKu(e.target.value)}
                      rows="4"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none text-start"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-900/60">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Availability</label>
                    <select
                      value={availStatus}
                      onChange={(e) => setAvailStatus(e.target.value)}
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                      <option value="Coming Soon">Coming Soon</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Publish Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:ring-0 cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Display Order</label>
                    <input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-brand focus:ring-brand bg-[#0f0f15] border-neutral-800"
                    />
                    <label htmlFor="featured" className="text-xs font-bold text-neutral-300 cursor-pointer uppercase tracking-wider">Featured Product</label>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: PRICING */}
            {editorSubTab === "pricing" && (
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">Original Price (IQD) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 250000"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Discount Price (IQD)</label>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="e.g. 199000 (optional)"
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Discount Start Date</label>
                    <input
                      type="date"
                      value={discountStart}
                      onChange={(e) => setDiscountStart(e.target.value)}
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-455 uppercase tracking-widest">Discount End Date</label>
                    <input
                      type="date"
                      value={discountEnd}
                      onChange={(e) => setDiscountEnd(e.target.value)}
                      className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f0f15] border border-neutral-900 text-[10px] text-neutral-450 leading-relaxed uppercase tracking-wider">
                  ⚠️ Note: Discount price must be strictly lower than the base price. The discount will automatically trigger on the public website if the current date lies between the start and end dates (inclusive). If dates are empty, the discount runs indefinitely.
                </div>
              </div>
            )}

            {/* SUBTAB: IMAGES */}
            {editorSubTab === "images" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-350">Product Images List</h3>
                  <button
                    type="button"
                    onClick={handleAddImageSlot}
                    className="px-4 py-2 border border-brand text-brand hover:bg-brand hover:text-black font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <FaPlus />
                    <span>Add Image Slot</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-[#0a0a0f]/40 p-4 border border-neutral-900 rounded-xl">
                      <span className="text-[10px] font-bold text-neutral-500 w-8">#{idx + 1}</span>
                      
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={img.image_path}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          placeholder="Image URL (e.g. /images/products/oven1.png or Unsplash URL)"
                          className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          value={img.sort_order}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[idx].sort_order = parseInt(e.target.value) || 0;
                            setImages(updated);
                          }}
                          placeholder="Sort"
                          title="Sort Order (Ascending)"
                          className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2.5 text-xs text-neutral-200 text-center"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveImageSlot(idx)}
                        disabled={images.length <= 1}
                        className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-500 hover:text-rose-455 transition-all duration-300 disabled:opacity-30 cursor-pointer"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB: SPECS */}
            {editorSubTab === "specs" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-350">Dynamic Specifications</h3>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-4 py-2 border border-brand text-brand hover:bg-brand hover:text-black font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <FaPlus />
                    <span>Add Specification</span>
                  </button>
                </div>

                {specifications.length > 0 ? (
                  <div className="space-y-6">
                    {specifications.map((spec, idx) => (
                      <div key={idx} className="bg-[#0f0f15]/30 border border-neutral-900 rounded-2xl p-5 space-y-4 relative">
                        {/* Header card indicator and delete */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Specification Row #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(idx)}
                            className="p-2 border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-500 hover:text-rose-455 transition-all duration-300 rounded-lg cursor-pointer"
                          >
                            <FaTrashAlt size={10} />
                          </button>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* English Key/Val */}
                          <div className="space-y-3 bg-[#0a0a0f]/40 p-4 border border-neutral-900 rounded-xl">
                            <span className="text-[9px] font-bold text-brand uppercase tracking-wider block">English</span>
                            <input
                              type="text"
                              value={spec.key_en}
                              onChange={(e) => handleSpecChange(idx, "key_en", e.target.value)}
                              placeholder="Key (e.g. Capacity)"
                              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2 text-xs text-neutral-200"
                            />
                            <input
                              type="text"
                              value={spec.value_en}
                              onChange={(e) => handleSpecChange(idx, "value_en", e.target.value)}
                              placeholder="Value (e.g. 70 Liters)"
                              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2 text-xs text-neutral-200"
                            />
                          </div>

                          {/* Arabic Key/Val */}
                          <div className="space-y-3 bg-[#0a0a0f]/40 p-4 border border-neutral-900 rounded-xl" dir="rtl">
                            <span className="text-[9px] font-bold text-brand uppercase tracking-wider block text-start">العربية</span>
                            <input
                              type="text"
                              value={spec.key_ar}
                              onChange={(e) => handleSpecChange(idx, "key_ar", e.target.value)}
                              placeholder="الميزة (مثال: السعة)"
                              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2 text-xs text-neutral-200 text-start"
                            />
                            <input
                              type="text"
                              value={spec.value_ar}
                              onChange={(e) => handleSpecChange(idx, "value_ar", e.target.value)}
                              placeholder="القيمة (مثال: 70 لتر)"
                              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2 text-xs text-neutral-200 text-start"
                            />
                          </div>

                          {/* Kurdish Key/Val */}
                          <div className="space-y-3 bg-[#0a0a0f]/40 p-4 border border-neutral-900 rounded-xl" dir="rtl">
                            <span className="text-[9px] font-bold text-brand uppercase tracking-wider block text-start">کوردی</span>
                            <input
                              type="text"
                              value={spec.key_ku}
                              onChange={(e) => handleSpecChange(idx, "key_ku", e.target.value)}
                              placeholder="ميزة (نمونە: قەبارە)"
                              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2 text-xs text-neutral-200 text-start"
                            />
                            <input
                              type="text"
                              value={spec.value_ku}
                              onChange={(e) => handleSpecChange(idx, "value_ku", e.target.value)}
                              placeholder="نرخ (نمونە: 70 لیتر)"
                              className="w-full bg-[#0f0f15] border border-neutral-850 focus:border-brand/60 rounded-lg px-3 py-2 text-xs text-neutral-200 text-start"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-500 font-light border border-dashed border-neutral-850 rounded-2xl">
                    No specifications added yet.
                  </div>
                )}
              </div>
            )}

            {/* Form Actions footer */}
            <div className="border-t border-neutral-900 pt-6 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="py-3 px-6 border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-8 bg-brand hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <FaSave />
                <span>{editingId ? "Update Product" : "Save Product"}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* -------------------- LIST SCREEN -------------------- */
        <div className="space-y-6 animate-fade-in">
          {/* Filters Bar */}
          <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[#0f0f15] border border-neutral-850 rounded-xl px-4 py-2.5 w-full md:max-w-xs focus-within:border-brand/60 transition-colors duration-200">
              <FaSearch className="text-neutral-500 me-2shrink-0" size={12} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0 text-xs"
              />
            </form>

            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-end">
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                className="bg-[#0f0f15] border border-neutral-850 text-neutral-350 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name_en}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="bg-[#0f0f15] border border-neutral-850 text-neutral-350 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                <option value="">Active (All)</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Trash">Trash (Deleted)</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {selectedIds.length > 0 && (
            <form onSubmit={handleBulkSubmit} className="bg-brand/5 border border-brand/20 p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between animate-fade-in text-xs font-bold uppercase tracking-wider">
              <div className="text-neutral-300">
                Selected <span className="text-brand font-black">{selectedIds.length}</span> items
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="bg-[#0f0f15] border border-neutral-800 text-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer"
                >
                  <option value="">-- Choose Bulk Action --</option>
                  <option value="publish">Publish</option>
                  <option value="draft">Draft</option>
                  {filterStatus === "Trash" ? (
                    <option value="restore">Restore</option>
                  ) : (
                    <option value="delete">Move to Trash</option>
                  )}
                  <option value="apply_discount">Apply Discount</option>
                  <option value="remove_discount">Remove Discount</option>
                </select>

                {bulkAction === "apply_discount" && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bulkDiscountPrice}
                      onChange={(e) => setBulkDiscountPrice(e.target.value)}
                      placeholder="Discount Price"
                      className="bg-[#0f0f15] border border-neutral-800 rounded-xl px-3 py-2 text-xs w-28"
                    />
                    <input
                      type="date"
                      value={bulkDiscountStart}
                      onChange={(e) => setBulkDiscountStart(e.target.value)}
                      placeholder="Start"
                      className="bg-[#0f0f15] border border-neutral-800 rounded-xl px-3 py-2 text-xs w-28 cursor-pointer"
                    />
                    <input
                      type="date"
                      value={bulkDiscountEnd}
                      onChange={(e) => setBulkDiscountEnd(e.target.value)}
                      placeholder="End"
                      className="bg-[#0f0f15] border border-neutral-800 rounded-xl px-3 py-2 text-xs w-28 cursor-pointer"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand text-black font-extrabold rounded-xl transition-all hover:opacity-90 cursor-pointer text-xs"
                >
                  Apply
                </button>
              </div>
            </form>
          )}

          {/* Products Table grid */}
          <div className="bg-[#0a0a0f]/40 border border-neutral-900 rounded-3xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-900 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-start">
                      <th className="py-4 px-6 text-center w-12">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={products.length > 0 && selectedIds.length === products.length}
                          className="rounded text-brand focus:ring-brand bg-[#0f0f15] border-neutral-800 w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="py-4 px-6 text-start">Image</th>
                      <th className="py-4 px-6 text-start">SKU / Model</th>
                      <th className="py-4 px-6 text-start">Name (English)</th>
                      <th className="py-4 px-6 text-start">Category</th>
                      <th className="py-4 px-6 text-start">Original Price</th>
                      <th className="py-4 px-6 text-center">Featured</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900/60 text-xs">
                    {products.length > 0 ? (
                      products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-neutral-900/10 transition-colors duration-200">
                          <td className="py-4.5 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(prod.id)}
                              onChange={() => handleSelectOne(prod.id)}
                              className="rounded text-brand focus:ring-brand bg-[#0f0f15] border-neutral-800 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-4.5 px-6">
                            <img
                              src={prod.image}
                              alt="Oven"
                              className="w-12 h-10 object-cover rounded-lg border border-neutral-850"
                            />
                          </td>
                          <td className="py-4.5 px-6 text-start">
                            <span className="font-bold text-white block">{prod.sku}</span>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">{prod.brand} {prod.model}</span>
                          </td>
                          <td className="py-4.5 px-6 font-semibold text-neutral-250 text-start">{prod.name.en}</td>
                          <td className="py-4.5 px-6 text-neutral-400 text-start">{prod.category}</td>
                          <td className="py-4.5 px-6 text-start">
                            {prod.has_active_discount ? (
                              <div className="space-y-0.5">
                                <span className="font-bold text-white block">{new Intl.NumberFormat("en-US").format(prod.active_price)} IQD</span>
                                <span className="text-[10px] text-neutral-550 line-through block">{new Intl.NumberFormat("en-US").format(prod.price)} IQD</span>
                              </div>
                            ) : (
                              <span className="font-bold text-white block">{new Intl.NumberFormat("en-US").format(prod.price)} IQD</span>
                            )}
                          </td>
                          <td className="py-4.5 px-6 text-center">
                            {prod.featured ? (
                              <span className="text-amber-400 font-bold text-[10px] uppercase border border-amber-500/30 bg-amber-950/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <FaStar size={8} /> Yes
                              </span>
                            ) : (
                              <span className="text-neutral-550">-</span>
                            )}
                          </td>
                          <td className="py-4.5 px-6 text-center">
                            {prod.status === "Published" ? (
                              <span className="text-emerald-450 font-bold text-[10px] uppercase border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <FaEye size={8} /> Published
                              </span>
                            ) : (
                              <span className="text-neutral-450 font-bold text-[10px] uppercase border border-neutral-700/20 bg-neutral-900/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <FaFileAlt size={8} /> Draft
                              </span>
                            )}
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="flex justify-center gap-2">
                              {filterStatus === "Trash" ? (
                                <>
                                  <button
                                    onClick={() => handleRestore(prod.id)}
                                    className="p-2.5 rounded-lg border border-neutral-850 hover:border-emerald-500/45 hover:bg-emerald-950/10 text-neutral-450 hover:text-emerald-450 transition-all duration-300 cursor-pointer"
                                    title="Restore product"
                                  >
                                    <FaUndo size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleForceDelete(prod.id)}
                                    className="p-2.5 rounded-lg border border-neutral-850 hover:border-red-900/80 hover:bg-red-950/10 text-neutral-500 hover:text-red-455 transition-all duration-300 cursor-pointer"
                                    title="Permanently delete"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleOpenEdit(prod)}
                                    className="p-2.5 rounded-lg border border-neutral-850 hover:border-brand/40 hover:bg-neutral-900/40 text-neutral-450 hover:text-brand transition-all duration-300 cursor-pointer"
                                    title="Edit product"
                                  >
                                    <FaEdit size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(prod.id)}
                                    className="p-2.5 rounded-lg border border-neutral-850 hover:border-rose-900/60 hover:bg-rose-950/10 text-neutral-450 hover:text-rose-455 transition-all duration-300 cursor-pointer"
                                    title="Move to Trash"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="py-16 text-center text-neutral-500 font-light">
                          No products found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-neutral-850 text-neutral-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
              >
                <FaChevronLeft size={10} />
              </button>
              <span className="text-xs text-neutral-450 uppercase font-semibold px-4 tracking-widest">
                Page {page} of {lastPage}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === lastPage}
                className="p-2.5 rounded-xl border border-neutral-850 text-neutral-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
