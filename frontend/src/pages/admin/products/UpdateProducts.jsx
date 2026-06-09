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

  
  return (
    <div>UpdateProducts</div>
  )
}

export default UpdateProducts