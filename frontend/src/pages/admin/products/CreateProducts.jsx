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


  
  return (
    <div className='text-white'>
      
    </div>
  )
}

export default CreateProducts