import React, { useEffect, useMemo, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { pantyhouseBestSellers, pantyhouseHotNewReleases, pantyhouseRecomended, pantyhouseTopRated } from '../../../../../component/data/womenfashion';
import StarRating from './StarRating';


const lingerFeaturedCategories = [

  {

    name: "Women",

    image:

      "https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg",

    path: "/women/clothing",

  },

  {

    name: "Lingerie",

    image:

      "https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg",

    path: "/women/lingerie",

  },

  {

    name: "Pantyhouse & Stockings",

    image:

      "https://m.media-amazon.com/images/I/31Vscp+2FCL._AC._SR240,240.jpg",

    path: "/women/lingerie/pantyhouse",

  },

];



const PantyhoseStockings = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({}); 
  
  
      useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);
        return () => clearTimeout(timer);
    }, []);

      const categoryProducts = useMemo(() => {
    
        return [
    
          ...pantyhouseBestSellers,
    
          ...pantyhouseRecomended,
    
          ...pantyhouseHotNewReleases,
    
          ...pantyhouseTopRated,
          
    
        ];
    
      }, []);

    const dynamicFilterKeys = [
    "brand",
    "colors",
    "materialComposition",
    "style",
    "fittype",
    "straptype",
    "materialtype",
    "country",
    "pattern",
    "size",
    "bottomStyle",
    "closureType",
    "neckStyle",
    "cupSize",
    "sleeveLength",
   "lifeEvent",
    "occasion",
  ];

 const getProductValues = (product, key) => {
    const value = product[key];
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    if (value !== undefined && value !== null && value !== "") {
      return [value];
    }
    return [];

  };
  
   const filteredProducts = useMemo(() => {
  
      return categoryProducts.filter((product) => {
  
        for (const [key, selectedValues] of Object.entries(filters)) {
  
          if (!selectedValues || selectedValues.length === 0) {
  
            continue;
  
          }
  
  
  
          const productValues = getProductValues(product, key);
  
  
  
          const matched = selectedValues.some((selectedValue) =>
  
            productValues.some(
  
              (productValue) =>
  
                String(productValue).toLowerCase() ===
  
                String(selectedValue).toLowerCase()
  
            )
  
          );
  
  
  
          if (!matched) {
  
            return false;
  
          }
  
        }
  
  
  
        return true;
  
      });
  
    }, [categoryProducts, filters]);

   const getFilterOptions = (key) => {

    const values = [];



    categoryProducts.forEach((product) => {

      const productValues = getProductValues(product, key);



      productValues.forEach((value) => {

        if (value !== undefined && value !== null && value !== "") {

          values.push(String(value).trim());

        }

      });

    });



    return [...new Set(values)].filter(Boolean);

  };

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


const renderProductCard = (item) =>(
  <div key={item.id} className='rounded shadow-sm group relative bg-white'>
    <Link to={`/product/${item.id}`}>
    
     <div  className="bg-gradient-to-tl from-gray-200 via-white to-gray-300 relative">
      <img  src={item.image?.[0]} alt={item.brand}  className="w-full h-72 cursor-pointer object-contain rounded mix-blend-darken"/>
     <button className="absolute inset-0 top-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
       <span className="px-16 py-2 border bg-white text-black rounded-full text-sm">
            Quick Look
          </span>
     </button>
    </div>
</Link>
    <div className="px-2 py-2">
       <h1 className="text-base font-semibold">{item.brand}</h1>
       <p className="text-xs font-normal line-clamp-2">{item.name}</p>
       <div className="flex items-center gap-1 mt-1">
        <StarRating rating={item.rating || 0}/>
         <span className="text-xs text-gray-600">{item.ratingCount || 0}</span>
      </div>
       <p className="font-semibold text-base mt-1">
          ₹{(item.price * (1 - item.discount / 100)).toFixed(0)}
          <span className="text-gray-500 ml-1 line-through text-sm font-mono">
            M.R.P ₹{item.price}
          </span>
          <span className='ml-1 text-xs'>({item.discount}% off)</span>
        </p>
    </div>

  </div>
)

  return (
      <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <aside className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
            <Link to="/women/clothing" className="flex items-center  text-sm">
                                 <IoIosArrowBack />  Clothing & Accessories
                                </Link>
                                <Link to="/women/clothing" className="flex items-center  text-sm">
                                 <IoIosArrowBack /> Women
                                </Link>
                                <Link to="/women/clothing/lingerie" className="flex items-center  text-sm">
                                  <IoIosArrowBack /> Lingerie
                                </Link>
           <h1 className="font-semibold text-sm px-4">Pantyhose & Stockings</h1>

            {dynamicFilterKeys.map((key) => {
                const options = getFilterOptions(key);
                if (options.length === 0) return null;
                return (
                  <div key={key} className="mt-4 border-b border-gray-200 pb-3">
                    <h2 className="font-semibold text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </h2>
                    <div className="mt-2 max-h-48 overflow-y-auto">
                      {options.map((option) => (
                        <label key={option} className="flex items-center cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            className="accent-orange-400 mr-2"
                            checked={filters[key]?.includes(option) || false}
                            onChange={() => toggleFilter(key, option)}
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
        </aside>
         <main className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>

           <div className="flex flex-wrap gap-4 p-4">
                      {loading
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="w-48 animate-pulse">
                              <div className="bg-gray-200 w-48 h-48 rounded-full" />
                              <div className="h-5 w-24 bg-gray-200 rounded mx-auto mt-3" />
                            </div>
                          ))
                        : lingerFeaturedCategories.map((item, index) => (
                            <div key={index}>
                              <Link to={item.path} className="flex items-center bg-gray-100 w-48 h-48 rounded-full gap-2 p-8">
                                <img src={item.image} alt={item.name} className="object-cover mix-blend-darken" />
                              </Link>
                              <h1 className="font-semibold text-center text-lg px-4">{item.name}</h1>
                            </div>
                          ))}
                    </div>


                    {/* Recommended for you */}
                    {/* Sections */}
                    <section className="mb-10">
                      <h2 className='text-2xl font-bold mb-4'>Recommended for you</h2>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                       {loading ? <SkeletonGrid count={4} /> : pantyhouseRecomended.map(renderProductCard)} 

                      </div>
                    </section>

                    {/* Top rated  */}
                    <section className="mb-10">
                      <h2 className='text-2xl font-bold mb-4'>Top rated </h2>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {loading ? <SkeletonGrid count={4}/> :pantyhouseTopRated.map(renderProductCard)}

                      </div>
                    </section>

                    {/* Hot new releases */}
                    <section className="mb-10">
                      <h2 className='text-2xl font-bold mb-4'>Hot new releases</h2>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {loading ? <SkeletonGrid count={4}/> : pantyhouseHotNewReleases.map(renderProductCard)}

                      </div>
                    </section>

                    {/* Best sellers  */}
                    <section className="mb-10">
                      <h2 className='text-2xl font-bold mb-4'>Best sellers </h2>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {loading ? <SkeletonGrid count={4}/> : pantyhouseBestSellers.map(renderProductCard)}

                      </div>
                    </section>

                    
        </main>
      </div>
    </div>
  )
}

export default PantyhoseStockings