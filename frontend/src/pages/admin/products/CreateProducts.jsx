import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../apiData/api/productApi";
import { categoryApi } from "../../../apiData/api/categoryApi";
import {
  MdCloudUpload, MdClose, MdAdd, MdRemove, MdSave,
  MdCheckCircle, MdError, MdArrowBack,
} from "react-icons/md";


  const Field = ({label, error,required,Children,hint}) => (
    <div className='mb-4'>
      <label className='block text-sm font-semibold text-gray-300 mb-1'>
        {label} {required && <span className='text-red-400'>*</span>}
      </label>
      {Children}
      {hint && <p className='text-xs text-gray-500 mt-1'>{hint}</p>}
      {error && <p className='text-red-400 text-xs mt-1 flex items-center gap-1'><MdError size/>{error}</p>}
    </div>
  )

  const inputCls = (err) => `w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-[#FF9900]/60 focus:border-[#FF9900] ${err ? "border-red-500" :"border-white/10 hover:border-white/20"}`;

  const SIZES = ["XS","S","M","L","XL","XXL","XXXL","28","30","32","34","36","38","40","42"];
  const GENDERS = ["men","women","unisex","boys","girls","kids"];
  const AGE_GROUPS = ["adults","teen","kids","infant"];
  const STATUSES = ["draft","active","inactive"];
  const SHIPPING_CLASSES = ["standard","express","overnight","free"];

const CreateProducts = () => {
  const navigate = useNavigate();
  const imgRef = useRef();

  /* ── State ── */
  const [form , setForm] = useState({
    name:"",
    description:"",
    shortDescription:"",
    price:"",
    comparePrice:"",
    brand:"",
    stock:"",
    sku:"",
    status:"draft",
    category:"",
    subCategory:"",
    subSubCategory:"",
    gender:"",
    ageGroup:"",
    tags:"",
    // shipping
    weight:"",
    length:"",
    width:"",
    height:"",
    freeShipping:false,
    shippingClass:"standard",
    estimatedDelivery:"", 
    // return
    isReturnable:true,
    returnDays:"10",
    returnCondition:"",
    //warrenty
    hasWarrenty:false , 
    warrentyPeriod:"",
    warrantyType:"",
    //seo
    metaTitle:"",
    metaDescription:"",
    keywords:"",

    //flags
    isFeature:false,
    isNewArrival:false,
    isBestSeller:false,
    isDeal:false,
    dealExpiredsAt:"",
    //highlights

    highlights:[""],
    //colors
    colors:[{name:"",hex:""}],
  });

  const [errors, setErrors] = useState({});
  const [loading,setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  //sizes
  const[selectedSizes, setSelectedSizes] = useState([]);

  //images
  const [imagesFiles , setImagesFiles] = useState([]);
  const [imagesPreviews , setImagePreviews] = useState([]);
  //categories
  const [rootCats,setRootcats] = useState([]);
  const [subCats , setSubCats] = useState([]);
  const [subSubCats , setSubSubCats] = useState([]);

  //active tabs
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

  useEffect(() =>{
    if(!form.subCategory) {setSubSubCats([])
      return;
    }
    categoryApi.getAll({parent:form.subCategory , tree:"false"}).then(setSubSubCats).catch(() => {});
  },[form.subCategory]);

  // Handlers 
  const set = (field) =>(e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({...f,[field]:val}));
    setErrors(er => ({...er,[field]:""}));
  };

  const handleImages = (e) =>{
    const files = Array.from(e.target.files).slice(0,10 - imagesFiles.length);
    setImagesFiles(prev =>[...prev,...files]);
    files.forEach(f =>{
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(p => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage =(i) =>{
    setImageFiles(p => p.filter((_,idx) => idx !== i));
    setImagePreviews(p => p.filter((_,idx) => idx !== i));
  };

  const toggleSize =(s) => 
    setSelectedSizes(p => p.includes(s) ? p.filter(x => x !==s) : [...p,s]);

 
 const addHighlight = () => setForm(f => ({ ...f, highlights: [...f.highlights, ""] }));
  const setHighlight = (i, v) => setForm(f => {
    const h = [...f.highlights]; h[i] = v; return { ...f, highlights: h };
  });
  const removeHighlight = (i) => setForm(f => ({
    ...f, highlights: f.highlights.filter((_, idx) => idx !== i)
  }));

   const addColor = () => setForm(f => ({ ...f, colors: [...f.colors, { name: "", hex: "" }] })); 
const setColor = (i,field,v) => setForm(f => {
  const c = [...f.colors]; c[i] = {...c[i],[field]:v}; return {...f,colors:c};
});
const removeColor = (i) => setForm(f => ({...f, colors: f.colors.filter((_, idx) => idx !==i)}));

 /* ── Validate ── */
 const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price ) e.price = "Price is required";
    else if (isNaN(form.price) || +form.price < 0) e.price = "Enter a valid price";
    if (!form.stock && form.stock !== 0) e.stock = "Stock is required";
    if (!form.category) e.category = "Category is required";
    if (imageFiles.length === 0) e.images = "At least one image is required";
    return e;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {setErrors(errs);setTab("basic"); return;}
    setLoading(true);
    setServerError("");

    const fd = new FormData();
    //Basic
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("shortDescription", form.shortDescription.trim());
    fd.append("price",form.price);
    if(form.comparePrice) fd.append(("comparePrice"), form.comparePrice);
    fd.append("brand", form.brand.trim());
    fd.append("stock", form.stock);
    if(form.sku) fd.append("sku", form.sku.trim());
    fd.append("status", form.status);
    fd.append("category", form.category);
    if(form.subCategory) fd.append("subCategory", form.subCategory);
    if(form.subSubCategory) fd.append("subSubCategory", form.subSubCategory);
    if(form.gender) fd.append("gender", form.gender);
    if(form.ageGroup) fd.append("ageGroup", form.ageGroup);

      // Tags
    if (form.tags) fd.append("tags", form.tags)

      //Sizes
      if(selectedSizes.length) fd.append("sizes", selectedSizes.join(","));

         // Highlights
    form.highlights.filter(Boolean).forEach(h => fd.append("highlights", h));
 
    // Colors
    const validColors = form.colors.filter(c => c.name);
    if(validColors.length) fd.append("colors", JSON.stringify(validColors));

    //Shipping
    fd.append("shipping", JSON.stringify({
      weight: +form.weight || 0,
      dimensions: {
        length: +form.length || 0, width: +form.width || 0, height: +form.height || 0

      },
      freeShipping:form.freeShipping,
      shippingClass: form.shippingClass,
      estimatedDelivery: form.estimatedDelivery,
    }));

    //warranty
    fd.append("warranty",JSON.stringify({
      hasWarrenty: form.hasWarrenty,
      warrentyPeriod: form.warrentyPeriod,
      warrantyType: form.warrantyType,
    }));

    //SEO
    fd.append("seo", JSON.stringify({
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
    }));

    //Flags
    fd.append("isFeature", form.isFeature);
    fd.append("isNewArrival", form.isNewArrival);
    fd.append("isBestSeller", form.isBestSeller);
    fd.append("isDeal", form.isDeal);
    if(form.isDeal && form.dealExpiredsAt) fd.append("dealExpiredsAt", form.dealExpiredsAt);

    //Images
    imagesFiles.forEach(f => fd.append("images", f));

    try{
      await productApi.create(fd);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"),2000);
    }catch(err){
      setServerError(err.response?.data?.message || "Failed to create product. Try again.");
    }finally{
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

  if(success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-4" >
      <MdCheckCircle size={60} className="text-green-400"/>
      <h2 className="text-2xl font-bold">Product Created!</h2>
      <p className="text-gray-400">Redirecting to products page list...</p>
    </div>
  )

  return (
    <div className='text-white'>
      
    </div>
  )
}

export default CreateProducts