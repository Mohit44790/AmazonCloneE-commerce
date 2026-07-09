import React, { useState, useEffect, useRef } from "react";
// import { categoryApi } from "../../api/categoryApi";
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
    <div>Category</div>
  )
}

export default Category