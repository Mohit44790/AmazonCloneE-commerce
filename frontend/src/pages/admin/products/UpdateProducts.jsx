import React, { useEffect, useRef, useState } from 'react'
import { MdError } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';


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
      
    }


  return (
    <div>UpdateProducts</div>
  )
}

export default UpdateProducts