import React, { useState, useMemo } from 'react'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { TiTick } from "react-icons/ti"
import { bras } from '../../../../../../component/data/womenfashion.js'

/* ═══════════════════════════════════════
   FILTER CONFIG — matches screenshot
═══════════════════════════════════════ */
const BRANDS = ["Enamor","Jockey","Clovia","NYKD","Van Heusen","Amazon Brand - Symbol","DClub","Triumph","MiEstilo"]
const PRICE_RANGES = [
  { label: "Under ₹300",      min: 0,    max: 300  },
  { label: "₹300 - ₹500",    min: 300,  max: 500  },
  { label: "₹500 - ₹1,000",  min: 500,  max: 1000 },
  { label: "₹1,000 - ₹1,500",min: 1000, max: 1500 },
  { label: "Over ₹1,500",     min: 1500, max: Infinity },
]
const DISCOUNTS = ["All Discounts","Buy More, Save More","Coupons","Today's Deals"]
const SIZES     = ["30A","30B","32A","32B","34A","34B","36A","36B","S","M","L","XL","2XL"]
const CLOSURES  = ["Back Closure","Front Closure","Pull On","No Closure"]
const COLOURS   = [
  { name:"Black",   hex:"#000000" },{ name:"White",   hex:"#FFFFFF" },
  { name:"Beige",   hex:"#F5F0E8" },{ name:"Red",     hex:"#CC0000" },
  { name:"Pink",    hex:"#FF69B4" },{ name:"Blue",    hex:"#0000FF" },
  { name:"Nude",    hex:"#E8C9A0" },{ name:"Grey",    hex:"#808080" },
]
const BAND_SIZES  = ["28","30","32","34","36","38","40"]
const STRAP_TYPES = ["Adjustable","Non-Adjustable","Convertible","Strapless","Halter","Racerback"]
const MATERIALS   = ["Cotton","Nylon","Polyester","Spandex","Lace","Satin","Microfiber"]
const NECK_STYLES = ["V-Neck","Round Neck","Square Neck","Scoop Neck","Plunge"]
const PATTERNS    = ["Solid","Floral","Animal Print","Striped","Geometric","Lace"]
const RATINGS_OPT = [4, 3, 2, 1]

/* ═══════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════ */
const SkeletonCard = () => (
  <div className="w-full bg-white border border-gray-200 overflow-hidden flex flex-col animate-pulse">
    <div className="w-full h-[290px] bg-gray-200"/>
    <div className="px-2 pb-3 mt-2 space-y-2">
      <div className="flex gap-2">
        <div className="w-5 h-5 rounded-full bg-gray-200"/>
        <div className="w-5 h-5 rounded-full bg-gray-200"/>
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4"/>
      <div className="h-4 bg-gray-200 rounded w-1/2"/>
      <div className="h-4 bg-gray-200 rounded w-1/3"/>
      <div className="h-4 bg-gray-200 rounded w-2/3"/>
      <div className="h-8 bg-yellow-100 rounded-full mt-2"/>
    </div>
  </div>
)

/* ═══════════════════════════════════════
   COLLAPSIBLE FILTER SECTION
═══════════════════════════════════════ */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-gray-200 py-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-bold text-sm text-gray-900">{title}</span>
        {open ? <IoIosArrowUp size={14}/> : <IoIosArrowDown size={14}/>}
      </button>
      {open && <div className="mt-2 space-y-1.5">{children}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const Bras = () => {
  const [loading, setLoading] = useState(false)

  /* ── Filter States ── */
  const [prime,        setPrime]        = useState(false)
  const [getByTomorrow,setGetByTomorrow]= useState(false)
  const [selBrands,    setSelBrands]    = useState([])
  const [selPrice,     setSelPrice]     = useState(null)   // index
  const [minRating,    setMinRating]    = useState(null)
  const [selDiscount,  setSelDiscount]  = useState("")
  const [outOfStock,   setOutOfStock]   = useState(false)
  const [topBrands,    setTopBrands]    = useState(false)
  const [madeInIndia,  setMadeInIndia]  = useState(false)
  const [selSizes,     setSelSizes]     = useState([])
  const [selClosures,  setSelClosures]  = useState([])
  const [selColours,   setSelColours]   = useState([])
  const [selBandSizes, setSelBandSizes] = useState([])
  const [selStraps,    setSelStraps]    = useState([])
  const [selMaterials, setSelMaterials] = useState([])
  const [selNeckStyles,setSelNeckStyles]= useState([])
  const [selPatterns,  setSelPatterns]  = useState([])

  /* ── Toggle helpers ── */
  const toggle = (setter, val) =>
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])

  /* ── Derived filtered list ── */
  const filtered = useMemo(() => {
    let list = [...(bras || [])]

    if (selBrands.length)
      list = list.filter(p => selBrands.some(b => (p.brand||"").toLowerCase().includes(b.toLowerCase())))

    if (selPrice !== null) {
      const { min, max } = PRICE_RANGES[selPrice]
      list = list.filter(p => p.price >= min && p.price < max)
    }

    if (minRating !== null)
      list = list.filter(p => (p.rating?.average || p.rating || 0) >= minRating)

    if (selSizes.length)
      list = list.filter(p => p.sizes?.some(s => selSizes.includes(s)))

    if (selColours.length)
      list = list.filter(p => p.colors?.some(c => selColours.includes(c.name)))

    if (selClosures.length)
      list = list.filter(p => selClosures.some(cl => (p.productDetails?.["Closure type"]||"").includes(cl)))

    if (selStraps.length)
      list = list.filter(p => selStraps.some(st => (p.productDetails?.["Strap type"]||"").includes(st)))

    if (selMaterials.length)
      list = list.filter(p => selMaterials.some(m => (p.productDetails?.["Material composition"]||"").toLowerCase().includes(m.toLowerCase())))

    return list
  }, [selBrands, selPrice, minRating, selSizes, selColours, selClosures, selStraps, selMaterials])

  /* ── Clear all filters ── */
  const clearAll = () => {
    setPrime(false); setGetByTomorrow(false); setSelBrands([])
    setSelPrice(null); setMinRating(null); setSelDiscount("")
    setOutOfStock(false); setTopBrands(false); setMadeInIndia(false)
    setSelSizes([]); setSelClosures([]); setSelColours([])
    setSelBandSizes([]); setSelStraps([]); setSelMaterials([])
    setSelNeckStyles([]); setSelPatterns([])
  }

  const activeFilters = [
    ...selBrands, selPrice !== null ? PRICE_RANGES[selPrice].label : null,
    minRating ? `${minRating}★ & Up` : null,
    ...selSizes, ...selColours,
  ].filter(Boolean)

  return (
    <div>
      <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>

        {/* ══════════════════════════
            SIDEBAR
        ══════════════════════════ */}
        <div className="w-64 flex flex-col gap-1 shrink-0">

          {/* Category breadcrumb */}
          <h1 className="font-semibold text-sm">Category</h1>
          <Link to="/women/clothing" className="flex items-center text-sm hover:text-orange-700">
            <IoIosArrowBack /> Clothing & Accessories
          </Link>
          <Link to="/women/clothing" className="flex items-center text-sm hover:text-orange-700">
            <IoIosArrowBack /> Women
          </Link>
          <Link to="/women/clothing/lingerie" className="flex items-center text-sm hover:text-orange-700">
            <IoIosArrowBack /> Lingerie
          </Link>
          <h1 className="font-semibold text-sm px-4">Bras</h1>
          <div className="px-6 flex flex-col gap-1">
            <Link to="/women/lingerie/bras/adhesive"                    className="text-sm text-blue-600 hover:underline hover:text-orange-700">Adhesive Bras</Link>
            <Link to="/women/clothing/sports-wear/innerwear/sports-bras" className="text-sm text-blue-600 hover:underline hover:text-orange-700">Sports Bras</Link>
            <Link to="/women/lingerie/bras/mastectomy"                  className="text-sm text-blue-600 hover:underline hover:text-orange-700">Mastectomy Bras</Link>
            <Link to="/women/lingerie/bras/everyday"                    className="text-sm text-blue-600 hover:underline hover:text-orange-700">Everyday Bras</Link>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{activeFilters.length} filter{activeFilters.length>1?"s":""} active</span>
                <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Clear all</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {activeFilters.map(f => (
                  <span key={f} className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Amazon Prime ── */}
          <FilterSection title="Amazon Prime">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={prime} onChange={e => setPrime(e.target.checked)} className="accent-orange-500"/>
              <TiTick className="text-yellow-400"/>
              <span className="text-blue-600 font-bold text-sm">Prime</span>
            </label>
          </FilterSection>

          {/* ── Delivery Day ── */}
          <FilterSection title="Delivery Day">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={getByTomorrow} onChange={e => setGetByTomorrow(e.target.checked)} className="accent-orange-500"/>
              Get It by Tomorrow
            </label>
          </FilterSection>

          {/* ── Brands ── */}
          <FilterSection title="Brands">
            {BRANDS.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selBrands.includes(brand)}
                  onChange={() => toggle(setSelBrands, brand)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{brand}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Price ── */}
          <FilterSection title="Price">
            {PRICE_RANGES.map((range, idx) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="price" checked={selPrice === idx}
                  onChange={() => setSelPrice(selPrice === idx ? null : idx)}
                  className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{range.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Customer Reviews ── */}
          <FilterSection title="Customer Reviews">
            {RATINGS_OPT.map(r => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rating" checked={minRating === r}
                  onChange={() => setMinRating(minRating === r ? null : r)}
                  className="accent-orange-500"/>
                <span className="flex items-center gap-0.5 text-sm">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={i <= r ? "text-orange-400" : "text-gray-300"}>★</span>
                  ))}
                  <span className="text-blue-600 ml-1 hover:underline">& Up</span>
                </span>
              </label>
            ))}
          </FilterSection>

          {/* ── Deals & Discounts ── */}
          <FilterSection title="Deals & Discounts" defaultOpen={false}>
            {DISCOUNTS.map(d => (
              <label key={d} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="discount" checked={selDiscount === d}
                  onChange={() => setSelDiscount(selDiscount === d ? "" : d)}
                  className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{d}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Availability ── */}
          <FilterSection title="Availability" defaultOpen={false}>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={outOfStock} onChange={e => setOutOfStock(e.target.checked)} className="accent-orange-500"/>
              Include Out of Stock
            </label>
          </FilterSection>

          {/* ── Amazon Fashion ── */}
          <FilterSection title="Amazon Fashion" defaultOpen={false}>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={topBrands} onChange={e => setTopBrands(e.target.checked)} className="accent-orange-500"/>
              Top Brands
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={madeInIndia} onChange={e => setMadeInIndia(e.target.checked)} className="accent-orange-500"/>
              Made for India
            </label>
          </FilterSection>

          {/* ── Women's Clothing Size ── */}
          <FilterSection title="Women's Clothing Size" defaultOpen={false}>
            <div className="flex flex-wrap gap-1">
              {SIZES.map(s => (
                <button key={s} onClick={() => toggle(setSelSizes, s)}
                  className={`px-2 py-0.5 border text-xs rounded transition-all
                    ${selSizes.includes(s) ? "bg-orange-600 text-white border-orange-600" : "border-gray-300 text-gray-700 hover:border-orange-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Closure Type ── */}
          <FilterSection title="Closure Type" defaultOpen={false}>
            {CLOSURES.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selClosures.includes(c)}
                  onChange={() => toggle(setSelClosures, c)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{c}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Colour ── */}
          <FilterSection title="Colour" defaultOpen={false}>
            <div className="flex flex-wrap gap-2">
              {COLOURS.map(col => (
                <button key={col.name} onClick={() => toggle(setSelColours, col.name)}
                  title={col.name}
                  className={`w-6 h-6 rounded-full border-2 transition-all
                    ${selColours.includes(col.name) ? "border-orange-500 scale-110 shadow-md" : "border-gray-300 hover:border-gray-500"}`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
            {selColours.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{selColours.join(", ")}</p>
            )}
          </FilterSection>

          {/* ── Bra Band Size ── */}
          <FilterSection title="Bra Band Size" defaultOpen={false}>
            <div className="flex flex-wrap gap-1">
              {BAND_SIZES.map(s => (
                <button key={s} onClick={() => toggle(setSelBandSizes, s)}
                  className={`px-2 py-0.5 border text-xs rounded transition-all
                    ${selBandSizes.includes(s) ? "bg-orange-600 text-white border-orange-600" : "border-gray-300 text-gray-700 hover:border-orange-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Strap Type ── */}
          <FilterSection title="Strap Type" defaultOpen={false}>
            {STRAP_TYPES.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selStraps.includes(s)}
                  onChange={() => toggle(setSelStraps, s)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{s}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Material ── */}
          <FilterSection title="Material" defaultOpen={false}>
            {MATERIALS.map(m => (
              <label key={m} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selMaterials.includes(m)}
                  onChange={() => toggle(setSelMaterials, m)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{m}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Neck Style ── */}
          <FilterSection title="Neck Style" defaultOpen={false}>
            {NECK_STYLES.map(n => (
              <label key={n} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selNeckStyles.includes(n)}
                  onChange={() => toggle(setSelNeckStyles, n)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{n}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Pattern ── */}
          <FilterSection title="Pattern" defaultOpen={false}>
            {PATTERNS.map(p => (
              <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={selPatterns.includes(p)}
                  onChange={() => toggle(setSelPatterns, p)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{p}</span>
              </label>
            ))}
          </FilterSection>

        </div>

        {/* ══════════════════════════
            PRODUCT GRID
        ══════════════════════════ */}
        <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-xl">Results</h1>
          <p className="text-sm text-gray-600">
            Check each product page for other buying options. Price and other details may vary based on product size and colour.
          </p>

          {/* Results count */}
          <p className="text-sm text-gray-500 mt-1 mb-2">
            <span className="font-medium text-gray-800">1–{filtered.length}</span>
            {filtered.length !== (bras||[]).length && (
              <span> of <span className="font-medium text-gray-800">{(bras||[]).length}</span></span>
            )} results
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="ml-2 text-blue-600 hover:underline text-xs">
                Clear filters
              </button>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 bg-gray-100">

            {/* ── Skeleton Loading ── */}
            {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i}/>)}

            {/* ── No results ── */}
            {!loading && filtered.length === 0 && (
              <div className="col-span-4 py-16 text-center text-gray-500">
                <p className="text-lg font-semibold">No results found</p>
                <p className="text-sm mt-1">Try removing some filters</p>
                <button onClick={clearAll} className="mt-3 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 rounded-full text-sm font-medium">
                  Clear all filters
                </button>
              </div>
            )}

            {/* ── Product Cards ── */}
            {!loading && filtered.map((item) => (
              <div key={item.id}
                className="w-full bg-white border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col">

                {/* Badge */}
                {item.badge && (
                  <div className="px-2 pt-1">
                    <span className="inline-block bg-orange-700 text-white text-xs font-semibold px-2 py-1 rounded">
                      {item.badge}
                    </span>
                  </div>
                )}
                {item.deal && (
                  <div className="px-2 pt-1">
                    <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {item.deal}
                    </span>
                  </div>
                )}

                {/* Image */}
                <Link to={`/product/${item.id}`}
                  className="block w-full h-[290px] bg-white overflow-hidden">
                  <img
                    src={Array.isArray(item.images) ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>

                {/* Card Content */}
                <div className="px-2 pb-3">

                  {/* Colors */}
                  {item.colors?.length > 0 && (
                    <div className="flex gap-2 py-2 flex-wrap">
                      {item.colors.map((color, index) => (
                        <span key={index} title={color.name}
                          className="w-5 h-5 rounded-full border border-gray-500 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.hex || "#ddd" }}/>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link to={`/product/${item.id}`}>
                    <h2 className="text-[16px] leading-6 text-gray-900 hover:text-orange-700 line-clamp-2 min-h-[48px]">
                      {item.brand && <span className="font-bold">{item.brand} </span>}
                      {item.name}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm">{item.rating?.average || item.rating || "4.0"}</span>
                    <span className="text-orange-500 text-sm">★★★★★</span>
                    {(item.rating?.count || item.ratingCount) && (
                      <span className="text-blue-600 text-sm">({item.rating?.count || item.ratingCount})</span>
                    )}
                  </div>

                  {/* Bought in past month */}
                  {item.boughtInPastMonth && (
                    <p className="text-sm text-gray-600 mt-1">
                      {item.boughtInPastMonth}+ bought in past month
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-2xl text-gray-900">₹{item.price}</span>
                    {item.mrp && (
                      <span className="text-sm text-gray-500">
                        M.R.P.: <span className="line-through ml-1">₹{item.mrp}</span>
                      </span>
                    )}
                    {item.discount && (
                      <span className="text-sm text-gray-700">({item.discount}% off)</span>
                    )}
                  </div>

                  {/* Coupon */}
                  {item.coupon && (
                    <div className="mt-2">
                      <span className="bg-green-200 text-green-900 text-sm px-1 py-1">
                        You pay ₹{item.couponPrice || item.price}
                      </span>
                      <span className="text-sm ml-1">with coupon</span>
                    </div>
                  )}

                  {/* Free delivery */}
                  {item.delivery && (
                    <p className="text-sm mt-2 text-gray-700">
                      <span className="font-semibold">FREE delivery</span> {item.delivery}
                    </p>
                  )}

                  {/* Fulfillment */}
                  {item.fulfillment && (
                    <p className="text-xs text-gray-500 mt-1">{item.fulfillment}</p>
                  )}

                  {/* Add to Cart */}
                  <button type="button"
                    className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 rounded-full py-2 text-sm font-medium transition-colors"
                    onClick={(e) => { e.preventDefault(); console.log("Add to cart:", item.id); }}>
                    Add to cart
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bras