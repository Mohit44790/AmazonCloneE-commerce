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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex gap-6">
 
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-900 flex items-center gap-1.5"><MdTune size={18}/> Filters</p>
                {activeFiltersCount>0 && (
                  <span className="bg-[#FF9900] text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <Sidebar/>
            </div>
          </aside>
 
          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
 
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {filters.search ? `Results for "${filters.search}"` : filters.category || "All Products"}
                </h1>
                <p className="text-sm text-gray-500">{pagination.total||0} results</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile filter */}
                <button onClick={()=>setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-400 relative">
                  <MdFilterList size={16}/> Filters
                  {activeFiltersCount>0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF9900] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                {/* Sort */}
                <select value={filters.sort} onChange={e=>setF("sort",e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#FF9900] bg-white">
                  {SORTS.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
                {/* Grid/List toggle */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={()=>setGridView(true)}
                    className={`p-2 transition-colors ${gridView?"bg-[#FF9900] text-black":"text-gray-400 hover:text-gray-600"}`}>
                    <MdGridView size={16}/>
                  </button>
                  <button onClick={()=>setGridView(false)}
                    className={`p-2 transition-colors ${!gridView?"bg-[#FF9900] text-black":"text-gray-400 hover:text-gray-600"}`}>
                    <MdViewList size={16}/>
                  </button>
                </div>
              </div>
            </div>
 
            {/* Active filter chips */}
            {activeFiltersCount>0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category  && <Chip label={`Category: ${filters.category}`}  onRemove={()=>setF("category","")}/>}
                {filters.gender    && <Chip label={`Gender: ${filters.gender}`}      onRemove={()=>setF("gender","")}/>}
                {filters.minRating && <Chip label={`${filters.minRating}★ & Up`}     onRemove={()=>setF("minRating","")}/>}
                {filters.inStock==="true"     && <Chip label="In Stock"     onRemove={()=>setF("inStock","")}/>}
                {filters.isFeatured==="true"  && <Chip label="Featured"    onRemove={()=>setF("isFeatured","")}/>}
                {filters.isNewArrival==="true"&& <Chip label="New Arrival" onRemove={()=>setF("isNewArrival","")}/>}
                {filters.isBestSeller==="true"&& <Chip label="Best Seller" onRemove={()=>setF("isBestSeller","")}/>}
                {filters.isDeal==="true"      && <Chip label="On Sale"     onRemove={()=>setF("isDeal","")}/>}
                {(filters.minPrice||filters.maxPrice) && (
                  <Chip label={`₹${filters.minPrice||0} – ₹${filters.maxPrice||"∞"}`}
                    onRemove={()=>setFilters(f=>({...f,minPrice:"",maxPrice:"",page:1}))}/>
                )}
              </div>
            )}
 
            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-gray-500">
                <MdSearch size={48} className="mx-auto mb-3 opacity-20"/>
                <p className="text-lg font-semibold">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <button onClick={clearAll} className="mt-4 px-5 py-2 bg-[#FFD814] text-gray-900 font-bold rounded-full text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={gridView
                ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"}>
                {products.map(p => <ProductCard key={p._id} p={p}/>)}
              </div>
            )}
 
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-1 mt-8">
                <button disabled={filters.page<=1}
                  onClick={()=>setFilters(f=>({...f,page:f.page-1}))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-400 disabled:opacity-40">
                  ← Prev
                </button>
                {Array.from({length:Math.min(pagination.pages,7)},(_,i)=>i+1).map(pg=>(
                  <button key={pg} onClick={()=>setFilters(f=>({...f,page:pg}))}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors
                      ${filters.page===pg?"bg-[#FF9900] text-black border border-[#FF9900]":"border border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                    {pg}
                  </button>
                ))}
                <button disabled={filters.page>=pagination.pages}
                  onClick={()=>setFilters(f=>({...f,page:f.page+1}))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-400 disabled:opacity-40">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/50" onClick={()=>setSidebarOpen(false)}/>
          <div className="w-72 bg-white h-full overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-gray-900 text-base flex items-center gap-2"><MdTune size={18}/> Filters</p>
              <button onClick={()=>setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700"><MdClose size={22}/></button>
            </div>
            <Sidebar/>
          </div>
        </div>
      )}
    </div>
  );
}
 
const Chip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors"><MdClose size={12}/></button>
  </span>
);


export default ProductListing