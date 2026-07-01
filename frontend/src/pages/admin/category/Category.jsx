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
  return (
    <div>Category</div>
  )
}

export default Category