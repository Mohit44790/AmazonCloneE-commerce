import React, { useEffect, useState } from 'react'
import { MdAdd, MdChevronRight, MdFavorite, MdRemove, MdShare, MdStar } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    <div className='bg-white min-h-screen'>
      <div className='max-w-screen-xl mx-auto px-4 sm:px-8 py-6'>
         {/* Breadcrumb */}
         <nav className='flex items-center gap-1 text-xs text-gray-500 mb-6 flex-wrap'>
          <Link to="/" className="hover:text-[#c45500]">Home</Link>
 {p.category && <>
 <MdChevronRight size={14}/>
 <Link to={`/product?category=${p.category.slug}`} className="hover:text-[#c45500]">{p.category.name}</Link>
 </>}
 <MdChevronRight size={14}/>
 <span className='text-gray-700 trucate max-w-xs'>{p.name}</span>

         </nav>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ── Images ── */}
             <div className="lg:col-span-1">
                {/* Main Image */}
                  <div className="aspect-square border border-gray-200 rounded-2xl overflow-hidden mb-3 bg-gray-50">
              <img src={primaryImg} alt={p.name} className="w-full h-full object-contain p-4"/>
            </div>
               {/* Thumbnails */}
            {p.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {p.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 transition-all
                      ${i===activeImg ? "border-[#FF9900]" : "border-gray-200 hover:border-gray-400"}`}>
                    <img src={img.url} className="w-full h-full object-cover"/>
                  </button>
                ))}
                
              </div>
            )}
            
             {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <MdFavorite size={18}/> Wishlist
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <MdShare size={18}/> Share
              </button>
            </div>
              </div>

              {/* ── Product Info ── */}
 <div className="lg:col-span-1 space-y-4">
  {/* Title + Brand */}
  <div>
              {p.brand && <p className="text-blue-600 text-sm font-medium mb-1">Visit the {p.brand} Store</p>}
              <h1 className="text-xl font-semibold text-gray-900 leading-snug">{p.name}</h1>
            </div>

                {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <Stars avg={p.rating?.average} count={p.rating?.count}/>
              {p.isBestSeller && (
                <span className="bg-[#FF9900] text-black text-xs font-bold px-2 py-0.5 rounded">#1 Best Seller</span>
              )}
            </div>
               <hr className="border-gray-100"/>
 
            {/* Price */}
             <div>
              {discount > 0 && (
                <p className="text-red-500 text-sm font-semibold mb-0.5">-{discount}% Limited time deal</p>
              )}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">₹{(p.finalPrice||p.price)?.toLocaleString()}</span>
                {p.comparePrice && (
                  <span className="text-gray-400 text-base line-through">M.R.P: ₹{p.comparePrice?.toLocaleString()}</span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-1">Inclusive of all taxes</p>
            </div>

            {/* Sizes */}
      {p.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Size: <span className="text-gray-600 font-normal">{selSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map(s => (
                    <button key={s} onClick={() => setSelSize(s)}
                      className={`w-12 h-10 rounded-lg border-2 text-sm font-semibold transition-all
                        ${selSize===s ? "border-[#FF9900] bg-[#FFF3E0] text-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <Link to="/size-guide" className="text-blue-600 hover:underline text-xs mt-1 inline-block">Size Guide</Link>
              </div>
            )}
               {/* Colors */}
            {p.colors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Color: <span className="text-gray-600 font-normal">{selColor?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.colors.map((c, i) => (
                    <button key={i} onClick={() => setSelColor(c)}
                      className={`w-8 h-8 rounded-full border-4 transition-all
                        ${selColor?.name===c.name ? "border-[#FF9900] scale-110" : "border-white shadow hover:scale-105"}`}
                      style={{ background: c.hex || "#ccc" }}
                      title={c.name}/>
                  ))}
                </div>
              </div>
            )}
             {/* Highlights */}
            {p.highlights?.length > 0 && (
              <ul className="space-y-1">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#FF9900] mt-0.5">•</span> {h}
                  </li>
                ))}
              </ul>
            )}

 </div>
     {/* ── Buy Box ── */}
          <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-4 sticky top-20">
   {/* Price */}
              <p className="text-2xl font-bold text-gray-900">₹{(p.finalPrice||p.price)?.toLocaleString()}</p>
               {/* Delivery */}
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-semibold">FREE Delivery</span> {p.shipping?.freeShipping ? "on this order" : "on orders above ₹499"}</p>
                {p.shipping?.estimatedDelivery && (
                  <p className="text-gray-500">Estimated: {p.shipping.estimatedDelivery}</p>
                )}
              </div>
                 {/* Pincode check */}
              <div>
                <p className="text-sm text-gray-700 mb-1.5">Deliver to</p>
                <div className="flex gap-2">
                  <input value={pincode} onChange={e=>setPincode(e.target.value)} maxLength={6}
                    placeholder="Enter pincode" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FF9900]"/>
                  <button onClick={()=>setPinChecked(true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-blue-600 hover:border-blue-400">
                    Check
                  </button>
                </div>
                {pinChecked && pincode.length===6 && (
                  <p className="text-green-600 text-xs mt-1">✓ Delivery available for {pincode}</p>
                )}
              </div>
                  {/* Stock */}
              <p className={`text-lg font-semibold ${inStock ? "text-green-600" : "text-red-500"}`}>
                {inStock ? (p.stock < 10 ? `Only ${p.stock} left in stock!` : "In Stock") : "Out of Stock"}
              </p>

               {/* Qty */}
              {inStock && (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-700">Qty:</p>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-3 py-2 hover:bg-gray-50 text-gray-600">
                      <MdRemove size={16}/>
                    </button>
                    <span className="px-4 py-2 text-sm font-semibold border-x border-gray-200">{qty}</span>
                    <button onClick={()=>setQty(q=>Math.min(p.stock,q+1))} className="px-3 py-2 hover:bg-gray-50 text-gray-600">
                      <MdAdd size={16}/>
                    </button>
                  </div>
                </div>
              )}

              </div>
          </div>
            </div>

      </div>

    </div>
  )
}

export default ProductDetail