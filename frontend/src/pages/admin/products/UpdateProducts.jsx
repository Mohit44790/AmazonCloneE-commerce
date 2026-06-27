import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { categoryApi } from '../../../apiData/api/categoryApi';
import { productApi } from '../../../apiData/api/productApi';
import {
  MdArrowBack, MdSave, MdCloudUpload, MdClose,
  MdAdd, MdRemove, MdCheckCircle, MdError,
} from "react-icons/md";

const inputCls = (err) => `w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-[#FF9900]/60 focus:border-[#FF9900] ${err ? "border-white/10" : "border-white/10 hover:border-white/20"}`;

const Field = ({label,error,required,children ,hint}) =>(
  <div className='mb-4'>
    <label className="block text-sm font-semibold text-gray-300 mb-1">
    {label}{required && <span className='text-red-400 ml-1'>*</span>}
    </label>
    {children}
    {hint && <p className='text-xs text-gray-500 mt-1'>{hint}</p>}
    {error && <p className='text-red-400 text-xs mt-1 flex items-center gap-1'><MdError size={12}/>{error}</p>}
  </div>
)

const SIZES = ["XS","S","M","L","XL","XXL","XXXL","28","30","32","34","36","38","40","42"];
const GENDERS = ["men","women","unisex","boys","girls","kids"];
const AGE_GROUPS = ["adult","teen","kids","infant"];
const STATUSES = ["draft","active","inactive","discontinued"];


const UpdateProducts = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const imgRef = useRef();
  const [tab ,setTab] = useState("basic");
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [success , setSuccess] = useState(false);
  const [serverError ,setServerError] = useState("");
  const [errors, setErrors] = useState({});

  // form 
  const [form,setForm] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // image 
  const [exitingImages , setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews,setNewPreviews] = useState([]);
  const [toDelete,setToDelete] = useState([]);

  //categories
  const [rootCats,setRootCats] = useState([]);
  const [subCats,setSubCats] = useState([]);
  const [subSubCats,setSubSubCats] = useState([]);

  // Load product 
  useEffect(() => {
    (async () =>{
      try {
        const {product} = await productApi.getById(id);
        setExistingImages(product.images || []);
        setSelectedSizes(product.sizes || []);
        setForm({
          name: product.name || "",
          description:product.description || "",
          shortDescription: product.shortDescription || "",
          price: product.price || "",
          comparePrice: product.comparePrice || "",
          brand: product.brand || "",
          stock: product.stock || "",
          sku: product.sku || "",
          status: product.status || "draft",
          category: product.category?._id || "",
          subCategory: product.subCategory?._id || "",
          subSubCategory: product.SubSubCategory?._id || "",
          gender: product.gender || "",
          ageGroup: product.ageGroup || "",
          tags :(product.tags || []).join(","),
          highlights: product.highlights?.lengtj ? product.highlights : [""],
          colors: product.colors?.length ? product.colors : [{name:"",hex:""}],
          
          //shipping
          weight: product.shipping?.weight || "",
          length: product.shipping?.dimensions?.length || "",
          width: product.shipping?.dimensions?.width || "",
          height: product.shipping?.dimensions?.height || "",
          freeShipping: product.shipping?.freeShipping || false,
          shippingClass: product.shipping?.shippingClass || "standard",
          estimatedDelivery: product.shipping?.estimatedDelivery || "",

          // return
          isReturnable: product.returnPolicy?.isReturnable ?? true,
          returnDays: product.returnPolicy.returnDays || "10",
          returnConditions: product.returnPolicy?.returnConditions || "",

          //warrenty
          haswarranty: product.warranty?.haswarranty || false,
          warrantyPeriod: product.warranty?.warrantyPeriod || "",
          warrantyType: product.warranty?.warrantyType || "",

          // seo
            metaTitle:       product.seo?.metaTitle       || "",
          metaDescription: product.seo?.metaDescription || "",
          keywords:        (product.seo?.keywords || []).join(", "),
          // flags
          isFeatured:   product.isFeatured   || false,
          isNewArrival: product.isNewArrival || false,
          isBestSeller: product.isBestSeller || false,
          isDeal:       product.isDeal       || false,
          dealExpiresAt: product.dealExpiresAt ? product.dealExpiresAt.slice(0,16) : "",

        })
      }catch { setServerError("Failed to load product."); }
      finally  { setLoading(false); }
    })();
  }, [id]);
 /* ── Load categories ── */

 useEffect(() => {
  categoryApi.getAll({parent:"null",tree:"false"}).then(setRootCats).catch(() =>{});
 },[]);

 useEffect(() => {
  if(!form?.category){setSubCats([]);return}
  categoryApi.getAll({parent:form.category,tree:"false"}).then(setSubCats).catch(() => {});
 },[form?.category]);
 useEffect(() => {
  if(!form?.subCategory){setSubCats([]); return}
  categoryApi.getAll({parent: form.subCategory, tree:"false"}).then(setSubSubCats).catch(()=>{})
 },[form?.subCategory]);
  
  /* ── Helpers ── */
  const set = (field) => (e) =>{
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({...f,[field]:val}));
    setErrors(er =>({...er,[field]: ""}));
  };

  const handleNewImages =(e) => {
    const files = Array.from(e.target.filed).slice(0,10 -exitingImages.length - newFiles.length);
    setNewFiles(p => [...p, ...files]);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => setNewPreviews(p =>[...p,ev.target.result]);
      r.readAsDataURL(f);
    });
  };

  const markDelete =(publicId) =>{
    setToDelete(p => [...p, publicId]);
    setExistingImages(p => p.filter(i => i.public_id !== publicId));
  };

  const removeNew =(i) => {
    setNewFiles(p => p.filter((_,idx) => idx !==i));
    setNewPreviews(p =>p.filter((_,idx) => idx !==i));
  };

  const toggleSize = (s) =>
    setSelectedSizes(p =>p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const setHighlight = (i,v) => setForm(f => {
    const h = [...f.highlights]; h[i] = v; return {...f,highlights:h};
  });

  const addHighlight = () => setForm(f => ({...f,highlights: [...f.highlights,""]}));

  const removeHighlight = (i) => setForm(f => ({...f, highlights:filter((_,idx) => idx !== i)}));

  const setColor = (i, field, v) =>setForm(f => {
    const c = [...f.colors]; c[i] = {...c[i],[field]:v}; return {...f,colors:c};
  });

  const addColor = () => setForm(f =>({...f, colors:[...f.colors, {name:"",hex:""}]}));

   const removeColor = (i) => setForm(f => ({ ...f, colors: f.colors.filter((_,idx) => idx !== i) }));

    /* ── Validate ── */

    const validate = () => {
      const e = {};
      if (!form.name.trim()) e.name = "Required";
      if (!form.description.trim()) e.description = "Required";
      if (!form.price) e.price = "Required";
      if (!form.category)  e.category = "Required";
      return e;
    }


    /* ── Submit ── */
    const handleSubmit = async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {setErrors(errs); setTab("basic"); return;}

      setSaving(true); setServerError("");
      const fd = new FormData();

      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("shortDescription" , form.shortDescription.trim());
      fd.append("price", form.price);
      if (form.comparePrice) fd.append("comparePrice" , form.comparePrice);
      fd.append("brand", form.brand.trim());
      fd.append("stock" , form.stock);
      fd.append("status","form.status");
      fd.append("category" , form.category);
      if(form.subCategory) fd.append("subCategory",form.subCategory);
      if(form.subSubCategory) fd.append("subSubCategory",form.subSubCategory);
      if(form.gender) fd.append("gender" ,form.gender);
      if(form.ageGroup) fd.append("ageGroup" , form.ageGroup);
      if(form.tags) fd.append("tags",form.tags);
      if(selectedSizes.length) fd.append("sizes",selectedSizes.join(","));
      form.highlights.filter(Boolean).forEach(h => fd.append("highlights",h));
      const validColors = form.colors.filter(c => c.name);
      if(validColors.length) fd.append("colors", JSON.stringify(validColors));

      fd.append("shipping", JSON.stringify({
        weight: +form.weight || 0,
        dimensions: {length: +form.length || 0, width: +form.width || 0, height: +form.height || 0},
        freeShipping: form.freeShipping, shippingClass: form.shippingClass, estimatedDelivery:form.estimatedDelivery
      }));
      fd.append("returnPolicy", JSON.stringify({
        isReturnable, returnDays: +form.returnDays || 10, returnConditions: form.returnConditions,
      }));
      fd.append("warrenty",JSON.stringify({
        hasWarranty: form.hasWarranty, warrantyPeriod: form.warrantyPeriod, warrantyType: form.warrantyType,
      }));
      fd.append("seo", JSON.stringify({
        metaTitle: form.metaTitle, metaDescription: form.metaDescription,
        keywords: form.keywords.split(",").map(k=>k.trim()).filter(Boolean),
      }));

      fd.append("isFeatured", form.isFeatured);
      fd.append("isNewArrival", form.isNewArrival);
      fd.append("isBestSeller",form.isBestSeller);
      fd.append("isDeal",       form.isDeal);
    if (form.isDeal && form.dealExpiresAt) fd.append("dealExpiresAt", form.dealExpiresAt);
 
    if (toDelete.length) toDelete.forEach(pid => fd.append("deleteImages", pid));
    newFiles.forEach(f => fd.append("images", f));
 
    try {
      await productApi.update(id, fd);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed.");
    } finally { setSaving(false); }
  };

   const TABS = [
    { id: "basic",    label: "Basic",    dot: errors.name || errors.description || errors.price || errors.category },
    { id: "media",    label: "Images"  },
    { id: "variants", label: "Variants" },
    { id: "shipping", label: "Shipping" },
    { id: "seo",      label: "SEO"      },
    { id: "flags",    label: "Settings" },
  ];

   if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
    </div>
  );
 
  if (success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-4">
      <MdCheckCircle size={60} className="text-green-400"/>
      <h2 className="text-2xl font-bold">Product Updated!</h2>
      <p className="text-gray-400">Redirecting…</p>
    </div>
  );
 
  if (!form) return <div className="text-red-400 p-6">{serverError || "Product not found."}</div>;
  
  return (
    <div className="text-white max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/products")}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
          <MdArrowBack size={20}/>
        </button>
        <div>
          <h1 className="text-xl font-bold">Update Product</h1>
          <p className="text-gray-400 text-sm truncate max-w-xs">{form.name}</p>
        </div>
      </div>
 
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4 flex items-center gap-2">
          <MdError size={18}/>{serverError}
        </div>
      )}
 
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all relative min-w-[70px]
              ${tab === t.id ? "bg-[#FF9900] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {t.label}
            {t.dot && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full"/>}
          </button>
        ))}
      </div>
 
      <form onSubmit={handleSubmit}>
        <div className="bg-[#131720] border border-white/5 rounded-2xl p-6">
 
          {/* BASIC */}
          {tab === "basic" && (
            <div className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Product Name" required error={errors.name}>
                    <input value={form.name} onChange={set("name")} className={inputCls(errors.name)}/>
                  </Field>
                </div>
                <Field label="Price (₹)" required error={errors.price}>
                  <input type="number" value={form.price} onChange={set("price")} className={inputCls(errors.price)}/>
                </Field>
                <Field label="Compare Price (₹)">
                  <input type="number" value={form.comparePrice} onChange={set("comparePrice")} className={inputCls()}/>
                </Field>
                <Field label="Stock" required>
                  <input type="number" value={form.stock} onChange={set("stock")} className={inputCls()}/>
                </Field>
                <Field label="Brand">
                  <input value={form.brand} onChange={set("brand")} className={inputCls()}/>
                </Field>
                <Field label="SKU">
                  <input value={form.sku} onChange={set("sku")} className={inputCls()}/>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={set("status")} className={inputCls()}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Category" required error={errors.category}>
                  <select value={form.category} onChange={set("category")} className={inputCls(errors.category)}>
                    <option value="">Select</option>
                    {rootCats.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                </Field>
                {subCats.length > 0 && (
                  <Field label="Sub Category">
                    <select value={form.subCategory} onChange={set("subCategory")} className={inputCls()}>
                      <option value="">None</option>
                      {subCats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </Field>
                )}
                {subSubCats.length > 0 && (
                  <Field label="Sub-Sub Category">
                    <select value={form.subSubCategory} onChange={set("subSubCategory")} className={inputCls()}>
                      <option value="">None</option>
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
              <Field label="Short Description">
                <textarea rows={2} value={form.shortDescription} onChange={set("shortDescription")} className={inputCls()}/>
              </Field>
              <Field label="Description" required error={errors.description}>
                <textarea rows={5} value={form.description} onChange={set("description")} className={inputCls(errors.description)}/>
              </Field>
              <Field label="Highlights">
                {form.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={h} onChange={e => setHighlight(i, e.target.value)}
                      placeholder={`Highlight ${i+1}`} className={inputCls()}/>
                    {form.highlights.length > 1 && (
                      <button type="button" onClick={() => removeHighlight(i)} className="text-red-400 p-2"><MdRemove size={16}/></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addHighlight}
                  className="text-[#FF9900] text-xs flex items-center gap-1 hover:underline mt-1">
                  <MdAdd size={14}/> Add highlight
                </button>
              </Field>
            </div>
          )}
 
          {/* MEDIA */}
          {tab === "media" && (
            <div>
              <p className="text-gray-400 text-sm mb-4">Manage product images. First image = primary.</p>
              {/* Existing */}
              {existingImages.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Current Images</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {existingImages.map((img, i) => (
                      <div key={img.public_id} className="relative group aspect-square">
                        <img src={img.url} className="w-full h-full object-cover rounded-lg border border-white/10"/>
                        {img.isPrimary && (
                          <span className="absolute top-1 left-1 bg-[#FF9900] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">PRIMARY</span>
                        )}
                        <button type="button" onClick={() => markDelete(img.public_id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MdClose size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* New uploads */}
              <div onClick={() => imgRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-[#FF9900]/50 rounded-xl p-6
                  flex flex-col items-center gap-2 cursor-pointer transition-colors mb-4">
                <MdCloudUpload size={36} className="text-gray-500"/>
                <p className="text-gray-400 text-sm">Upload new images</p>
                <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages}/>
              </div>
              {newPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {newPreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={src} className="w-full h-full object-cover rounded-lg border border-[#FF9900]/30"/>
                      <span className="absolute top-1 left-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                      <button type="button" onClick={() => removeNew(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MdClose size={12}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
 
          {/* VARIANTS */}
          {tab === "variants" && (
            <div className="space-y-6">
              <Field label="Available Sizes">
                <div className="flex flex-wrap gap-2 mt-1">
                  {SIZES.map(s => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                        ${selectedSizes.includes(s) ? "bg-[#FF9900] border-[#FF9900] text-black" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Colors">
                {form.colors.map((c, i) => (
                  <div key={i} className="flex gap-3 mb-2 items-center">
                    <input value={c.name} onChange={e => setColor(i,"name",e.target.value)}
                      placeholder="Color name" className={`${inputCls()} flex-1`}/>
                    <input type="color" value={c.hex||"#000000"} onChange={e => setColor(i,"hex",e.target.value)}
                      className="w-9 h-9 rounded border border-white/10 cursor-pointer bg-transparent p-0.5"/>
                    {form.colors.length > 1 && (
                      <button type="button" onClick={() => removeColor(i)} className="text-red-400 p-1"><MdRemove size={16}/></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addColor} className="text-[#FF9900] text-xs flex items-center gap-1 hover:underline mt-1">
                  <MdAdd size={14}/> Add color
                </button>
              </Field>
              <Field label="Tags" hint="Comma separated">
                <input value={form.tags} onChange={set("tags")} placeholder="shoes, sports, running" className={inputCls()}/>
              </Field>
            </div>
          )}
 
          {/* SHIPPING */}
          {tab === "shipping" && (
            <div className="space-y-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[["weight","Weight (kg)"],["length","Length (cm)"],["width","Width (cm)"],["height","Height (cm)"]].map(([f,l]) => (
                  <Field key={f} label={l}>
                    <input type="number" value={form[f]} onChange={set(f)} className={inputCls()}/>
                  </Field>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Shipping Class">
                  <select value={form.shippingClass} onChange={set("shippingClass")} className={inputCls()}>
                    {["standard","express","overnight","free"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Estimated Delivery">
                  <input value={form.estimatedDelivery} onChange={set("estimatedDelivery")} placeholder="3-5 business days" className={inputCls()}/>
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input type="checkbox" checked={form.freeShipping} onChange={set("freeShipping")} className="w-4 h-4 accent-[#FF9900]"/>
                <span className="text-sm text-gray-300">Free Shipping</span>
              </label>
              <hr className="border-white/5 my-4"/>
              <h3 className="text-sm font-bold text-gray-200 mb-3">Return Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isReturnable} onChange={set("isReturnable")} className="w-4 h-4 accent-[#FF9900]"/>
                  <span className="text-sm text-gray-300">Returnable</span>
                </label>
                <Field label="Return Days">
                  <input type="number" value={form.returnDays} onChange={set("returnDays")} className={inputCls()}/>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Return Conditions">
                    <textarea rows={2} value={form.returnConditions} onChange={set("returnConditions")} className={inputCls()}/>
                  </Field>
                </div>
              </div>
              <hr className="border-white/5 my-4"/>
              <h3 className="text-sm font-bold text-gray-200 mb-3">Warranty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.hasWarranty} onChange={set("hasWarranty")} className="w-4 h-4 accent-[#FF9900]"/>
                  <span className="text-sm text-gray-300">Has Warranty</span>
                </label>
                {form.hasWarranty && <>
                  <Field label="Period"><input value={form.warrantyPeriod} onChange={set("warrantyPeriod")} placeholder="1 Year" className={inputCls()}/></Field>
                  <Field label="Type"><input value={form.warrantyType} onChange={set("warrantyType")} placeholder="Manufacturer" className={inputCls()}/></Field>
                </>}
              </div>
            </div>
          )}
 
          {/* SEO */}
          {tab === "seo" && (
            <div className="space-y-1">
              <Field label="Meta Title" hint="50-60 chars">
                <input value={form.metaTitle} onChange={set("metaTitle")} className={inputCls()}/>
                <p className="text-xs text-gray-600 mt-0.5">{form.metaTitle.length}/60</p>
              </Field>
              <Field label="Meta Description" hint="120-160 chars">
                <textarea rows={3} value={form.metaDescription} onChange={set("metaDescription")} className={inputCls()}/>
                <p className="text-xs text-gray-600 mt-0.5">{form.metaDescription.length}/160</p>
              </Field>
              <Field label="Keywords" hint="Comma separated">
                <input value={form.keywords} onChange={set("keywords")} className={inputCls()}/>
              </Field>
            </div>
          )}
 
          {/* FLAGS */}
          {tab === "flags" && (
            <div className="space-y-3">
              {[
                { field:"isFeatured",   label:"Featured Product",  desc:"Show in featured section" },
                { field:"isNewArrival", label:"New Arrival",        desc:"Mark as new arrival" },
                { field:"isBestSeller", label:"Best Seller",        desc:"Mark as best seller" },
                { field:"isDeal",       label:"Deal / Offer",       desc:"Show in deals section" },
              ].map(({ field, label, desc }) => (
                <label key={field} onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
                  className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors">
                  <div><p className="text-sm font-semibold text-white">{label}</p><p className="text-xs text-gray-500">{desc}</p></div>
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${form[field] ? "bg-[#FF9900]" : "bg-white/10"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form[field] ? "left-6" : "left-1"}`}/>
                  </div>
                </label>
              ))}
              {form.isDeal && (
                <Field label="Deal Expires At">
                  <input type="datetime-local" value={form.dealExpiresAt} onChange={set("dealExpiresAt")} className={inputCls()}/>
                </Field>
              )}
            </div>
          )}
        </div>
 
        {/* Submit */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <button type="button" onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-xl text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#FF9900] hover:bg-[#f0a500] text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
            {saving
              ? <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> Saving…</>
              : <><MdSave size={16}/> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProducts