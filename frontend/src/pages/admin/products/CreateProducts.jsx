import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../apiData/api/productApi";
import { categoryApi } from "../../../apiData/api/categoryApi";
import {
  MdCloudUpload, MdClose, MdAdd, MdRemove, MdSave,
  MdCheckCircle, MdError, MdArrowBack,
} from "react-icons/md";

/* ── Reusable Input ── */
const Field = ({ label, error, required, children, hint }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-300 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><MdError size={13}/>{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-all
   focus:ring-2 focus:ring-[#FF9900]/60 focus:border-[#FF9900]
   ${err ? "border-red-500" : "border-white/10 hover:border-white/20"}`;

const SIZES = ["XS","S","M","L","XL","XXL","XXXL","28","30","32","34","36","38","40","42"];
const GENDERS = ["men","women","unisex","boys","girls","kids"];
const AGE_GROUPS = ["adult","teen","kids","infant"];
const STATUSES = ["draft","active","inactive"];
const SHIPPING_CLASSES = ["standard","express","overnight","free"];

export default function CreateProduct() {
  const navigate = useNavigate();
  const imgRef = useRef();

  /* ── State ── */
  const [form, setForm] = useState({
    name: "", description: "", shortDescription: "", price: "",
    comparePrice: "", brand: "", stock: "", sku: "", status: "draft",
    category: "", subCategory: "", subSubCategory: "",
    gender: "", ageGroup: "", tags: "",
    // shipping
    weight: "", length: "", width: "", height: "",
    freeShipping: false, shippingClass: "standard", estimatedDelivery: "",
    // return
    isReturnable: true, returnDays: "10", returnConditions: "",
    // warranty
    hasWarranty: false, warrantyPeriod: "", warrantyType: "",
    // seo
    metaTitle: "", metaDescription: "", keywords: "",
    // flags
    isFeatured: false, isNewArrival: false, isBestSeller: false, isDeal: false,
    dealExpiresAt: "",
    // highlights
    highlights: [""],
    // colors
    colors: [{ name: "", hex: "" }],
  });

  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [serverError, setServerError] = useState("");

  // sizes
  const [selectedSizes, setSelectedSizes] = useState([]);

  // images
  const [imageFiles, setImageFiles]     = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // categories
  const [rootCats, setRootCats]     = useState([]);
  const [subCats, setSubCats]       = useState([]);
  const [subSubCats, setSubSubCats] = useState([]);

  // active tab
  const [tab, setTab] = useState("basic");

  /* ── Load root categories ── */
  useEffect(() => {
    categoryApi.getAll({ parent: "null", tree: "false" })
      .then(setRootCats).catch(() => {});
  }, []);

  /* ── Load subcategories on parent change ── */
  useEffect(() => {
    if (!form.category) { setSubCats([]); setSubSubCats([]); return; }
    categoryApi.getAll({ parent: form.category, tree: "false" })
      .then(setSubCats).catch(() => {});
  }, [form.category]);

  useEffect(() => {
    if (!form.subCategory) { setSubSubCats([]); return; }
    categoryApi.getAll({ parent: form.subCategory, tree: "false" })
      .then(setSubSubCats).catch(() => {});
  }, [form.subCategory]);

  /* ── Handlers ── */
  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: "" }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - imageFiles.length);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(p => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i) => {
    setImageFiles(p => p.filter((_, idx) => idx !== i));
    setImagePreviews(p => p.filter((_, idx) => idx !== i));
  };

  const toggleSize = (s) =>
    setSelectedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const addHighlight = () => setForm(f => ({ ...f, highlights: [...f.highlights, ""] }));
  const setHighlight = (i, v) => setForm(f => {
    const h = [...f.highlights]; h[i] = v; return { ...f, highlights: h };
  });
  const removeHighlight = (i) => setForm(f => ({
    ...f, highlights: f.highlights.filter((_, idx) => idx !== i)
  }));

  const addColor = () => setForm(f => ({ ...f, colors: [...f.colors, { name: "", hex: "" }] }));
  const setColor = (i, field, v) => setForm(f => {
    const c = [...f.colors]; c[i] = { ...c[i], [field]: v }; return { ...f, colors: c };
  });
  const removeColor = (i) => setForm(f => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }));

  /* ── Validate ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Product name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price)              e.price       = "Price is required";
    else if (isNaN(form.price) || +form.price < 0) e.price = "Enter a valid price";
    if (!form.stock && form.stock !== 0) e.stock = "Stock is required";
    if (!form.category)           e.category    = "Select a category";
    if (imageFiles.length === 0)  e.images      = "At least one image is required";
    return e;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); setTab("basic"); return; }

    setLoading(true);
    setServerError("");

    const fd = new FormData();
    // Basic
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("shortDescription", form.shortDescription.trim());
    fd.append("price", form.price);
    if (form.comparePrice) fd.append("comparePrice", form.comparePrice);
    fd.append("brand", form.brand.trim());
    fd.append("stock", form.stock);
    if (form.sku) fd.append("sku", form.sku.trim());
    fd.append("status", form.status);
    fd.append("category", form.category);
    if (form.subCategory)    fd.append("subCategory", form.subCategory);
    if (form.subSubCategory) fd.append("subSubCategory", form.subSubCategory);
    if (form.gender)   fd.append("gender", form.gender);
    if (form.ageGroup) fd.append("ageGroup", form.ageGroup);

    // Tags
    if (form.tags) fd.append("tags", form.tags);
    // Sizes
    if (selectedSizes.length) fd.append("sizes", selectedSizes.join(","));

    // Highlights
    form.highlights.filter(Boolean).forEach(h => fd.append("highlights", h));

    // Colors
    const validColors = form.colors.filter(c => c.name);
    if (validColors.length) fd.append("colors", JSON.stringify(validColors));

    // Shipping
    fd.append("shipping", JSON.stringify({
      weight: +form.weight || 0,
      dimensions: { length: +form.length || 0, width: +form.width || 0, height: +form.height || 0 },
      freeShipping: form.freeShipping,
      shippingClass: form.shippingClass,
      estimatedDelivery: form.estimatedDelivery,
    }));

    // Return policy
    fd.append("returnPolicy", JSON.stringify({
      isReturnable: form.isReturnable,
      returnDays: +form.returnDays || 10,
      returnConditions: form.returnConditions,
    }));

    // Warranty
    fd.append("warranty", JSON.stringify({
      hasWarranty: form.hasWarranty,
      warrantyPeriod: form.warrantyPeriod,
      warrantyType: form.warrantyType,
    }));

    // SEO
    fd.append("seo", JSON.stringify({
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
    }));

    // Flags
    fd.append("isFeatured",   form.isFeatured);
    fd.append("isNewArrival", form.isNewArrival);
    fd.append("isBestSeller", form.isBestSeller);
    fd.append("isDeal",       form.isDeal);
    if (form.isDeal && form.dealExpiresAt) fd.append("dealExpiresAt", form.dealExpiresAt);

    // Images
    imageFiles.forEach(f => fd.append("images", f));

    try {
      await productApi.create(fd);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to create product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Tabs ── */
  const TABS = [
    { id: "basic",     label: "Basic Info",  dot: errors.name || errors.description || errors.price || errors.stock || errors.category },
    { id: "media",     label: "Images",      dot: errors.images },
    { id: "variants",  label: "Variants"  },
    { id: "shipping",  label: "Shipping"   },
    { id: "seo",       label: "SEO & Tags" },
    { id: "flags",     label: "Settings"   },
  ];

  if (success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-4">
      <MdCheckCircle size={60} className="text-green-400" />
      <h2 className="text-2xl font-bold">Product Created!</h2>
      <p className="text-gray-400">Redirecting to products list…</p>
    </div>
  );

  return (
    <div className="text-white max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/products")}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <MdArrowBack size={20}/>
        </button>
        <div>
          <h1 className="text-xl font-bold">Create Product</h1>
          <p className="text-gray-400 text-sm">Fill in the details below</p>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2 mb-4">
          <MdError size={18}/> {serverError}
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all relative min-w-[80px]
              ${tab === t.id ? "bg-[#FF9900] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t.label}
            {t.dot && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full"/>}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[#131720] border border-white/5 rounded-2xl p-6">

          {/* ══════ TAB: BASIC ══════ */}
          {tab === "basic" && (
            <div className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Product Name" required error={errors.name}>
                    <input value={form.name} onChange={set("name")} placeholder="e.g. Nike Air Max 270"
                      className={inputCls(errors.name)}/>
                  </Field>
                </div>

                <Field label="Price (₹)" required error={errors.price}>
                  <input type="number" value={form.price} onChange={set("price")} placeholder="999"
                    className={inputCls(errors.price)}/>
                </Field>

                <Field label="Compare Price (₹)" hint="Original MRP — shows crossed-out">
                  <input type="number" value={form.comparePrice} onChange={set("comparePrice")} placeholder="1499"
                    className={inputCls()}/>
                </Field>

                <Field label="Stock Quantity" required error={errors.stock}>
                  <input type="number" value={form.stock} onChange={set("stock")} placeholder="100"
                    className={inputCls(errors.stock)}/>
                </Field>

                <Field label="Brand">
                  <input value={form.brand} onChange={set("brand")} placeholder="Nike, Samsung…"
                    className={inputCls()}/>
                </Field>

                <Field label="SKU" hint="Leave blank to auto-generate">
                  <input value={form.sku} onChange={set("sku")} placeholder="Auto-generated"
                    className={inputCls()}/>
                </Field>

                <Field label="Status">
                  <select value={form.status} onChange={set("status")} className={inputCls()}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </Field>

                {/* Categories */}
                <Field label="Category" required error={errors.category}>
                  <select value={form.category} onChange={set("category")} className={inputCls(errors.category)}>
                    <option value="">Select category</option>
                    {rootCats.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                </Field>

                {subCats.length > 0 && (
                  <Field label="Sub Category">
                    <select value={form.subCategory} onChange={set("subCategory")} className={inputCls()}>
                      <option value="">Select sub-category</option>
                      {subCats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </Field>
                )}

                {subSubCats.length > 0 && (
                  <Field label="Sub-Sub Category">
                    <select value={form.subSubCategory} onChange={set("subSubCategory")} className={inputCls()}>
                      <option value="">Select</option>
                      {subSubCats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </Field>
                )}

                <Field label="Gender">
                  <select value={form.gender} onChange={set("gender")} className={inputCls()}>
                    <option value="">None</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
                  </select>
                </Field>

                <Field label="Age Group">
                  <select value={form.ageGroup} onChange={set("ageGroup")} className={inputCls()}>
                    <option value="">None</option>
                    {AGE_GROUPS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Short Description" hint="Max 500 characters">
                <textarea rows={2} value={form.shortDescription} onChange={set("shortDescription")}
                  placeholder="Brief product summary…" className={inputCls()}/>
              </Field>

              <Field label="Full Description" required error={errors.description}>
                <textarea rows={5} value={form.description} onChange={set("description")}
                  placeholder="Detailed product description…" className={inputCls(errors.description)}/>
              </Field>

              {/* Highlights */}
              <Field label="Highlights">
                {form.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={h} onChange={e => setHighlight(i, e.target.value)}
                      placeholder={`Highlight ${i+1}`} className={inputCls()}/>
                    {form.highlights.length > 1 && (
                      <button type="button" onClick={() => removeHighlight(i)}
                        className="text-red-400 hover:text-red-300 p-2"><MdRemove size={16}/></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addHighlight}
                  className="flex items-center gap-1 text-[#FF9900] text-xs hover:underline mt-1">
                  <MdAdd size={14}/> Add highlight
                </button>
              </Field>
            </div>
          )}

          {/* ══════ TAB: MEDIA ══════ */}
          {tab === "media" && (
            <div>
              <p className="text-gray-400 text-sm mb-4">Upload up to 10 images. First image will be the primary.</p>
              {errors.images && (
                <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><MdError size={13}/>{errors.images}</p>
              )}

              {/* Drop zone */}
              <div onClick={() => imgRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-[#FF9900]/50 rounded-xl p-8
                  flex flex-col items-center gap-3 cursor-pointer transition-colors mb-4">
                <MdCloudUpload size={40} className="text-gray-500"/>
                <p className="text-gray-400 text-sm">Click to upload images</p>
                <p className="text-gray-600 text-xs">PNG, JPG, WEBP — max 5MB each</p>
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages}/>
              </div>

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={src} className="w-full h-full object-cover rounded-lg border border-white/10"/>
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-[#FF9900] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                          PRIMARY
                        </span>
                      )}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5
                          opacity-0 group-hover:opacity-100 transition-opacity">
                        <MdClose size={12}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════ TAB: VARIANTS ══════ */}
          {tab === "variants" && (
            <div className="space-y-6">
              {/* Sizes */}
              <Field label="Available Sizes">
                <div className="flex flex-wrap gap-2 mt-1">
                  {SIZES.map(s => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                        ${selectedSizes.includes(s)
                          ? "bg-[#FF9900] border-[#FF9900] text-black"
                          : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Colors */}
              <Field label="Colors">
                {form.colors.map((c, i) => (
                  <div key={i} className="flex gap-3 mb-2 items-center">
                    <input value={c.name} onChange={e => setColor(i, "name", e.target.value)}
                      placeholder="Color name (e.g. Red)" className={`${inputCls()} flex-1`}/>
                    <div className="flex items-center gap-2 shrink-0">
                      <input type="color" value={c.hex || "#000000"}
                        onChange={e => setColor(i, "hex", e.target.value)}
                        className="w-9 h-9 rounded border border-white/10 cursor-pointer bg-transparent p-0.5"/>
                      <span className="text-xs text-gray-500 w-16">{c.hex || "Pick color"}</span>
                    </div>
                    {form.colors.length > 1 && (
                      <button type="button" onClick={() => removeColor(i)} className="text-red-400 p-1">
                        <MdRemove size={16}/>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addColor}
                  className="flex items-center gap-1 text-[#FF9900] text-xs hover:underline mt-1">
                  <MdAdd size={14}/> Add color
                </button>
              </Field>
            </div>
          )}

          {/* ══════ TAB: SHIPPING ══════ */}
          {tab === "shipping" && (
            <div className="space-y-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Weight (kg)">
                  <input type="number" value={form.weight} onChange={set("weight")} placeholder="0.5" className={inputCls()}/>
                </Field>
                <Field label="Length (cm)">
                  <input type="number" value={form.length} onChange={set("length")} placeholder="30" className={inputCls()}/>
                </Field>
                <Field label="Width (cm)">
                  <input type="number" value={form.width} onChange={set("width")} placeholder="20" className={inputCls()}/>
                </Field>
                <Field label="Height (cm)">
                  <input type="number" value={form.height} onChange={set("height")} placeholder="10" className={inputCls()}/>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Shipping Class">
                  <select value={form.shippingClass} onChange={set("shippingClass")} className={inputCls()}>
                    {SHIPPING_CLASSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Estimated Delivery">
                  <input value={form.estimatedDelivery} onChange={set("estimatedDelivery")}
                    placeholder="3-5 business days" className={inputCls()}/>
                </Field>
              </div>

              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input type="checkbox" checked={form.freeShipping} onChange={set("freeShipping")}
                  className="w-4 h-4 accent-[#FF9900]"/>
                <span className="text-sm text-gray-300">Free Shipping</span>
              </label>

              <hr className="border-white/5 my-4"/>
              <h3 className="text-sm font-bold text-gray-200 mb-3">Return Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isReturnable} onChange={set("isReturnable")}
                    className="w-4 h-4 accent-[#FF9900]"/>
                  <span className="text-sm text-gray-300">Returnable</span>
                </label>
                <Field label="Return Days">
                  <input type="number" value={form.returnDays} onChange={set("returnDays")}
                    placeholder="10" className={inputCls()}/>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Return Conditions">
                    <textarea rows={2} value={form.returnConditions} onChange={set("returnConditions")}
                      placeholder="Conditions for return…" className={inputCls()}/>
                  </Field>
                </div>
              </div>

              <hr className="border-white/5 my-4"/>
              <h3 className="text-sm font-bold text-gray-200 mb-3">Warranty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.hasWarranty} onChange={set("hasWarranty")}
                    className="w-4 h-4 accent-[#FF9900]"/>
                  <span className="text-sm text-gray-300">Has Warranty</span>
                </label>
                {form.hasWarranty && <>
                  <Field label="Warranty Period">
                    <input value={form.warrantyPeriod} onChange={set("warrantyPeriod")}
                      placeholder="1 Year" className={inputCls()}/>
                  </Field>
                  <Field label="Warranty Type">
                    <input value={form.warrantyType} onChange={set("warrantyType")}
                      placeholder="Manufacturer" className={inputCls()}/>
                  </Field>
                </>}
              </div>
            </div>
          )}

          {/* ══════ TAB: SEO ══════ */}
          {tab === "seo" && (
            <div className="space-y-1">
              <Field label="Meta Title" hint="Ideal: 50–60 characters">
                <input value={form.metaTitle} onChange={set("metaTitle")}
                  placeholder="SEO friendly title" className={inputCls()}/>
                <p className="text-xs text-gray-600 mt-0.5">{form.metaTitle.length}/60</p>
              </Field>
              <Field label="Meta Description" hint="Ideal: 120–160 characters">
                <textarea rows={3} value={form.metaDescription} onChange={set("metaDescription")}
                  placeholder="SEO description…" className={inputCls()}/>
                <p className="text-xs text-gray-600 mt-0.5">{form.metaDescription.length}/160</p>
              </Field>
              <Field label="Keywords" hint="Comma separated">
                <input value={form.keywords} onChange={set("keywords")}
                  placeholder="nike shoes, sports shoes, running shoes" className={inputCls()}/>
              </Field>
              <Field label="Tags" hint="Comma separated — used for search">
                <input value={form.tags} onChange={set("tags")}
                  placeholder="shoes, sports, running" className={inputCls()}/>
              </Field>
            </div>
          )}

          {/* ══════ TAB: FLAGS/SETTINGS ══════ */}
          {tab === "flags" && (
            <div className="space-y-3">
              {[
                { field: "isFeatured",   label: "Featured Product",  desc: "Show in featured section" },
                { field: "isNewArrival", label: "New Arrival",        desc: "Mark as new arrival" },
                { field: "isBestSeller", label: "Best Seller",        desc: "Mark as best seller" },
                { field: "isDeal",       label: "Deal / Offer",       desc: "Show in deals section" },
              ].map(({ field, label, desc }) => (
                <label key={field} className="flex items-center justify-between p-4 bg-white/[0.03]
                  rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors relative
                    ${form[field] ? "bg-[#FF9900]" : "bg-white/10"}`}
                    onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all
                      ${form[field] ? "left-6" : "left-1"}`}/>
                  </div>
                </label>
              ))}

              {form.isDeal && (
                <Field label="Deal Expires At">
                  <input type="datetime-local" value={form.dealExpiresAt} onChange={set("dealExpiresAt")}
                    className={inputCls()}/>
                </Field>
              )}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <button type="button" onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 border border-white/10 text-gray-400 hover:text-white
              hover:border-white/30 rounded-xl text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#FF9900] hover:bg-[#F7CA00]
              text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading
              ? <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> Creating…</>
              : <><MdSave size={16}/> Create Product</>}
          </button>
        </div>
      </form>
    </div>
  );
}