// pages/categoryPages/Sportswear.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../../../../apiData/api/productApi";
import { useCartStore, selectAddItem } from "../../../../../apiData/store/cartStore";
import { MdStar, MdLocalShipping, MdChevronRight, MdChevronLeft } from "react-icons/md";

/* ─────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────── */
const SUBCATEGORIES = [
  { label: "Sports bras",      img: "https://m.media-amazon.com/images/G/31/img23/WA/2025/Atleisure/ss-flip/halo/without/Sports_Bras._SS400_QL85_FMpng_.png" },
  { label: "Tights",           img: "https://m.media-amazon.com/images/G/31/img23/WA/2025/Atleisure/ss-flip/halo/without/tights._SS400_QL85_FMpng_.png" },
  { label: "Tees & tanks",     img: "https://m.media-amazon.com/images/G/31/img23/WA/2025/Atleisure/ss-flip/halo/without/Tees__Tanks._SS400_QL85_FMpng_.png" },
  { label: "Shorts",           img: "https://m.media-amazon.com/images/G/31/img23/WA/2025/Atleisure/ss-flip/halo/without/Shorts._SS400_QL85_FMpng_.png" },
 
];

const SIDEBAR_CATEGORIES = [
  { label: "Clothing & Accessories", level: 0 },
  { label: "Women",                  level: 1 },
  { label: "Sportswear",             level: 2, active: true },
  { label: "Active Dresses", path:"/women/clothing/sports-wear/active-dresses",         level: 3 },
  { label: "Athletic Socks",  path:"/women/clothing/sports-wear/athletic-socks",       level: 3 },
  { label: "Vests",   path:"/women/clothing/sports-wear/vests",               level: 3 },
  { label: "Innerwear", path:"/women/clothing/sports-wear/innerwear",             level: 3 },
  { label: "Sets",    path:"/women/clothing/sports-wear/sets",                level: 3 },
  { label: "Shirts & Tees",  path:"/women/clothing/sports-wear/shirts-tees",         level: 3 },
  { label: "Shorts", path:"/women/clothing/sports-wear/shorts",                     level: 3 },
  { label: "Sweatshirts & Hoodies",  path:"/women/clothing/sports-wear/sweatshirts-hoodies",  level: 3 },
  { label: "Leggings", path:"/women/clothing/sports-wear/leggings",                 level: 3 },
  { label: "Track Jackets",          path:"/women/clothing/sports-wear/track-jackets",          level: 3 },
  { label: "Trousers",               path:"/women/clothing/sports-wear/trousers",               level: 3 },
  { label: "Base Layers & Compression", path:"/women/clothing/sports-wear/base-layers-compression", level: 3 },
  { label: "Skirts & Skorts",        path:"/women/clothing/sports-wear/skirts-skorts",        level: 3 },
];

const BRANDS = ["Boldfit","BLINKIN","Jockey","Van Heusen","Q - RIOUS","Puma","Nike","Reebok","Adidas","Decathlon"];

const BANNERS = [
  {
    bg: "bg-[#F5C518]",
    tag: "ATHLEISURE STORE",
    title: "ACTIVEWEAR\nSTYLES",
    subtitle: "UP TO 50% OFF",
    brands: ["PUMA", "blissclub", "& more"],
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop&crop=left",
  },
  {
    bg: "bg-[#1A1A2E]",
    tag: "NEW ARRIVALS",
    title: "RUN FASTER\nGO FURTHER",
    subtitle: "SHOP RUNNING GEAR",
    brands: ["Nike", "Adidas", "& more"],
    img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&h=400&fit=crop&crop=left",
  },
];

const SORT_OPTIONS = [
  { v: "-createdAt",      l: "Featured"           },
  { v: "price",           l: "Price: Low to High" },
  { v: "-price",          l: "Price: High to Low" },
  { v: "-rating.average", l: "Avg. Customer Review"},
  { v: "-salesCount",     l: "Best Selling"       },
];

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
const Stars = ({ avg = 0, count }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(n => (
      <MdStar key={n} size={13} className={n <= Math.round(avg) ? "text-[#FF9900]" : "text-gray-200"}/>
    ))}
    {count !== undefined && (
      <span className="text-xs text-[#007185] ml-0.5">{count.toLocaleString()}</span>
    )}
  </div>
);

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
const ProductCard = ({ p }) => {
  const navigate  = useNavigate();
  const addItem   = useCartStore(selectAddItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(p, 1, {});
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => navigate(`/products/${p.slug}`)}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md
        transition-shadow cursor-pointer group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={p.images?.[0]?.url || "/placeholder.png"}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {p.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{p.discount}%
          </span>
        )}
        {p.isBestSeller && (
          <span className="absolute top-2 right-2 bg-[#FF9900] text-black text-[10px] font-bold px-2 py-0.5 rounded">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        {p.brand && <p className="text-xs text-gray-500 mb-0.5">{p.brand}</p>}
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug flex-1">{p.name}</p>
        <Stars avg={p.rating?.average} count={p.rating?.count}/>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-bold text-gray-900">
            ₹{(p.finalPrice || p.price)?.toLocaleString()}
          </span>
          {p.comparePrice && (
            <span className="text-xs text-gray-400 line-through">₹{p.comparePrice?.toLocaleString()}</span>
          )}
        </div>
        {p.shipping?.freeShipping && (
          <p className="text-green-600 text-[11px] mt-1 flex items-center gap-1">
            <MdLocalShipping size={12}/> FREE Delivery
          </p>
        )}
        <button
          onClick={handleAdd}
          className={`mt-2 w-full py-1.5 rounded-full text-xs font-bold transition-all
            ${added
              ? "bg-green-500 text-white"
              : "bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900"}`}
        >
          {added ? "✓ Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Sportswear() {
  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [bannerIdx,  setBannerIdx]  = useState(0);
  const [selBrands,  setSelBrands]  = useState([]);
  const [freeShip,   setFreeShip]   = useState(false);
  const [primePick,  setPrimePick]  = useState(false);
  const [sort,       setSort]       = useState("-createdAt");
  const [page,       setPage]       = useState(1);
  const [priceMin,   setPriceMin]   = useState("");
  const [priceMax,   setPriceMax]   = useState("");

  /* auto-advance banner */
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(idx => (idx + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* fetch products */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {
          category: "sportswear",
          gender:   "women",
          sort,
          page,
          limit:    12,
        };
        if (selBrands.length)    params.brand    = selBrands[0];
        if (freeShip)            params.freeShipping = "true";
        if (priceMin)            params.minPrice = priceMin;
        if (priceMax)            params.maxPrice = priceMax;
        const res = await productApi.getAll(params);
        setProducts(res.data?.products || []);
        setPagination(res.pagination || {});
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [sort, page, selBrands, freeShip, priceMin, priceMax]);

  const toggleBrand = (brand) =>
    setSelBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );

  const banner = BANNERS[bannerIdx];

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 py-4">
        <div className="flex gap-5">

          {/* ════════════════════════════
              SIDEBAR
          ════════════════════════════ */}
          <aside className="hidden md:block w-52 shrink-0">

            {/* Categories */}
            <div className="mb-5">
              <p className="font-bold text-gray-900 text-sm mb-2">Category</p>
              {SIDEBAR_CATEGORIES.map((cat, idx) => (
              <Link to={cat.path}>
                <div
                  key={idx}
                  style={{ paddingLeft: cat.level * 10 }}
                  className={`py-0.5 text-sm cursor-pointer
                    ${cat.active
                      ? "font-bold text-gray-900"
                      : cat.level === 0 || cat.level === 1
                        ? "text-gray-700 font-semibold hover:text-[#c45500]"
                        : "text-[#007185] hover:text-[#c45500] hover:underline"
                    }`}
                >
                  {(cat.level === 0 || cat.level === 1) && (
                    <span className="mr-0.5 text-xs">‹ </span>
                  )}
                  {cat.label}
                </div>
              </Link>
            ))}
            </div>

            <hr className="border-gray-200 my-3"/>

            {/* Amazon Prime */}
            <div className="mb-4">
              <p className="font-bold text-gray-900 text-sm mb-2">Amazon Prime</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={primePick} onChange={e => setPrimePick(e.target.checked)}
                  className="accent-[#FF9900] w-4 h-4"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/200px-Amazon_Prime_Logo.svg.png"
                  alt="Prime" className="h-4"/>
              </label>
            </div>

            <hr className="border-gray-200 my-3"/>

            {/* Delivery Day */}
            <div className="mb-4">
              <p className="font-bold text-gray-900 text-sm mb-2">Delivery Day</p>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#007185] hover:underline mb-1">
                <input type="checkbox" className="accent-[#FF9900] w-4 h-4"/>
                Get It Today
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#007185] hover:underline">
                <input type="checkbox" checked={freeShip} onChange={e => setFreeShip(e.target.checked)}
                  className="accent-[#FF9900] w-4 h-4"/>
                Get It by Tomorrow
              </label>
            </div>

            <hr className="border-gray-200 my-3"/>

            {/* Price Range */}
            <div className="mb-4">
              <p className="font-bold text-gray-900 text-sm mb-2">Price</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number" value={priceMin}
                  onChange={e => { setPriceMin(e.target.value); setPage(1); }}
                  placeholder="Min"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#FF9900]"
                />
                <span className="text-gray-400 text-xs">–</span>
                <input
                  type="number" value={priceMax}
                  onChange={e => { setPriceMax(e.target.value); setPage(1); }}
                  placeholder="Max"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#FF9900]"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {[["Under ₹500","","500"],["₹500–1k","500","1000"],["₹1k–2k","1000","2000"],["₹2k+","2000",""]].map(([l,mn,mx]) => (
                  <button key={l}
                    onClick={() => { setPriceMin(mn); setPriceMax(mx); setPage(1); }}
                    className="text-[10px] px-2 py-0.5 border border-gray-300 rounded hover:border-[#FF9900] hover:text-[#c45500] transition-colors">
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 my-3"/>

            {/* Brands */}
            <div>
              <p className="font-bold text-gray-900 text-sm mb-2">Brands</p>
              {BRANDS.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={selBrands.includes(brand)}
                    onChange={() => { toggleBrand(brand); setPage(1); }}
                    className="accent-[#FF9900] w-4 h-4"
                  />
                  <span className="text-sm text-[#007185] hover:underline hover:text-[#c45500]">{brand}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* ════════════════════════════
              MAIN CONTENT
          ════════════════════════════ */}
          <div className="flex-1 min-w-0">

            {/* ── Subcategory Circles ── */}
            <div className="flex gap-4 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {SUBCATEGORIES.map(sub => (
                <Link
                  key={sub.label}
                  to={`/products?category=${sub.label.toLowerCase().replace(/ /g,"-")}`}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div className="w-34 h-34 rounded-full overflow-hidden border-2 border-transparent
                    group-hover:border-[#FF9900] transition-all bg-[#F5F5F5]">
                    <img src={sub.img} alt={sub.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center leading-tight max-w-[88px]">
                    {sub.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* ── Banner / Carousel ── */}
            <div className={`relative ${banner.bg} rounded-xl overflow-hidden mb-5`} style={{ minHeight: 240 }}>
              {/* Side label */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/30 flex items-center justify-center">
                <p className="text-white text-[9px] font-bold tracking-widest"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {banner.tag}
                </p>
              </div>

              <div className="flex items-center ml-7 px-6 py-6 gap-6 h-full">
                {/* Image */}
                <div className="hidden sm:block flex-1 max-w-xs">
                  <img src={banner.img} alt="Banner model"
                    className="h-52 w-full object-cover object-top rounded-lg"/>
                </div>

                {/* Text */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className={`text-4xl sm:text-5xl font-black leading-tight whitespace-pre-line mb-3
                    ${banner.bg.includes("F5C518") ? "text-gray-900" : "text-white"}`}>
                    {banner.title}
                  </h2>
                  <p className={`text-xl sm:text-2xl font-bold mb-4
                    ${banner.bg.includes("F5C518") ? "text-gray-800" : "text-white"}`}>
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                    {banner.brands.map((b, idx) => (
                      <span key={idx}
                        className={`text-sm font-bold px-3 py-1 rounded-full
                          ${banner.bg.includes("F5C518")
                            ? "bg-black/10 text-gray-900"
                            : "bg-white/10 text-white"}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prev / Next arrows */}
              <button
                onClick={() => setBannerIdx(idx => (idx - 1 + BANNERS.length) % BANNERS.length)}
                className="absolute left-7 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white
                  rounded-full p-1.5 shadow transition-all"
              >
                <MdChevronLeft size={20} className="text-gray-700"/>
              </button>
              <button
                onClick={() => setBannerIdx(idx => (idx + 1) % BANNERS.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white
                  rounded-full p-1.5 shadow transition-all"
              >
                <MdChevronRight size={20} className="text-gray-700"/>
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {BANNERS.map((_, idx) => (
                  <button key={idx} onClick={() => setBannerIdx(idx)}
                    className={`rounded-full transition-all
                      ${idx === bannerIdx ? "bg-white w-4 h-2" : "bg-white/50 w-2 h-2"}`}/>
                ))}
              </div>
            </div>

            {/* ── Results bar ── */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4 border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-700">
                {loading ? "Loading…" : (
                  <>
                    <span className="font-semibold">1–{products.length}</span>
                    {pagination.total ? ` of over ${pagination.total.toLocaleString()}` : ""} results for{" "}
                    <span className="text-[#c45500] font-semibold">Sportswear</span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-600 shrink-0">Sort by:</label>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#FF9900] bg-white"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Product Grid ── */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-semibold text-gray-600">No products found</p>
                <p className="text-sm mt-1">Try changing the filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} p={p}/>)}
              </div>
            )}

            {/* ── Pagination ── */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-1 mt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-400 disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(pg => (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors
                      ${page === pg
                        ? "bg-[#FF9900] text-black border border-[#FF9900]"
                        : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                    {pg}
                  </button>
                ))}
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-400 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}