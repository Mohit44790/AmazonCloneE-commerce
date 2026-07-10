import React, { useState, useEffect, useRef } from "react";
import { categoryApi } from "../../../apiData/api/categoryApi";
import {
  MdAdd, MdDelete, MdEdit, MdClose, MdCloudUpload,
  MdCheckCircle, MdError, MdExpandMore, MdExpandLess,
} from "react-icons/md";


const inputCls = (err) => `w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF9900]/50 focus:border-[#FF9900] ${err ? "border-red-500" :"border-white/10"}`;

const TYPES = ["fashion","electronics","home","beauty","sports","books","automotive","grocery","other"];
const GENDERS = ["men","women","unisex","kids"];

const EMPTY_FORM = {
  name:"", description:"", parent:"", type:"other", gender:"",
  displayOrder:"0", isFeatured:false, showInMenu:true, showInHome:false, icon:"",
  metaTitle:"", metaDescription:"",
};

const Category = () => {
const imgRef = useRef();
 
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [errors,     setErrors]     = useState({});
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [deleteModal,setDeleteModal]= useState(null);
  const [editingId,  setEditingId]  = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [expandedIds,setExpandedIds]= useState([]);
  const [search,     setSearch]     = useState("");
 
  const showToast = (msg, type = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };
 
  /* ── Fetch ── */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getTree();
      setCategories(data);
    } catch { showToast("Failed to load categories", "error"); }
    finally { setLoading(false); }
  };
 
  useEffect(() => { fetchCategories(); }, []);
 
  /* ── Helpers ── */
  const set = (f) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [f]: val }));
    setErrors(p => ({ ...p, [f]: "" }));
  };
 
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    const r = new FileReader();
    r.onload = ev => setImgPreview(ev.target.result);
    r.readAsDataURL(file);
  };
 
  const openCreate = () => {
    setEditingId(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreview(null);
    setErrors({}); setShowForm(true);
  };
 
  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name, description: cat.description||"", parent: cat.parent||"",
      type: cat.type||"other", gender: cat.gender||"", displayOrder: cat.displayOrder||"0",
      isFeatured: cat.isFeatured||false, showInMenu: cat.showInMenu??true,
      showInHome: cat.showInHome||false, icon: cat.icon||"",
      metaTitle: cat.seo?.metaTitle||"", metaDescription: cat.seo?.metaDescription||"",
    });
    setImgFile(null); setImgPreview(cat.image?.url || null);
    setErrors({}); setShowForm(true);
  };
 
  /* ── All categories flat for parent selector ── */
  const flattenCats = (cats, depth=0) => {
    let result = [];
    cats.forEach(c => {
      result.push({ _id: c._id, name: c.name, depth });
      if (c.children?.length) result.push(...flattenCats(c.children, depth+1));
    });
    return result;
  };
  const flatCats = flattenCats(categories);
 
  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErrors({ name: "Name is required" }); return; }
 
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "metaTitle" || k === "metaDescription") return;
      fd.append(k, v);
    });
    fd.append("seo", JSON.stringify({ metaTitle: form.metaTitle, metaDescription: form.metaDescription }));
    if (imgFile) fd.append("image", imgFile);
 
    try {
      if (editingId) {
        await categoryApi.update(editingId, fd);
        showToast("Category updated!");
      } else {
        await categoryApi.create(fd);
        showToast("Category created!");
      }
      setShowForm(false); fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
    } finally { setSaving(false); }
  };
 
  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      await categoryApi.delete(deleteModal);
      showToast("Category deleted");
      setDeleteModal(null); fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };
 
  const toggleExpand = (id) =>
    setExpandedIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
 
  /* ── Recursive tree row ── */
  const CategoryRow = ({ cat, depth = 0 }) => {
    const hasChildren = cat.children?.length > 0;
    const isExpanded  = expandedIds.includes(cat._id);
    return (
      <>
               <tr className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
              {hasChildren ? (
                <button type="button" onClick={() => toggleExpand(cat._id)}
                  className="text-gray-400 hover:text-white shrink-0">
                  {isExpanded ? <MdExpandLess size={16}/> : <MdExpandMore size={16}/>}
                </button>
              ) : <span className="w-4"/>}
              {cat.image?.url
                ? <img src={cat.image.url} className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"/>
                : <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base shrink-0">{cat.icon||"📁"}</div>
              }
              <div>
                <p className="text-white text-sm font-medium">{cat.name}</p>
                <p className="text-gray-500 text-[11px]">/{cat.slug}</p>
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{cat.type}</span>
          </td>
          <td className="px-4 py-3 text-gray-400 text-xs">{cat.gender || "—"}</td>
          <td className="px-4 py-3 text-gray-400 text-xs">{cat.level}</td>
          <td className="px-4 py-3 text-gray-400 text-xs">{cat.productCount || 0}</td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              {[
                { key:"showInMenu", label:"Menu" },
                { key:"showInHome", label:"Home" },
                { key:"isFeatured", label:"Featured" },
              ].map(({ key, label }) => cat[key] ? (
                <span key={key} className="text-[10px] bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded">{label}</span>
              ) : null)}
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <button onClick={() => openEdit(cat)}
                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-colors">
                <MdEdit size={15}/>
              </button>
              <button onClick={() => setDeleteModal(cat._id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                <MdDelete size={15}/>
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && hasChildren && cat.children.map(child => (
          <CategoryRow key={child._id} cat={child} depth={depth + 1}/>
        ))}
      </>
    );
  };
 
  const filtered = search
    ? flatCats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : null;

 
  return (
     <div className="text-white space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2
          ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? <MdCheckCircle size={18}/> : <MdError size={18}/>} {toast.msg}
        </div>
      )}

       {/* Header */}
 <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
          <h1 className="text-xl font-bold">Categories</h1>
          <p className="text-gray-400 text-sm">{flatCats.length} total categories</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FF9900] hover:bg-[#f0a500] text-black font-bold rounded-lg text-sm">
          <MdAdd size={16}/> Add Category
        </button>
 </div>
      {/* Search */}
      <div className="bg-[#131720] border border-white/5 rounded-xl p-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF9900]/40"/>
      </div>
 {/* Table */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5">
                  {["Category","Type","Gender","Level","Products","Flags","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {search
                  ? filtered.map(c => (
                      <tr key={c._id} className="hover:bg-white/[0.02] border-b border-white/[0.04]">
                        <td className="px-4 py-3 text-white text-sm" style={{ paddingLeft: c.depth*20+16 }}>{c.name}</td>
                        <td colSpan={5}/>
                      </tr>
                    ))
                  : categories.map(cat => <CategoryRow key={cat._id} cat={cat}/>)
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

   {/* ── Slide-over Form ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={() => setShowForm(false)}/>
          <div className="w-full max-w-md bg-[#131720] border-l border-white/5 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
              <h2 className="text-white font-bold text-base">{editingId ? "Edit Category" : "Create Category"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><MdClose size={20}/></button>
            </div>
 
            <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category Image</label>
                <div onClick={() => imgRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-[#FF9900]/40 rounded-xl p-4
                    flex flex-col items-center gap-2 cursor-pointer transition-colors">
                  {imgPreview
                    ? <img src={imgPreview} className="w-24 h-24 object-cover rounded-xl"/>
                    : <><MdCloudUpload size={32} className="text-gray-500"/><p className="text-xs text-gray-500">Upload image</p></>
                  }
                  <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImg}/>
                </div>
              </div>
 
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Name <span className="text-red-400">*</span>
                </label>
                <input value={form.name} onChange={set("name")} placeholder="Category name" className={inputCls(errors.name)}/>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={set("description")} className={inputCls()}/>
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Icon (emoji)</label>
                <input value={form.icon} onChange={set("icon")} placeholder="👔" className={inputCls()}/>
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Parent Category</label>
                <select value={form.parent} onChange={set("parent")} className={inputCls()}>
                  <option value="">Root (no parent)</option>
                  {flatCats.map(c => (
                    <option key={c._id} value={c._id}>
                      {"—".repeat(c.depth)} {c.name}
                    </option>
                  ))}
                </select>
              </div>
 
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Type</label>
                  <select value={form.type} onChange={set("type")} className={inputCls()}>
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Gender</label>
                  <select value={form.gender} onChange={set("gender")} className={inputCls()}>
                    <option value="">None</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
                  </select>
                </div>
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Display Order</label>
                <input type="number" value={form.displayOrder} onChange={set("displayOrder")} className={inputCls()}/>
              </div>
 
              {/* Toggles */}
              <div className="space-y-2">
                {[
                  { f:"showInMenu",  label:"Show in Menu"      },
                  { f:"showInHome",  label:"Show on Home Page" },
                  { f:"isFeatured",  label:"Featured"          },
                ].map(({ f, label }) => (
                  <label key={f} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-sm text-gray-300">{label}</span>
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${form[f] ? "bg-[#FF9900]" : "bg-white/10"}`}
                      onClick={() => setForm(p => ({ ...p, [f]: !p[f] }))}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form[f] ? "left-5" : "left-0.5"}`}/>
                    </div>
                  </label>
                ))}
              </div>
 
              {/* SEO */}
              <div className="border-t border-white/5 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SEO</p>
                <div className="space-y-3">
                  <input value={form.metaTitle} onChange={set("metaTitle")} placeholder="Meta title" className={inputCls()}/>
                  <textarea rows={2} value={form.metaDescription} onChange={set("metaDescription")} placeholder="Meta description" className={inputCls()}/>
                </div>
              </div>
 
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#FF9900] hover:bg-[#f0a500] text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>}
                  {editingId ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2030] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Delete Category?</h3>
            <p className="text-gray-400 text-sm mb-6">Categories with sub-categories or products cannot be deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2 border border-white/10 text-gray-400 rounded-xl text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Category