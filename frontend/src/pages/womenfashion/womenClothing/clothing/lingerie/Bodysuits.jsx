import React, { useEffect, useMemo, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { bodySuitBestSellers, bodySuitRecommended, bodySuitToprated } from '../../../../../component/data/womenfashion'
import StarRating from './StarRating'


const bodysuitWomen = [
  {name:"women",image:"https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg",path:"/women/clothing"},
  {name:"Lingerie",image:"https://m.media-amazon.com/images/I/31jTmtNtHhL._AC._SR240,240.jpg",path:""},
  {name:"Bodysuites",image:"https://m.media-amazon.com/images/I/31B-86xksBL._AC._SR240,240.jpg",path:""},
]

const SkeletonCard = () => (

  <div className="rounded shadow-sm bg-white p-2 animate-pulse">

    <div className="bg-gray-200 w-full h-72 rounded" />

    <div className="h-4 bg-gray-200 rounded w-1/3 mt-3" />

    <div className="h-3 bg-gray-200 rounded w-full mt-2" />

    <div className="h-3 bg-gray-200 rounded w-4/5 mt-2" />

    <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />

  </div>

);



const SkeletonGrid = ({ count = 4 }) => (

  <>

    {Array.from({ length: count }).map((_, index) => (

      <SkeletonCard key={index} />

    ))}

  </>

);



const SkeletonText = ({ width = 'w-24', height = 'h-4', className = '' }) => (
  <span aria-hidden="true" className={`inline-block animate-pulse rounded bg-gray-200 ${width} ${height} ${className}`} />
);

const Bodysuits = () => {
  const [loading , setLoading] = useState(true);
const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedFitTypes, setSelectedFitTypes] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [selectedClosures, setSelectedClosures] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedNecks, setSelectedNecks] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');


    const priceRanges = [
    { label: 'Under ₹300', min: 0, max: 300 },
    { label: '₹300 - ₹500', min: 300, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹1,500', min: 1000, max: 1500 },
    { label: 'Over ₹1,500', min: 1500, max: Infinity },
  ]; 
  
     useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
        return () => clearTimeout(timer);
    }, []);

    const today = new Date();
    const tomorrow = new Date(today);
     tomorrow.setDate(today.getDate() + 1);
     const nextFriday = new Date(today);
  const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  const formattedFriday = nextFriday.toLocaleDateString('en-US',{
    weekday: 'short', month: 'short', day: 'numeric',  });
  const formattedTomorrow = tomorrow.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',  });  
    

     const categoryProducts = useMemo(() => [
    ...bodySuitBestSellers,
    ...bodySuitRecommended,
    ...bodySuitToprated
       
    
      ], []);

   const allColors = [...new Set(categoryProducts.flatMap((item) => item.colors || []))];
       const allSizes = [...new Set(categoryProducts.flatMap((item) => {

    const sizes = item.sizes ?? item.size ?? [];

    return Array.isArray(sizes) ? sizes : [sizes];

  }))];

  const allBrands = [...new Set(categoryProducts.map((item) => typeof item.brand === 'string' ? item.brand : item.brand?.name).filter(Boolean))];

  const allMaterials = [...new Set(categoryProducts.map((item) => item.materialComposition).filter(Boolean))];

  const allLengths = [...new Set(categoryProducts.map((item) => item.length).filter(Boolean))];

  const allOccasions = [...new Set(categoryProducts.map((item) => item.occasionType).filter(Boolean))];

  const allClosures = [...new Set(categoryProducts.map((item) => item.closureType).filter(Boolean))];

  const allStyles = [...new Set(categoryProducts.map((item) => item.style).filter(Boolean))];

  const allNeckStyles = [...new Set(categoryProducts.map((item) => item.neckStyle).filter(Boolean))];

  const allFitTypes = [...new Set(categoryProducts.map((item) => item.fitType || item.fittype).filter(Boolean))];

  const allPatterns = [...new Set(categoryProducts.map((item) => item.pattern).filter(Boolean))]; 

  const filteredProducts = categoryProducts.filter((product) => {

    const brandName = typeof product.brand === 'string' ? product.brand : product.brand?.name;

    if (selectedBrands.length && !selectedBrands.includes(brandName)) return false;

    if (selectedPriceRange) {

      const range = priceRanges.find((item) => item.label === selectedPriceRange);

      const price = Number(product.price ?? 0);

      if (range && !(price >= range.min && (range.max === Infinity ? true : price < range.max))) return false;

    }

    if (selectedColors.length && !selectedColors.some((color) => product.colors?.includes(color))) return false;

    const productSizes = product.sizes ?? product.size ?? [];

    const normalizedSizes = Array.isArray(productSizes) ? productSizes : [productSizes];

    if (selectedSizes.length && !selectedSizes.some((size) => normalizedSizes.includes(size))) return false;

    if (selectedMaterials.length && !selectedMaterials.includes(product.materialComposition)) return false;

    if (selectedLengths.length && !selectedLengths.includes(product.length)) return false;

    if (selectedOccasions.length && !selectedOccasions.includes(product.occasionType)) return false;

    if (selectedClosures.length && !selectedClosures.includes(product.closureType)) return false;

    if (selectedStyles.length && !selectedStyles.includes(product.style)) return false;

    if (selectedNecks.length && !selectedNecks.includes(product.neckStyle)) return false;

    if (selectedFitTypes.length && !selectedFitTypes.includes(product.fitType || product.fittype)) return false;

    if (selectedPatterns.length && !selectedPatterns.includes(product.pattern)) return false;

    return true;

  });
  

  const toggleValue =(setter,value) => {
    setter((previous) => previous.includes(value)
     ? previous.filter((item) => item !== value)
     : [...previous,value]
  );
  };

  const clearAllFilters =() => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedOccasions([]);
    setSelectedFitTypes([]);
    setSelectedPatterns([]);
    setSelectedClosures([]);
    setSelectedStyles([]);
    setSelectedNecks([]);
    setSelectedLengths([]);
    setSelectedPriceRange('');

  }
 const renderProductCard = (item) => {

    const brandName = typeof item.brand === 'string' ? item.brand : item.brand?.name;

    const imageList = item.image || item.images || [];

    const sellingPrice = item.price ?? 0;

    const mrp = item.mrp ?? (item.discount ? Math.round(sellingPrice / (1 - item.discount / 100)) : sellingPrice);



    return (

      <div key={item.id} className="rounded shadow-sm group relative bg-white">

        <Link to={`/product/${item.id}`}>

          <div className="bg-gradient-to-tl from-gray-200 via-white to-gray-300 relative">

            <img

              src={imageList[0] || 'https://via.placeholder.com/300x400?text=No+Image'}

              alt={item.name || brandName || 'Product'}

              className="w-full h-72 cursor-pointer object-contain rounded mix-blend-darken"

              loading="lazy"

            />

            <button type="button" className="absolute inset-0 top-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

              <span className="px-16 py-2 border bg-white text-black rounded-full text-sm">Quick Look</span>

            </button>

          </div>

        </Link>

        <div className="px-2 py-2">
          {loading ? <SkeletonText width="w-2/5" height="h-5" /> : <h1 className="text-base font-semibold">{brandName}</h1>}
          {loading ? (
            <div className="mt-2 space-y-2">
              <SkeletonText width="w-full" height="h-3" />
              <SkeletonText width="w-4/5" height="h-3" />
            </div>
          ) : <p className="text-xs font-normal line-clamp-2">{item.name || item.description || ''}</p>}
          <div className="flex items-center gap-1 mt-1">
            {loading ? <SkeletonText width="w-20" height="h-3" /> : <><StarRating rating={item.rating ?? item.ratingsAverage ?? 0} /><span className="text-xs text-gray-600">{item.ratingCount || 0}</span></>}
          </div>
          {loading ? <SkeletonText width="w-1/2" height="h-5" className="mt-2" /> : (
            <p className="font-semibold text-base mt-1">
              ₹{sellingPrice}
              {mrp > sellingPrice && (
                <>
                  <span className="text-gray-500 ml-1 line-through text-sm font-mono">M.R.P ₹{mrp}</span>
                  <span className="ml-1 text-xs">({item.discount ?? Math.round(((mrp - sellingPrice) / mrp) * 100)}% off)</span>
                </>
              )}
            </p>
          )}
        </div>

      </div>

    );

  };


  const renderCheckboxFilter = (title, values, selected, setter) => (
    <div className="mt-4">
      {loading ? <SkeletonText width="w-20" /> : <h2 className="font-semibold text-sm">{title}</h2>}
      <div className="flex flex-col gap-2 mt-2">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonText key={index} width={index % 2 ? 'w-3/5' : 'w-4/5'} height="h-3" />
            ))
          : values.map((value) => (
              <label key={value} className="text-xs flex items-center gap-2">
                <input type="checkbox" checked={selected.includes(value)} onChange={() => toggleValue(setter, value)} className="accent-orange-500" />
                {value}
              </label>
            ))}
      </div>
    </div>
  );

  return (
     <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
            <h1 className="font-semibold text-sm">Category</h1>
                     <Link to="/women/clothing" className="flex items-center  text-sm">
                      <IoIosArrowBack />  Clothing & Accessories
                     </Link>
                     <Link to="/women/clothing" className="flex items-center  text-sm">
                      <IoIosArrowBack /> Women
                     </Link>
                     <Link to="/women/lingerie" className="flex items-center  text-sm">
                       <IoIosArrowBack /> Lingerie
                     </Link>
                    
           <h1 className="font-semibold text-sm px-4">Bodysuits</h1>

          {loading ? <SkeletonText width="w-28" height="h-8" className="mt-4" /> : (
            <button onClick={clearAllFilters} className="mt-4 px-4 py-1 text-sm text-orange-600 border border-orange-400 rounded hover:bg-orange-50">
              Clear All Filters
            </button>
          )}

          {renderCheckboxFilter('Brands', allBrands, selectedBrands, setSelectedBrands)}
           
           <div className='mt-4'>
            {loading ? <SkeletonText width='w-16'/> : <h2 className="font-semibold text-sm">Price</h2>}

            <div className='flex flex-col gap-1 mt-1'>
              {loading ? Array.from({length:5}).map((_,index ) => <SkeletonText key={index} width={['w-24', 'w-28', 'w-32', 'w-32', 'w-24'][index]} height='h-4'/>) : priceRanges.map((range) =>(
                <button  key={range.label}

                  type="button"

                  onClick={() => setSelectedPriceRange((current) => current === range.label ? '' : range.label)}

                  aria-pressed={selectedPriceRange === range.label}

                  className={`text-left text-sm py-0.5 hover:text-orange-600 ${

                    selectedPriceRange === range.label ? 'font-semibold text-orange-600' : 'text-gray-900'

                  }`}>
                   {range.label}

                  {selectedPriceRange === range.label && <span className="ml-2">✓</span>}
                </button>
              ))}

            </div>

           </div>

          <div className="mt-1">

            {loading ? <SkeletonText width="w-16" /> : <h2 className="font-semibold text-sm">Colour</h2>}
             <div className='flex flex-wrap gap-1 mt-2'>

              {loading ? Array.from({length:12}).map((_,index)=> <SkeletonText key={index} width='w-6' height='h-6'/>): allColors.map((color)=>{
                const colorMap ={
                   black: '#171717', white: '#ffffff', grey: '#888888',

                  gray: '#888888', red: '#c90000', maroon: '#800000',

                  blue: '#1755a5', navy: '#142b50', green: '#65b719',

                  yellow: '#ffe52b', pink: '#ffc6cc', purple: '#8a20e8',

                  orange: '#ff9b36', brown: '#754019', beige: '#d6c99b',

                  cream: '#fffde7', gold: '#d6b64f', silver: '#c9c9c9',

                  teal: '#25b2ad'
                };
                const swatch = colorMap[color.toLowerCase()] || color;
  const isSelected = selectedColors.includes(color);
                return (
                  <button key={color} type='button' title={color}   aria-label={`Filter by ${color}`}

                      aria-pressed={isSelected} 
                    onClick={() =>toggleValue(setSelectedColors,color)}
                      className={`h-6 w-6 border ${isSelected ? 'ring-2 ring-orange-500 ring-offset-1 border-gray-900' : 'border-gray-300'}`}

                    style={{ backgroundColor: swatch }}
                    />

                 
                )
              })}

             </div>
 {!loading && selectedColors.length > 0 && (

              <p className="text-xs text-gray-600 mt-2">

                Selected: {selectedColors.join(', ')}

              </p>

            )}

           </div>

            <div className="mt-1">

            {loading ? <SkeletonText width="w-36" /> : <h2 className="font-semibold text-sm">Women's Clothing Size</h2>}

<div className="grid grid-cols-4 gap-1 mt-2">
{loading ? Array.from({length:12}).map((_,index) => <SkeletonText key={index} width="w-full" height="h-7" className="rounded-lg" />): allSizes.map((size)=>
(
  <button
  key={size}
  type='button' 
  onClick={() => toggleValue(setSelectedSizes,size)}
  aria-pressed={selectedSizes.includes(size)}
   className={`min-h-7 px-2 py-1 text-xs rounded-lg border ${

                    selectedSizes.includes(size)

                      ? 'border-orange-500 bg-orange-50 text-orange-700'

                      : 'border-gray-400 bg-white text-gray-800 hover:border-gray-800'

                  }`}
  >
    

    {size}
  </button>
))}
</div>
           </div>

          </div>

         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Women's Bodysuits</h1>
          <h1 className="font-semibold text-4xl mt-6 px-4">Featured categories</h1>

          <div className="flex flex-wrap gap-4 p-4">
                     {loading
                       ? Array.from({ length: 3 }).map((_, index) => (
                           <div key={index} className="w-48 animate-pulse">
                             <div className="bg-gray-200 w-48 h-48 rounded-full" />
                             <div className="h-5 w-24 bg-gray-200 rounded mx-auto mt-3" />
                           </div>
                         ))
                       : bodysuitWomen.map((item, index) => (
                           <div key={index}>
                             <Link to={item.path} className="flex items-center bg-gray-100 w-48 h-48 rounded-full gap-2 p-8">
                               <img src={item.image} alt={item.name} className="object-cover mix-blend-darken" />
                             </Link>
                             <h1 className="font-semibold text-center text-lg px-4">{item.name}</h1>
                           </div>
                         ))}
                   </div>

                       <section className="mb-10">
                   
                               <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
                   
                               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   
                                 {loading ? <SkeletonGrid count={4} /> : bodySuitRecommended.map(renderProductCard)}
                   
                               </div>
                   
                             </section>
                       <section className="mb-10">
                   
                               <h2 className="text-2xl font-bold mb-4">Top rated</h2>
                   
                               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   
                                 {loading ? <SkeletonGrid count={4} /> :  bodySuitToprated.map(renderProductCard)}
                   
                               </div>
                   
                             </section>
                       <section className="mb-10">
                   
                               <h2 className="text-2xl font-bold mb-4">Best sellers</h2>
                   
                               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   
                                 {loading ? <SkeletonGrid count={4} /> : bodySuitBestSellers.map(renderProductCard)}
                   
                               </div>
                   
                             </section>

                             <div className="py-2 px-4 border border-gray-300 mt-2 rounded-xl">

            {/* <h1>1-{filteredProducts.length} of over {categoryProducts.length} results for Pantyhose & Stockings</h1> */}

            {loading && <p>Loading products...</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 mt-4">

              {/* {!loading && filteredProducts.map(renderProductCard)}

              {!loading && filteredProducts.length === 0 && (

                <p className="col-span-full text-sm text-gray-500">No products found for selected filters.</p>

              )} */}

            </div>

          </div>
                       
        </div>
      </div>
    </div>
  )
}

export default Bodysuits