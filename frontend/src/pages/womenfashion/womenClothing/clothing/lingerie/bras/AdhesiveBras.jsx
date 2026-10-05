import React, { useEffect, useMemo, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { TiTick } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import { adhesiveBrasBestsellers, adhesiveBrasHotreleases, adhesiveBrasRecommended, adhesiveBrasToprated } from '../../../../../../component/data/womenfashion'

const AdhesiveBras = () => {
    const [loading, setLoading] = useState(true);

  // -----------------------------
  // FILTER STATES
  // -----------------------------
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedClosureTypes, setSelectedClosureTypes] = useState([]);
const [selectedCareInstructions, setSelectedCareInstructions] = useState([]);
const [selectedStrapTypes, setSelectedStrapTypes] = useState([]);
const [selectedCountries, setSelectedCountries] = useState([]);
const [selectedMaterials, setSelectedMaterials] = useState([]);
const [selectedPatterns, setSelectedPatterns] = useState([]);
const [selectedNeckStyles, setSelectedNeckStyles] = useState([]);
const [selectedBraBandSizes, setSelectedBraBandSizes] = useState([]);
const [selectedBraCupSizes, setSelectedBraCupSizes] = useState([]);


  // -----------------------------
  // SKELETON LOADING
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // -----------------------------
  // COMBINE ALL 4 DATA ARRAYS
  // Remove duplicate products by ID
  // -----------------------------
  const allProducts = useMemo(() => {
    const combined = [
      ...adhesiveBrasBestsellers,
      ...adhesiveBrasHotreleases,
      ...adhesiveBrasRecommended,
      ...adhesiveBrasToprated,
    ];

    const uniqueProducts = Array.from(
      new Map(
        combined.map((item) => [String(item.id), item])
      ).values()
    );

    return uniqueProducts;
  }, []);

  // -----------------------------
  // FILTER OPTIONS
  // Automatically generated
  // -----------------------------
  const brands = useMemo(() => {
    return [
      ...new Set(
        allProducts
          .map((item) => item.brand)
          .filter(Boolean)
      ),
    ];
  }, [allProducts]);

  const colors = useMemo(() => {
    return [
      ...new Set(
        allProducts
          .flatMap((item) => item.colors || [])
          .filter(Boolean)
      ),
    ];
  }, [allProducts]);

  const sizes = useMemo(() => {
    return [
      ...new Set(
        allProducts
          .flatMap((item) => {
            if (Array.isArray(item.sizes)) {
              return item.sizes;
            }

            if (Array.isArray(item.size)) {
              return item.size;
            }

            if (item.size) {
              return [item.size];
            }

            return [];
          })
          .filter(Boolean)
      ),
    ];
  }, [allProducts]);

  const closureTypes = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.closureType)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const careInstructions = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.careInstructions)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const strapTypes = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.straptype)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const countries = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.country)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const materials = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .flatMap((item) => {
          const values = [
            item.materialtype,
            item.materialComposition,
          ];

          return values.filter(Boolean);
        })
    ),
  ];
}, [allProducts]);

const patterns = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.pattern)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const neckStyles = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.neckStyle)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const braBandSizes = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.braBandSize)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);

const braCupSizes = useMemo(() => {
  return [
    ...new Set(
      allProducts
        .map((item) => item.braCupSize)
        .filter(Boolean)
    ),
  ];
}, [allProducts]);


  // -----------------------------
  // CHECKBOX HANDLER
  // -----------------------------
  const handleCheckbox = (value, setter) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  // -----------------------------
  // MAIN FILTER
  // -----------------------------
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Brand
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.includes(product.brand)
      ) {
        return false;
      }

      // Color
      if (selectedColors.length > 0) {
        const productColors = product.colors || [];

        const hasColor = selectedColors.some((color) =>
          productColors.includes(color)
        );

        if (!hasColor) {
          return false;
        }
      }

      // Size
      if (selectedSizes.length > 0) {
        const productSizes = Array.isArray(product.sizes)
          ? product.sizes
          : Array.isArray(product.size)
          ? product.size
          : product.size
          ? [product.size]
          : [];

        const hasSize = selectedSizes.some((size) =>
          productSizes.includes(size)
        );

        if (!hasSize) {
          return false;
        }
      }

      // Minimum price
      if (
        minPrice !== "" &&
        Number(product.price) < Number(minPrice)
      ) {
        return false;
      }

      // Maximum price
      if (
        maxPrice !== "" &&
        Number(product.price) > Number(maxPrice)
      ) {
        return false;
      }

      // Rating
      if (
        minRating !== "" &&
        Number(product.rating || 0) < Number(minRating)
      ) {
        return false;
      }

      return true;
    });
  }, [
    allProducts,
    selectedBrands,
    selectedColors,
    selectedSizes,
    minPrice,
    maxPrice,
    minRating,
  ]);

  // -----------------------------
  // SKELETON CARD
  // -----------------------------
  const ProductSkeleton = () => (
    <div className="bg-gray-200 p-2 rounded animate-pulse">
      <div className="h-72 w-full bg-gray-300 rounded" />

      <div className="h-4 bg-gray-300 rounded mt-3 w-3/4" />

      <div className="h-4 bg-gray-300 rounded mt-2 w-1/2" />

      <div className="h-4 bg-gray-300 rounded mt-2 w-1/3" />

      <div className="h-4 bg-gray-300 rounded mt-2 w-2/3" />
    </div>
  );

  return (
      <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
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
           <Link to="/women/lingerie/bras" className="flex items-center  text-sm">
             <IoIosArrowBack /> Bras
           </Link>
           <h1 className="font-semibold text-sm px-4">Adhesive Bras</h1>

              <h2 className="font-semibold text-sm">Amazon Prime</h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-orange-400"
                  
                  />
                  <TiTick className="text-orange-400 text-lg" />
                  <span className="text-blue-500 font-bold">prime</span>
                </label>

           <h2 className="font-semibold text-sm">Delivery Day</h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-orange-400"
                                    />
                  <span className="ml-1 text-sm">Get It by Tomorrow</span>
                </label>
           {brands.length > 0 && (
                <div className="pb-4 mb-4">
                  <h3 className="font-bold mb-3">
                    Brand
                  </h3>

                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 mb-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() =>
                          handleCheckbox(
                            brand,
                            setSelectedBrands
                          )
                        }
                      />

                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}

             <div>
              <h1 className="font-semibold text-sm">Price</h1>
              <p>Under ₹300 </p>
              <p>₹300 - ₹500</p>
              <p>₹500 - ₹1000</p>
              <p>₹1000 - ₹2000</p>
              <p>Over ₹2000</p>
             </div>

            <div>
              <h1 className="font-semibold text-sm">Customer Review</h1>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">4 Stars & Up</p>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">3 Stars & Up</p> 
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">2 Stars & Up</p>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">1 Star & Up</p>
            </div>
                
                <div>
                  <h1 className="font-semibold text-sm">Deals & Discounts</h1>
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">All Discounts</p>
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Buy More, Save More</p> 
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Coupons</p>
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Today's Deals</p>
                </div>
  
                       {/* SIZE */}
              {sizes.length > 0 && (
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-bold mb-3">
                    Size
                  </h3>

                  {sizes.map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-2 mb-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() =>
                          handleCheckbox(
                            size,
                            setSelectedSizes
                          )
                        }
                      />

                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              )}

                       <div>
                        <h1 className="font-semibold text-sm">Closure Type</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Back Closure</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Front Closure</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Pull On</p>
                       </div>
                       <div>
                        <h1 className="font-semibold text-sm">Care Instructions</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Dry Clean Only</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Hand Wash Only</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Machine Wash</p>
                       </div>

                       <div>
                        <h1 className="font-semibold text-sm">Bra Brand Size</h1>
                        <div className='grid gap-2 grid-cols-4 '>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">24</button>
                          <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">26</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">28</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">30</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">32</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">34</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">36</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">38</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">40</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">42</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">44</button>
                          <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">46</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">48</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">50</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">52</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">54</button>
                       </div>
                       </div>

                        <div>
                        <h1 className="font-semibold text-sm">Strap Type
</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Adjustable</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Halter</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Invisible</p>
                       </div>
                        <div>
                        <h1 className="font-semibold text-sm">Country of Origin</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">India</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">China</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">USA</p>
                       </div>
                        <div>
                        <h1 className="font-semibold text-sm">Material</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Cotton</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Polyester</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Spandex</p>
                       </div>

                       {colors.length > 0 && (
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-bold mb-3">
                    Colour
                  </h3>

                  {colors.map((color) => (
                    <label
                      key={color}
                      className="flex items-center gap-2 mb-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() =>
                          handleCheckbox(
                            color,
                            setSelectedColors
                          )
                        }
                      />

                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              )}

                        <div>
                        <h1 className="font-semibold text-sm">Pattern</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Animal Print</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Animal Print</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Solid</p>
                       </div>
                        <div>
                        <h1 className="font-semibold text-sm">Neck Style</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">V-Neck</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">U-Neck</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Scoop Neck</p>
                       </div>
        </div>
         <div className='flex-1 min-w-0 w-full'>

          <h1 className="font-semibold text-4xl">Women's Adhesive Bras</h1>

          <section>
            <h1 className='text-2xl font-bold mt-6'>Feature Categories</h1>
            <div className='flex text-center justify-between '>

               <a href="/women/sport"  className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Women</p>
               </a>

               <a href="/women/lingerie" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Lingerie</p>
               </a>
               <a href="/women/lingerie/bras" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/410b1UuLwVL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken'  />
                <p>Bras</p>
               </a>
               <a href="/women/lingerie/bras/adhesive" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41hUqCKY3aL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Adhesive</p>
               </a>
            </div>
          </section>
          {/* Recommended for you */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Recommended for you</h1>

            <div className="flex gap-2">
  {adhesiveBrasRecommended.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2"
    >
      <img
        src={item.image?.[0]}
        alt={item.name}
        className="h-72 w-full object-cover mix-blend-darken"
      />

      <button
        className="bg-white relative py-2 -mt-18 px-4 rounded-full border border-black
        hover:opacity-100 opacity-0 cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Quick Look
      </button>

      <div className="bg-white mt-8 p-2">
        <p className="font-bold">₹{item.price}</p>

        <p className="line-through text-gray-500">
          ₹{item.mrp}
        </p>

        <p className="text-sm">
          {item.name.slice(0, 50)}...
        </p>

        <div className="flex gap-2 items-center">
          <p className="text-sm">
            {item.rating}
          </p>

          <p className="text-yellow-500 text-sm">
            {"★".repeat(Math.floor(item.rating || 0))}
            {"☆".repeat(5 - Math.floor(item.rating || 0))}
          </p>

          <p className="text-sm text-gray-600">
            {item.ratingCount} ratings
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>

          </section>

{/* Hot new releases */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Hot new releases</h1>
          <div className="flex gap-2">
  {adhesiveBrasHotreleases.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 "
    >
      <img
        src={item.image?.[0]}
        alt={item.name}
        className="h-72 w-full object-cover mix-blend-darken"
      />

      <button
        className="bg-white relative py-2 -mt-18 px-4 rounded-full border border-black
        hover:opacity-100 opacity-0 cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Quick Look
      </button>

      <div className="bg-white mt-8 p-2">
        <p className="font-bold">₹{item.price}</p>

        <p className="line-through text-gray-500">
          ₹{item.mrp}
        </p>

        <p className="text-sm">
          {item.name.slice(0, 50)}...
        </p>

        <div className="flex gap-2 items-center">
          <p className="text-sm">
            {item.rating}
          </p>

          <p className="text-yellow-500 text-sm">
            {"★".repeat(Math.floor(item.rating || 0))}
            {"☆".repeat(5 - Math.floor(item.rating || 0))}
          </p>

          <p className="text-sm text-gray-600">
            {item.ratingCount} ratings
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>
          </section>

          {/* Top rated */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Top rated</h1>
 <div className="flex gap-2">
  {adhesiveBrasToprated.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 "
    >
      <img
        src={item.image?.[0]}
        alt={item.name}
        className="h-72 w-full object-cover mix-blend-darken"
      />

      <button
        className="bg-white relative py-2 -mt-18 px-4 rounded-full border border-black
        hover:opacity-100 opacity-0 cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Quick Look
      </button>

      <div className="bg-white mt-8 p-2">
        <p className="font-bold">₹{item.price}</p>

        <p className="line-through text-gray-500">
          ₹{item.mrp}
        </p>

        <p className="text-sm">
          {item.name.slice(0, 50)}...
        </p>

        <div className="flex gap-2 items-center">
          <p className="text-sm">
            {item.rating}
          </p>

          <p className="text-yellow-500 text-sm">
            {"★".repeat(Math.floor(item.rating || 0))}
            {"☆".repeat(5 - Math.floor(item.rating || 0))}
          </p>

          <p className="text-sm text-gray-600">
            {item.ratingCount} ratings
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>
          </section>

          {/* Brands related to this category */}
           <section>
            <h1 className='text-2xl font-bold mt-18'>Brands related to this category</h1>

          </section>

        {/* Best sellers  */}
           <section>
            <h1 className='text-2xl font-bold mt-18'>Best sellers </h1>
           <div className="flex gap-2">
  {adhesiveBrasBestsellers.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 "
    >
      <img
        src={item.image?.[0]}
        alt={item.name}
        className="h-72 w-full object-cover mix-blend-darken"
      />

      <button
        className="bg-white relative py-2 -mt-18 px-4 rounded-full border border-black
        hover:opacity-100 opacity-0 cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Quick Look
      </button>

      <div className="bg-white mt-8 p-2">
        <p className="font-bold">₹{item.price}</p>

        <p className="line-through text-gray-500">
          ₹{item.mrp}
        </p>

        <p className="text-sm">
          {item.name.slice(0, 50)}...
        </p>

        <div className="flex gap-2 items-center">
          <p className="text-sm">
            {item.rating}
          </p>

          <p className="text-yellow-500 text-sm">
            {"★".repeat(Math.floor(item.rating || 0))}
            {"☆".repeat(5 - Math.floor(item.rating || 0))}
          </p>

          <p className="text-sm text-gray-600">
            {item.ratingCount} ratings
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>
          </section>

         <div className="flex flex-col gap-2 bg-white p-4 mt-4 border border-gray-300 rounded-2xl">
                    <h1>1-11 of over 2,000 results for Adhesive Bras</h1>
                  </div>
        </div>
      </div>
    </div>
  )
}

export default AdhesiveBras