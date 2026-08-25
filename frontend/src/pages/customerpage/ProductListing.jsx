import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  MdStar, MdFilterList, MdClose, MdLocalShipping,
  MdGridView, MdViewList, MdSearch, MdTune,
} from "react-icons/md";
import { categoryApi } from "../../apiData/api/categoryApi";
import { productApi } from "../../apiData/api/productApi";
/* ── Stars ── */
const Stars = ({ avg = 0 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <MdStar key={i} size={12} className={i<=Math.round(avg)?"text-[#FF9900]":"text-gray-200"}/>
    ))}
    <span className="text-xs text-gray-500 ml-1">{avg?.toFixed(1)}</span>
  </div>
);
 
const SORTS = [
  { v: "-createdAt",       l: "Newest First"       },
  { v: "price",            l: "Price: Low to High" },
  { v: "-price",           l: "Price: High to Low" },
  { v: "-rating.average",  l: "Avg. Customer Review"},
  { v: "-salesCount",      l: "Best Selling"       },
];
 
const RATINGS = [4, 3, 2, 1];

const ProductListing = () => {
      const [searchParams, setSearchParams] = useSearchParams();
  const navigate  = useNavigate();
  const addToCart = useCartStore(s => s.addItem);
 
  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [gridView,   setGridView]   = useState(true);
  const [sidebarOpen,setSidebarOpen]= useState(false);

    /* Filters from URL */
  const [filters, setFilters] = useState({
    search:    searchParams.get("search")   || "",
    category:  searchParams.get("category") || "",
    gender:    searchParams.get("gender")   || "",
    minPrice:  searchParams.get("minPrice") || "",
    maxPrice:  searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating")|| "",
    inStock:   searchParams.get("inStock")  || "",
    isFeatured:searchParams.get("isFeatured")||"",
    isNewArrival:searchParams.get("isNewArrival")||"",
    isBestSeller:searchParams.get("isBestSeller")||"",
    isDeal:    searchParams.get("isDeal")   || "",
    sort:      searchParams.get("sort")     || "-createdAt",
    page:      Number(searchParams.get("page")) || 1,
    limit:     20,
  });

   /* Load categories */
  useEffect(() => {
    categoryApi.getAll({ parent: "null", tree: "false" }).then(setCategories).catch(() => {});
  }, []);
 
  /* Sync filters → URL */
  useEffect(() => {
    const p = {};
    Object.entries(filters).forEach(([k,v]) => { if (v && v !== "20") p[k] = v; });
    setSearchParams(p, { replace: true });
  }, [filters]);
 
    /* Fetch products */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const res = await productApi.getAll(params);
      setProducts(res.data.products);
      setPagination(res.pagination || {});
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [filters]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
 
  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));
  const clearAll = () => setFilters(f => ({
    ...f, category:"", gender:"", minPrice:"", maxPrice:"",
    minRating:"", inStock:"", isFeatured:"", isNewArrival:"", isBestSeller:"", isDeal:"", page:1,
  }));
 
  const activeFiltersCount = [
    filters.category, filters.gender, filters.minPrice, filters.maxPrice,
    filters.minRating, filters.inStock, filters.isFeatured, filters.isNewArrival,
    filters.isBestSeller, filters.isDeal,
  ].filter(Boolean).length;

   /* ── Sidebar ── */
  const Sidebar = () => (
    <div className="space-y-6 text-sm">
 
      {/* Category */}
      <div>
        <p className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide">Category</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer hover:text-[#c45500]">
            <input type="radio" name="cat" checked={!filters.category} onChange={() => setF("category","")}
              className="accent-[#FF9900]"/>
            <span>All Categories</span>
          </label>
          {categories.map(c => (
            <label key={c._id} className="flex items-center gap-2 cursor-pointer hover:text-[#c45500]">
              <input type="radio" name="cat" checked={filters.category===c.slug} onChange={() => setF("category",c.slug)}
                className="accent-[#FF9900]"/>
              <span>{c.icon} {c.name}</span>
            </label>
          ))}
        </div>
      </div>
 
      {/* Price */}
      <div>
        <p className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide">Price Range</p>
        <div className="flex gap-2 items-center">
          <input type="number" value={filters.minPrice} onChange={e=>setF("minPrice",e.target.value)}
            placeholder="Min ₹" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-[#FF9900]"/>
          <span className="text-gray-400">—</span>
          <input type="number" value={filters.maxPrice} onChange={e=>setF("maxPrice",e.target.value)}
            placeholder="Max ₹" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-[#FF9900]"/>
        </div>
        {/* Quick ranges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {[["Under ₹500","","500"],["₹500-₹1000","500","1000"],["₹1000-₹5000","1000","5000"],["₹5000+","5000",""]].map(([l,mn,mx])=>(
            <button key={l} onClick={() => setFilters(f=>({...f,minPrice:mn,maxPrice:mx,page:1}))}
              className="text-[10px] px-2 py-0.5 border border-gray-300 rounded hover:border-[#FF9900] hover:text-[#c45500] transition-colors">
              {l}
            </button>
          ))}
        </div>
      </div>
 
      {/* Rating */}
      <div>
        <p className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide">Min. Rating</p>
        <div className="space-y-1">
          {RATINGS.map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="rating" checked={filters.minRating==r} onChange={() => setF("minRating",r)}
                className="accent-[#FF9900]"/>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i=><MdStar key={i} size={13} className={i<=r?"text-[#FF9900]":"text-gray-200"}/>)}
                <span className="text-gray-600 text-xs">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
 
      {/* Gender */}
      <div>
        <p className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide">Gender</p>
        <div className="flex flex-wrap gap-1">
          {["men","women","unisex","kids"].map(g => (
            <button key={g} onClick={() => setF("gender", filters.gender===g?"":g)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-all
                ${filters.gender===g?"bg-[#FF9900] border-[#FF9900] text-black font-bold":"border-gray-200 text-gray-600 hover:border-[#FF9900]"}`}>
              {g.charAt(0).toUpperCase()+g.slice(1)}
            </button>
          ))}
        </div>
      </div>
 
      {/* Toggles */}
      <div>
        <p className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide">Availability</p>
        {[
          { k:"inStock",     l:"In Stock Only"     },
          { k:"isFeatured",  l:"Featured"          },
          { k:"isNewArrival",l:"New Arrivals"      },
          { k:"isBestSeller",l:"Best Sellers"      },
          { k:"isDeal",      l:"On Sale / Deals"   },
        ].map(({ k, l }) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer hover:text-[#c45500] mb-1">
            <input type="checkbox" checked={filters[k]==="true"}
              onChange={e => setF(k, e.target.checked?"true":"")}
              className="accent-[#FF9900]"/>
            <span>{l}</span>
          </label>
        ))}
      </div>
 
      <button onClick={clearAll}
        className="w-full py-2 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 rounded-lg text-xs transition-colors">
        Clear All Filters
      </button>
    </div>
  );
 
  /* ── Product Card Grid ── */
  const ProductCard = ({ p }) => (
    <div onClick={() => navigate(`/products/${p.slug}`)}
      className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group
        ${gridView?"":"flex gap-4 p-4"}`}>
      <div className={`overflow-hidden bg-gray-50 relative flex-shrink-0
        ${gridView?"aspect-square":"w-36 h-36 rounded-lg"}`}>
        <img src={p.images?.[0]?.url||"/placeholder.png"} alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        {p.discount>0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{p.discount}%</span>
        )}
      </div>
      <div className={gridView?"p-3":"flex-1 py-1"}>
        <p className="text-gray-800 text-sm font-medium line-clamp-2 leading-tight mb-1">{p.name}</p>
        {p.brand && <p className="text-gray-400 text-xs mb-1">{p.brand}</p>}
        <Stars avg={p.rating?.average}/>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-gray-900 font-bold">{p.finalPrice ? `₹${p.finalPrice.toLocaleString()}` : `₹${p.price?.toLocaleString()}`}</span>
          {p.comparePrice && <span className="text-gray-400 text-xs line-through">₹{p.comparePrice.toLocaleString()}</span>}
        </div>
        {p.shipping?.freeShipping && <p className="text-green-600 text-[11px] mt-1 flex items-center gap-1"><MdLocalShipping size={12}/> FREE Delivery</p>}
        {!gridView && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{p.shortDescription}</p>}
        <button onClick={e=>{e.stopPropagation();addToCart(p);}}
          className="mt-2 w-full sm:w-auto px-4 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold text-xs rounded-full transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
  
  return (
    <div>ProductListing</div>
  )
}

export default ProductListing