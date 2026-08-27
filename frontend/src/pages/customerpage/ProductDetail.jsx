import React, { useEffect, useState } from 'react'
import { MdStar } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../apiData/store/cartStore';
import { productApi } from '../../apiData/api/productApi';


const Stars = ({ avg = 0, count, size = 16 }) => (
    <div className ="flex items-center gap-1">
        {[1,2,3,4,5].map(i  =>(
            <MdStar key={i} size={size} className={i<=Math.round(avg)?"text-[#FF9900]":"text-gray-200"}/>
        ))}
        {count !== undefined && <span className="text-sm text-blue-600 ml-1">{count} rating</span>}

    </div>

)

const RatingBar = ({ star, count, total }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-blue-600 w-14 text-right shrink-0">{star} star</span>
    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-[#FF9900] rounded-full transition-all"
        style={{ width: total ? `${(count/total)*100}%` : "0%" }}/>
    </div>
    <span className="text-blue-600 w-8 shrink-0">{total ? Math.round((count/total)*100) : 0}%</span>
  </div>
);

const ProductDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore(s => s.addItem);
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeImg,  setActiveImg]  = useState(0);
  const [qty,        setQty]        = useState(1);
  const [selSize,    setSelSize]    = useState("");
  const [selColor,   setSelColor]   = useState(null);
  const [added,      setAdded]      = useState(false);
  const [pincode,    setPincode]    = useState("");
  const [pinChecked, setPinChecked] = useState(false);
  const [tab,        setTab]        = useState("description");
     
    useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await productApi.getById(id);
        setData(res);
        if (res.product?.sizes?.length)  setSelSize(res.product.sizes[0]);
        if (res.product?.colors?.length) setSelColor(res.product.colors[0]);
      } catch { navigate("/products"); }
      finally { setLoading(false); }
    })();
  }, [id]);

   const handleAddToCart = () => {
    if (!data) return;
    addToCart(data.product, qty, { size: selSize, color: selColor?.name });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (!data) return null;


    const { product: p, relatedProducts } = data;
  const primaryImg = p.images?.[activeImg]?.url || "/placeholder.png";
  const inStock    = p.stock > 0;
  const discount   = p.comparePrice && p.comparePrice > p.price
    ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0;
 
  const totalRatings = p.rating?.count || 0;

  return (
    <div>ProductDetail</div>
  )
}

export default ProductDetail