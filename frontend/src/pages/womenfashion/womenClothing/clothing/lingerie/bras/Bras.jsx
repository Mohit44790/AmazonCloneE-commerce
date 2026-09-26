import React, { useState, useMemo } from 'react'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { TiTick } from "react-icons/ti"
import { bras } from '../../../../../../component/data/womenfashion.js'

/* ═══════════════════════════════════════
   DYNAMIC FILTER EXTRACTION FROM DATA
═══════════════════════════════════════ */
const safe = (arr) => Array.isArray(arr) ? arr : []

// Unique sorted values from data
const extract = (key, transform) =>
  [...new Set(
    safe(bras).flatMap(item => {
      const val = transform ? transform(item) : item[key]
      return Array.isArray(val) ? val : val ? [val] : []
    })
  )].filter(Boolean).sort()

// Brands from data
const DATA_BRANDS = extract("brand")

// Sizes from data
const DATA_SIZES = extract("sizes", item => safe(item.sizes))

// Colors (names) from data
const DATA_COLOURS = [...new Set(
  safe(bras).flatMap(item =>
    safe(item.colors).map(c =>
      typeof c === "string" ? c : c?.name
    ).filter(Boolean)
  )
)].sort()

// Closure types from productDetails
const DATA_CLOSURES = extract(null, item =>
  item.productDetails?.["Closure type"]
).filter(v => v !== "No" && v !== "Instructions")

// Strap types from productDetails
const DATA_STRAPS = extract(null, item =>
  item.productDetails?.["Strap type"]
)

// Materials from productDetails
const DATA_MATERIALS = [...new Set(
  safe(bras).flatMap(item => {
    const mat = item.productDetails?.["Material composition"] || ""
    // Split "67% Bamboo, 27% Cotton, 6% Mobilion" → ["Bamboo","Cotton","Mobilion"]
    return mat
      .split(/[,&+]/)
      .map(s => s.replace(/\d+%?\s*/g, "").trim())
      .filter(s => s.length > 2 && s !== "No" && s !== "Instructions")
  })
)].sort()

// Styles from productDetails
const DATA_STYLES = extract(null, item =>
  item.productDetails?.["Style"]
)

// Countries
const DATA_COUNTRIES = extract(null, item =>
  item.productDetails?.["Country of Origin"]
)

// Underwire types
const DATA_UNDERWIRE = extract(null, item =>
  item.productDetails?.["Underwire type"]
)

// Price ranges auto-built from data min/max
const allPrices = safe(bras).map(p => p.price).filter(Boolean)
const MIN_PRICE = Math.min(...allPrices)
const MAX_PRICE = Math.max(...allPrices)

const PRICE_RANGES = [
  { label: "Under ₹300",       min: 0,    max: 300  },
  { label: "₹300 – ₹500",     min: 300,  max: 500  },
  { label: "₹500 – ₹1,000",   min: 500,  max: 1000 },
  { label: "₹1,000 – ₹1,500", min: 1000, max: 1500 },
  { label: "Over ₹1,500",      min: 1500, max: Infinity },
].filter(r => allPrices.some(p => p >= r.min && p < r.max))

const RATINGS_OPT = [4, 3, 2, 1]
const DISCOUNTS    = ["All Discounts", "Buy More, Save More", "Coupons", "Today's Deals"]

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
   STAR DISPLAY
═══════════════════════════════════════ */
const Stars = ({ avg = 0 }) => (
  <span className="flex">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={i <= Math.round(avg) ? "text-orange-400" : "text-gray-300"}>★</span>
    ))}
  </span>
)

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const Bras = () => {
  const [loading] = useState(false)  // set true when fetching from API

  /* ── Filter States ── */
  const [prime,         setPrime]         = useState(false)
  const [getByTomorrow, setGetByTomorrow] = useState(false)
  const [selBrands,     setSelBrands]     = useState([])
  const [selPrice,      setSelPrice]      = useState(null)
  const [minRating,     setMinRating]     = useState(null)
  const [selDiscount,   setSelDiscount]   = useState("")
  const [outOfStock,    setOutOfStock]    = useState(false)
  const [topBrands,     setTopBrands]     = useState(false)
  const [madeInIndia,   setMadeInIndia]   = useState(false)
  const [selSizes,      setSelSizes]      = useState([])
  const [selClosures,   setSelClosures]   = useState([])
  const [selColours,    setSelColours]    = useState([])
  const [selStraps,     setSelStraps]     = useState([])
  const [selMaterials,  setSelMaterials]  = useState([])
  const [selStyles,     setSelStyles]     = useState([])
  const [selCountries,  setSelCountries]  = useState([])
  const [selUnderwire,  setSelUnderwire]  = useState([])
  const [searchBrand,   setSearchBrand]   = useState("")

  /* ── Toggle helper ── */
  const toggle = (setter, val) =>
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])

  /* ── Color normalizer (handles both string and object) ── */
  const getColorNames = (item) =>
    safe(item.colors).map(c => typeof c === "string" ? c : c?.name).filter(Boolean)

  /* ── Filtered list (from data) ── */
  const filtered = useMemo(() => {
    let list = safe(bras)

    if (selBrands.length)
      list = list.filter(p =>
        selBrands.some(b => (p.brand || "").toLowerCase().includes(b.toLowerCase()))
      )

    if (selPrice !== null) {
      const { min, max } = PRICE_RANGES[selPrice]
      list = list.filter(p => p.price >= min && p.price < max)
    }

    if (minRating !== null)
      list = list.filter(p => (p.rating?.average || p.rating || 0) >= minRating)

    if (selSizes.length)
      list = list.filter(p => safe(p.sizes).some(s => selSizes.includes(s)))

    if (selColours.length)
      list = list.filter(p => getColorNames(p).some(c => selColours.includes(c)))

    if (selClosures.length)
      list = list.filter(p =>
        selClosures.some(cl => (p.productDetails?.["Closure type"] || "").includes(cl))
      )

    if (selStraps.length)
      list = list.filter(p =>
        selStraps.some(st => (p.productDetails?.["Strap type"] || "").includes(st))
      )

    if (selMaterials.length)
      list = list.filter(p =>
        selMaterials.some(m =>
          (p.productDetails?.["Material composition"] || "").toLowerCase().includes(m.toLowerCase())
        )
      )

    if (selStyles.length)
      list = list.filter(p =>
        selStyles.includes(p.productDetails?.["Style"])
      )

    if (selCountries.length)
      list = list.filter(p =>
        selCountries.includes(p.productDetails?.["Country of Origin"])
      )

    if (selUnderwire.length)
      list = list.filter(p =>
        selUnderwire.includes(p.productDetails?.["Underwire type"])
      )

    if (selDiscount === "Today's Deals")
      list = list.filter(p => p.deal)

    if (selDiscount === "All Discounts")
      list = list.filter(p => p.discount > 0)

    return list
  }, [
    selBrands, selPrice, minRating, selSizes, selColours,
    selClosures, selStraps, selMaterials, selStyles,
    selCountries, selUnderwire, selDiscount,
  ])

  /* ── Clear all ── */
  const clearAll = () => {
    setPrime(false); setGetByTomorrow(false); setSelBrands([])
    setSelPrice(null); setMinRating(null); setSelDiscount("")
    setOutOfStock(false); setTopBrands(false); setMadeInIndia(false)
    setSelSizes([]); setSelClosures([]); setSelColours([])
    setSelStraps([]); setSelMaterials([]); setSelStyles([])
    setSelCountries([]); setSelUnderwire([]); setSearchBrand("")
  }

  /* ── Active filter chips ── */
  const activeFilters = [
    ...selBrands,
    selPrice !== null ? PRICE_RANGES[selPrice]?.label : null,
    minRating   ? `${minRating}★ & Up` : null,
    selDiscount || null,
    ...selSizes,
    ...selColours,
    ...selClosures,
    ...selStraps,
    ...selMaterials,
    ...selStyles,
    ...selCountries,
    ...selUnderwire,
  ].filter(Boolean)

  const filteredBrands = DATA_BRANDS.filter(b =>
    b.toLowerCase().includes(searchBrand.toLowerCase())
  )

  /* ── Product card ── */
  const ProductCard = ({ item }) => {
    const colorNames = getColorNames(item)
    const avgRating  = item.rating?.average || item.rating || 0
    const ratingCount = item.rating?.count || item.ratingCount

    return (
      <div className="w-full bg-white border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col">

        {/* Badges */}
        <div className="px-2 pt-1 flex gap-1 flex-wrap">
          {item.badge && (
            <span className="inline-block bg-orange-700 text-white text-xs font-semibold px-2 py-1 rounded">
              {item.badge}
            </span>
          )}
          {item.deal && (
            <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {item.deal}
            </span>
          )}
        </div>

        {/* Image */}
        <Link to={`/product/${item.id}`} className="block w-full h-[290px] bg-white overflow-hidden">
          <img
            src={Array.isArray(item.images) ? item.images[0] : item.image}
            alt={item.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={e => { e.target.src = "/placeholder.png" }}
          />
        </Link>

        {/* Content */}
        <div className="px-2 pb-3 flex flex-col flex-1">

          {/* Color swatches */}
          {colorNames.length > 0 && (
            <div className="flex gap-1.5 py-2 flex-wrap">
              {colorNames.map((name, idx) => {
                const colorObj = safe(item.colors).find(c =>
                  (typeof c === "string" ? c : c?.name) === name
                )
                const imgUrl = typeof colorObj === "object" ? colorObj?.image : null
                const hex    = typeof colorObj === "object" ? colorObj?.hex   : null
                return imgUrl ? (
                  <img key={idx} src={imgUrl} alt={name} title={name}
                    className="w-6 h-6 rounded-full border border-gray-400 object-cover cursor-pointer hover:scale-110 transition-transform"/>
                ) : (
                  <span key={idx} title={name}
                    className="w-5 h-5 rounded-full border border-gray-400 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: hex || (name.toLowerCase() === "black" ? "#000" : name.toLowerCase() === "white" ? "#fff" : name.toLowerCase() === "red" ? "#cc0000" : "#ddd") }}
                  />
                )
              })}
              {colorNames.length > 1 && (
                <span className="text-xs text-blue-600 self-center">+{colorNames.length} colours</span>
              )}
            </div>
          )}

          {/* Title */}
          <Link to={`/product/${item.id}`}>
            <h2 className="text-[15px] leading-snug text-gray-900 hover:text-orange-700 line-clamp-2 min-h-[44px]">
              {item.brand && <span className="font-bold">{item.brand} </span>}
              {item.name}
            </h2>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-sm text-gray-700">{Number(avgRating).toFixed(1)}</span>
            <Stars avg={avgRating}/>
            {ratingCount && (
              <span className="text-blue-600 text-xs">({Number(ratingCount).toLocaleString()})</span>
            )}
          </div>

          {/* Bought */}
          {item.boughtInPastMonth && (
            <p className="text-xs text-gray-600 mt-1">{item.boughtInPastMonth}+ bought in past month</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2 flex-wrap">
            <span className="text-2xl font-medium text-gray-900">₹{item.price?.toLocaleString()}</span>
            {item.mrp && item.mrp > item.price && (
              <span className="text-sm text-gray-500">
                M.R.P.: <span className="line-through">₹{item.mrp?.toLocaleString()}</span>
              </span>
            )}
            {item.discount > 0 && (
              <span className="text-sm text-gray-700">({item.discount}% off)</span>
            )}
          </div>

          {/* Tax */}
          {item.tax && <p className="text-xs text-gray-400 mt-0.5">{item.tax}</p>}

          {/* Coupon */}
          {item.coupon?.available && (
            <div className="mt-1.5 flex items-center gap-1 flex-wrap">
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input type="checkbox" className="accent-orange-500"/>
                <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  Apply {item.coupon.discount} coupon
                </span>
              </label>
            </div>
          )}

          {/* Services */}
          {(item.deliveryAndServices || item.services)?.slice(0,2).map((s, i) => (
            <p key={i} className="text-xs text-gray-600 mt-0.5">
              {s.toLowerCase().includes("free") ? <span className="font-semibold">FREE delivery</span> : s}
            </p>
          ))}

          {/* Fulfillment */}
          {item.fulfillment && (
            <p className="text-xs text-gray-400 mt-0.5">{item.fulfillment}</p>
          )}

          {/* Add to Cart */}
          <button
            type="button"
            className="w-full mt-auto pt-3"
            onClick={e => { e.preventDefault(); console.log("Add to cart:", item.id) }}
          >
            <span className="block w-full bg-yellow-400 hover:bg-yellow-500 rounded-full py-2 text-sm font-medium transition-colors text-center">
              Add to cart
            </span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col bg-white md:flex-row gap-2 p-2">

        {/* ══════════════════════════
            SIDEBAR
        ══════════════════════════ */}
        <div className="w-64 flex flex-col gap-1 shrink-0 text-sm">

          {/* Category breadcrumb */}
          <h1 className="font-semibold text-sm mb-1">Category</h1>
          <Link to="/women/clothing"         className="flex items-center text-sm hover:text-orange-700"><IoIosArrowBack /> Clothing & Accessories</Link>
          <Link to="/women/clothing"         className="flex items-center text-sm hover:text-orange-700"><IoIosArrowBack /> Women</Link>
          <Link to="/women/clothing/lingerie"className="flex items-center text-sm hover:text-orange-700"><IoIosArrowBack /> Lingerie</Link>
          <h1 className="font-semibold text-sm px-4">Bras</h1>
          <div className="px-6 flex flex-col gap-0.5">
            <Link to="/women/lingerie/bras/adhesive"                     className="text-blue-600 hover:underline hover:text-orange-700">Adhesive Bras</Link>
            <Link to="/women/clothing/sports-wear/innerwear/sports-bras" className="text-blue-600 hover:underline hover:text-orange-700">Sports Bras</Link>
            <Link to="/women/lingerie/bras/mastectomy"                   className="text-blue-600 hover:underline hover:text-orange-700">Mastectomy Bras</Link>
            <Link to="/women/lingerie/bras/everyday"                     className="text-blue-600 hover:underline hover:text-orange-700">Everyday Bras</Link>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""} active</span>
                <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Clear all</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {activeFilters.map(f => (
                  <span key={f} className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                    {f}
                    <button onClick={() => {
                      setSelBrands(p => p.filter(x => x !== f))
                      setSelSizes(p => p.filter(x => x !== f))
                      setSelColours(p => p.filter(x => x !== f))
                      setSelClosures(p => p.filter(x => x !== f))
                      setSelStraps(p => p.filter(x => x !== f))
                      setSelMaterials(p => p.filter(x => x !== f))
                      setSelStyles(p => p.filter(x => x !== f))
                      setSelCountries(p => p.filter(x => x !== f))
                      setSelUnderwire(p => p.filter(x => x !== f))
                      if (f === (PRICE_RANGES[selPrice]?.label)) setSelPrice(null)
                      if (f === `${minRating}★ & Up`) setMinRating(null)
                      if (f === selDiscount) setSelDiscount("")
                    }} className="text-orange-600 hover:text-red-600 font-bold leading-none">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Amazon Prime ── */}
          <FilterSection title="Amazon Prime">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={prime} onChange={e => setPrime(e.target.checked)} className="accent-orange-500"/>
              <TiTick className="text-yellow-400"/>
              <span className="text-blue-600 font-bold">Prime</span>
            </label>
          </FilterSection>

          {/* ── Delivery Day ── */}
          <FilterSection title="Delivery Day">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={getByTomorrow} onChange={e => setGetByTomorrow(e.target.checked)} className="accent-orange-500"/>
              Get It by Tomorrow
            </label>
          </FilterSection>

          {/* ── Brands (from data) ── */}
          <FilterSection title="Brands">
            {DATA_BRANDS.length > 5 && (
              <input
                value={searchBrand}
                onChange={e => setSearchBrand(e.target.value)}
                placeholder="Search brands"
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-orange-400 mb-1"
              />
            )}
            {filteredBrands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selBrands.includes(brand)}
                  onChange={() => toggle(setSelBrands, brand)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{brand}</span>
                <span className="text-gray-400 text-xs ml-auto">
                  ({safe(bras).filter(p => (p.brand||"").toLowerCase().includes(brand.toLowerCase())).length})
                </span>
              </label>
            ))}
          </FilterSection>

          {/* ── Price ── */}
          <FilterSection title="Price">
            {PRICE_RANGES.map((range, idx) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer">
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
                  onChange={() => setMinRating(minRating === r ? null : r)} className="accent-orange-500"/>
                <Stars avg={r}/>
                <span className="text-blue-600 hover:underline">& Up</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Deals & Discounts ── */}
          <FilterSection title="Deals & Discounts" defaultOpen={false}>
            {DISCOUNTS.map(d => (
              <label key={d} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="discount" checked={selDiscount === d}
                  onChange={() => setSelDiscount(selDiscount === d ? "" : d)} className="accent-orange-500"/>
                <span className="text-blue-600 hover:underline hover:text-orange-700">{d}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Availability ── */}
          <FilterSection title="Availability" defaultOpen={false}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={outOfStock} onChange={e => setOutOfStock(e.target.checked)} className="accent-orange-500"/>
              Include Out of Stock
            </label>
          </FilterSection>

          {/* ── Amazon Fashion ── */}
          <FilterSection title="Amazon Fashion" defaultOpen={false}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={topBrands} onChange={e => setTopBrands(e.target.checked)} className="accent-orange-500"/>
              Top Brands
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={madeInIndia} onChange={e => setMadeInIndia(e.target.checked)} className="accent-orange-500"/>
              Made for India
            </label>
          </FilterSection>

          {/* ── Sizes (from data) ── */}
          {DATA_SIZES.length > 0 && (
            <FilterSection title="Women's Clothing Size" defaultOpen={false}>
              <div className="flex flex-wrap gap-1">
                {DATA_SIZES.map(s => (
                  <button key={s} onClick={() => toggle(setSelSizes, s)}
                    className={`px-2 py-0.5 border text-xs rounded transition-all
                      ${selSizes.includes(s)
                        ? "bg-orange-600 text-white border-orange-600"
                        : "border-gray-300 text-gray-700 hover:border-orange-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          {/* ── Closure Type (from data) ── */}
          {DATA_CLOSURES.length > 0 && (
            <FilterSection title="Closure Type" defaultOpen={false}>
              {DATA_CLOSURES.map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selClosures.includes(c)}
                    onChange={() => toggle(setSelClosures, c)} className="accent-orange-500"/>
                  <span className="text-blue-600 hover:underline hover:text-orange-700">{c}</span>
                </label>
              ))}
            </FilterSection>
          )}

          {/* ── Colours (from data) ── */}
          {DATA_COLOURS.length > 0 && (
            <FilterSection title="Colour" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {DATA_COLOURS.map(name => {
                  const colorMap = {
                    black:"#000000", white:"#FFFFFF", red:"#CC0000",
                    beige:"#F5F0E8", skin:"#E8C9A0", pink:"#FF69B4",
                    blue:"#0000FF", nude:"#E8C9A0", grey:"#808080",
                    "rose blush":"#FFB6C1", eclipse:"#333355",
                    "grape wine":"#722F37", "honey beige":"#C8A97E",
                    "pearl blush":"#FADADD",
                  }
                  const hex = colorMap[name.toLowerCase()] || "#D0D0D0"
                  return (
                    <button key={name} onClick={() => toggle(setSelColours, name)}
                      title={name}
                      className={`w-6 h-6 rounded-full border-2 transition-all
                        ${selColours.includes(name)
                          ? "border-orange-500 scale-125 shadow-md"
                          : "border-gray-300 hover:border-gray-500"}`}
                      style={{ backgroundColor: hex }}
                    />
                  )
                })}
              </div>
              {selColours.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{selColours.join(", ")}</p>
              )}
            </FilterSection>
          )}

          {/* ── Strap Type (from data) ── */}
          {DATA_STRAPS.length > 0 && (
            <FilterSection title="Strap Type" defaultOpen={false}>
              {DATA_STRAPS.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selStraps.includes(s)}
                    onChange={() => toggle(setSelStraps, s)} className="accent-orange-500"/>
                  <span className="text-blue-600 hover:underline hover:text-orange-700">{s}</span>
                </label>
              ))}
            </FilterSection>
          )}

          {/* ── Material (from data) ── */}
          {DATA_MATERIALS.length > 0 && (
            <FilterSection title="Material" defaultOpen={false}>
              {DATA_MATERIALS.map(m => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selMaterials.includes(m)}
                    onChange={() => toggle(setSelMaterials, m)} className="accent-orange-500"/>
                  <span className="text-blue-600 hover:underline hover:text-orange-700">{m}</span>
                </label>
              ))}
            </FilterSection>
          )}

          {/* ── Style (from data) ── */}
          {DATA_STYLES.length > 0 && (
            <FilterSection title="Style" defaultOpen={false}>
              {DATA_STYLES.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selStyles.includes(s)}
                    onChange={() => toggle(setSelStyles, s)} className="accent-orange-500"/>
                  <span className="text-blue-600 hover:underline hover:text-orange-700">{s}</span>
                </label>
              ))}
            </FilterSection>
          )}

          {/* ── Underwire Type (from data) ── */}
          {DATA_UNDERWIRE.length > 0 && (
            <FilterSection title="Underwire Type" defaultOpen={false}>
              {DATA_UNDERWIRE.map(u => (
                <label key={u} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selUnderwire.includes(u)}
                    onChange={() => toggle(setSelUnderwire, u)} className="accent-orange-500"/>
                  <span className="text-blue-600 hover:underline hover:text-orange-700">{u}</span>
                </label>
              ))}
            </FilterSection>
          )}

          {/* ── Country of Origin (from data) ── */}
          {DATA_COUNTRIES.length > 0 && (
            <FilterSection title="Country of Origin" defaultOpen={false}>
              {DATA_COUNTRIES.map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selCountries.includes(c)}
                    onChange={() => toggle(setSelCountries, c)} className="accent-orange-500"/>
                  <span className="text-blue-600 hover:underline hover:text-orange-700">{c}</span>
                </label>
              ))}
            </FilterSection>
          )}

        </div>

        {/* ══════════════════════════
            PRODUCT GRID
        ══════════════════════════ */}
        <div className="flex-1 min-w-0 w-full">
          <h1 className="font-semibold text-xl">Results</h1>
          <p className="text-sm text-gray-600">
            Check each product page for other buying options. Price and other details may vary based on product size and colour.
          </p>
          <p className="text-sm text-gray-500 mt-1 mb-2">
            <span className="font-medium text-gray-800">1–{filtered.length}</span>
            {filtered.length !== safe(bras).length && (
              <> of <span className="font-medium text-gray-800">{safe(bras).length}</span></>
            )}{" "}results
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="ml-2 text-blue-600 hover:underline text-xs">
                Clear filters
              </button>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 bg-gray-100">

            {/* Skeleton */}
            {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i}/>)}

            {/* No results */}
            {!loading && filtered.length === 0 && (
              <div className="col-span-4 py-16 text-center text-gray-500">
                <p className="text-lg font-semibold">No results found</p>
                <p className="text-sm mt-1">Try removing some filters</p>
                <button onClick={clearAll}
                  className="mt-3 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 rounded-full text-sm font-medium">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Cards */}
            {!loading && filtered.map((item, idx) => (
              <ProductCard key={`${item.id}-${idx}`} item={item}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bras