import React from 'react'


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
  const [loading , setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const [search, setSearch] = useState("");

  const showToast = (msg ,type = "success") => {
    setToast({msg,type}); setTimeout(() =>setToast(null),3000);


  }

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
 setForm(p ({...p, [f]: val}));
 setErrors(p => ({...p , [f]: ""}));
};

const handleImg = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  setImgFile(file);
  const r = new FileReader();
  r.onload = ev => setImgPreview(ev.target.result);
  r.readAsDataURL(file);
};

const openCreate = () => {
  setEditingId(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreivew(null);
  setErrors({}); setShowForm(true);
};

const openEdit = (cat) => {
  setEditingId(cat._id);
  setForm({
    name: cat.name, description: cat.description || "", parent: cat.parent || "",
    type: cat.type || "other", gender: cat.gender || "", displayOrder: cat.displayOrder || "0",
    isFeatured: cat.isFeatured || false, showInMenu: cat.showInMenu??true,
    showInHome: cat.showInHome || false, icon: cat.icon || "",
    metaTitle: cat.seo?.metaTitle || "", metaDescription: cat.seo?.metaDescription || "",
  });
  setImgFile(null); setImgPreview(cat.images?.url || null);
  setErrors({}); setShowForm(true);
}

/* ── All categories flat for parent selector ── */
const flattenCats = (cats, depth=0) => {
  let result = [];
  cats.forEach(c => {
    result.push({_id: c._id, name: c.name, depth});
    if(c.children?.length) result.push(...flattenCats(c.children, depth+1));
  });
  return result;
};

const flatCats = flattenCats(categories);
/* ── Submit ── */
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!form.name.trim()) {setErrors({name:"Name is required "}); return;}

  setSaving(true);
  const fd = new FormData();
  Object.entries(form).forEach(([k,v]) => {
    if(k === "metaTitle" || k === "metaDescription") return;
    fd.append(k, v);
  });
  fd.append("seo" , JSON.stringify({metaTitle: form.metaTitle, metaDescription: form.metaDescription}));
  if(imgFile) fd.append("image", imgFile);

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
 
   
  return (
    <div>Category</div>
  )
}

export default Category