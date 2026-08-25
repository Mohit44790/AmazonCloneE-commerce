import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryApi } from '../apiData/api/categoryApi';
import { productApi } from '../apiData/api/productApi';
import { MdStar, MdArrowForward, MdLocalShipping, MdSecurity, MdReplay } from "react-icons/md";
import { useCartStore } from "../apiData/store/cartStore";

// * ── Star Rating ── */
const Stars = ({ avg = 0, count }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <MdStar key={i} size={13} className={i<=Math.round(avg)?"text-[#FF9900]":"text-gray-300"}/>
    ))}
    {count !== undefined && <span className="text-xs text-gray-500 ml-0.5">({count})</span>}
  </div>
);

/* ── Product Card ── */
const ProductCard = ({p}) => {
    const addToCart = useCartStore(s => s.addItem);
    const navigate = useNavigate();
    return(
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer border-gray-100"
        onClick={() => navigate(`/product/${p.slug}`)}>
            <div className="aspect-square overflow-hidden bg-gray-50 relative">
                <img src={p.images?.[0]?.url || "/placeholder.jpg"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                {p.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2">
    -{p.discount}%
                    </span>
                )}
                 {p.isBestSeller && (
          <span className="absolute top-2 right-2 bg-[#FF9900] text-black text-[10px] font-bold px-2 py-0.5 rounded">
            BESTSELLER
          </span>
        )}

            </div>
            <div className="p-3">
        <p className="text-gray-800 text-sm font-medium leading-tight line-clamp-2 mb-1">{p.name}</p>
        <Stars avg={p.rating?.average} count={p.rating?.count}/>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-gray-900 font-bold text-base">₹{p.finalPrice?.toLocaleString() || p.price?.toLocaleString()}</span>
          {p.comparePrice && <span className="text-gray-400 text-xs line-through">₹{p.comparePrice?.toLocaleString()}</span>}
        </div>
        {p.shipping?.freeShipping && (
          <p className="text-green-600 text-[11px] mt-1 flex items-center gap-1"><MdLocalShipping size={12}/> FREE Delivery</p>
        )}
        <button
          onClick={e => { e.stopPropagation(); addToCart(p); }}
          className="w-full mt-2 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 text-xs font-bold rounded-full transition-colors">
          Add to Cart
        </button>
      </div>

        </div>
    );
};

/* ── Section Header ── */
const SectionHeader = ({ title, subtitle, to }) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {to && (
      <Link to={to} className="flex items-center gap-1 text-[#0066c0] hover:text-[#c45500] text-sm font-medium">
        See all <MdArrowForward size={16}/>
      </Link>
    )}
  </div>
);

const HERO_SLIDES = [
  { bg: "from-[#0F1B2D] to-[#1A2E4A]", badge: "🎉 Grand Sale", title: "Up to 70% Off on Electronics", sub: "Laptops, Phones, TVs & more", cta: "Shop Now", to: "/products?category=electronics", img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop" },
  { bg: "from-[#2D0F0F] to-[#4A1A1A]", badge: "👗 New Season", title: "Fashion Trends 2026",          sub: "Latest styles for Men & Women",  cta: "Explore",  to: "/products?category=fashion",     img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop" },
  { bg: "from-[#0F2D1A] to-[#1A4A28]", badge: "🏠 Home Decor", title: "Transform Your Space",         sub: "Furniture, Kitchen & More",     cta: "Discover", to: "/products?category=home",        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop" },
];

const Dashboard = () => {
  const navigate = useNavigate();
 
  const [heroIdx,   setHeroIdx]   = useState(0);
  const [featured,  setFeatured]  = useState([]);
  const [newArr,    setNewArr]    = useState([]);
  const [deals,     setDeals]     = useState([]);
  const [homeCats,  setHomeCats]  = useState([]);
  const [loading,   setLoading]   = useState(true);

    /* ── Auto-advance hero ── */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* ── Fetch data ── */
  useEffect(() => {
    (async () => {
      try {
        const [featRes, newRes, dealRes, catRes] = await Promise.all([
          productApi.getAll({ isFeatured: "true",  limit: 8 }),
          productApi.getAll({ isNewArrival: "true", limit: 8 }),
          productApi.getAll({ isDeal: "true",       limit: 8 }),
          categoryApi.getHome(),
        ]);
        setFeatured(featRes.data.products);
        setNewArr(newRes.data.products);
        setDeals(dealRes.data.products);
        setHomeCats(catRes);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

   const slide = HERO_SLIDES[heroIdx];
  return (
     <div className="bg-gray-50 min-h-screen">
 
      {/* ── HERO BANNER ── */}
      <div className={`relative bg-gradient-to-r ${slide.bg} overflow-hidden`} style={{minHeight:320}}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-12 flex items-center gap-8">
          <div className="flex-1 text-white z-10">
            <span className="inline-block bg-[#FF9900] text-black text-xs font-bold px-3 py-1 rounded-full mb-4">{slide.badge}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-3">{slide.title}</h1>
            <p className="text-white/70 text-base sm:text-lg mb-6">{slide.sub}</p>
            <Link to={slide.to}>
              <button className="px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-full text-sm transition-colors shadow-lg">
                {slide.cta} →
              </button>
            </Link>
          </div>
          <div className="hidden md:block flex-1">
            <img src={slide.img} alt="" className="w-full max-h-56 object-cover rounded-2xl opacity-80"/>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i===heroIdx?"bg-[#FF9900] w-5":"bg-white/40"}`}/>
          ))}
        </div>
      </div>
 
      {/* ── TRUST BADGES ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-3 gap-4 text-center">
          {[
            { icon:<MdLocalShipping size={20}/>, title:"Free Delivery",   sub:"On orders ₹499+"  },
            { icon:<MdReplay size={20}/>,        title:"Easy Returns",    sub:"10-day return"    },
            { icon:<MdSecurity size={20}/>,      title:"Secure Payment",  sub:"100% Protected"   },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex flex-col sm:flex-row items-center gap-2 text-gray-600">
              <span className="text-[#FF9900]">{icon}</span>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-800">{title}</p>
                <p className="text-[11px] text-gray-500 hidden sm:block">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8 space-y-12">
 
        {/* ── CATEGORIES ── */}
        {homeCats.length > 0 && (
          <section>
            <SectionHeader title="Shop by Category" to="/products"/>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {homeCats.map(cat => (
                <Link key={cat._id} to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-1.5 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[#FFF3E0] border-2 border-transparent
                    group-hover:border-[#FF9900] transition-all">
                    {cat.image?.url
                      ? <img src={cat.image.url} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-2xl">{cat.icon||"📦"}</div>
                    }
                  </div>
                  <p className="text-xs text-gray-700 font-medium text-center leading-tight line-clamp-2 group-hover:text-[#FF9900] transition-colors">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
 
        {/* ── TODAY'S DEALS ── */}
        {deals.length > 0 && (
          <section>
            <SectionHeader title="🔥 Today's Deals" subtitle="Limited time offers" to="/products?isDeal=true"/>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {deals.map(p => <ProductCard key={p._id} p={p}/>)}
            </div>
          </section>
        )}
 
        {/* ── NEW ARRIVALS ── */}
        {newArr.length > 0 && (
          <section>
            <SectionHeader title="✨ New Arrivals" subtitle="Just landed" to="/products?isNewArrival=true"/>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newArr.map(p => <ProductCard key={p._id} p={p}/>)}
            </div>
          </section>
        )}
 
        {/* ── FEATURED ── */}
        {featured.length > 0 && (
          <section>
            <SectionHeader title="⭐ Featured Products" subtitle="Handpicked for you" to="/products?isFeatured=true"/>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featured.map(p => <ProductCard key={p._id} p={p}/>)}
            </div>
          </section>
        )}
 
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard