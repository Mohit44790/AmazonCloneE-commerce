import React, { useEffect, useMemo, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";

import { TiTick } from "react-icons/ti";

import { Link } from "react-router-dom";



import {

  adhesiveBrasBestsellers,

  adhesiveBrasHotreleases,

  adhesiveBrasRecommended,

  adhesiveBrasToprated,

} from "../../../../../../component/data/womenfashion";



const AdhesiveBras = () => {

  const [loading, setLoading] = useState(true);



  // =========================================================

  // FILTER STATES

  // =========================================================



  const [selectedBrands, setSelectedBrands] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);

  const [selectedSizes, setSelectedSizes] = useState([]);



  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");



  const [minRating, setMinRating] = useState("");



  const [selectedClosureTypes, setSelectedClosureTypes] = useState([]);

  const [selectedCareInstructions, setSelectedCareInstructions] =

    useState([]);

  const [selectedStrapTypes, setSelectedStrapTypes] = useState([]);

  const [selectedCountries, setSelectedCountries] = useState([]);

  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [selectedPatterns, setSelectedPatterns] = useState([]);

  const [selectedNeckStyles, setSelectedNeckStyles] = useState([]);

  const [selectedBraBandSizes, setSelectedBraBandSizes] = useState([]);

  const [selectedBraCupSizes, setSelectedBraCupSizes] = useState([]);

const [selectedProductCategory, setSelectedProductCategory] = useState("all");



  // =========================================================

  // LOADING

  // =========================================================



  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 1000);



    return () => clearTimeout(timer);

  }, []);



  // =========================================================

  // COMBINE ALL PRODUCTS

  // =========================================================
  const allProducts = useMemo(() => {
    // Keep every product from all four arrays.
    // Do not deduplicate by id because duplicate ids can exist in
    // different sections and must remain available to filters.
    return [
      ...adhesiveBrasBestsellers,
      ...adhesiveBrasHotreleases,
      ...adhesiveBrasRecommended,
      ...adhesiveBrasToprated,
    ];
  }, []);

  const productCategoryMap = useMemo(() => {
    const map = new Map();

    const addCategory = (products, category) => {
      products.forEach((item) => {
        const id = String(item.id);
        if (!map.has(id)) map.set(id, new Set());
        map.get(id).add(category);
      });
    };

    addCategory(adhesiveBrasBestsellers, "bestsellers");
    addCategory(adhesiveBrasHotreleases, "hotreleases");
    addCategory(adhesiveBrasRecommended, "recommended");
    addCategory(adhesiveBrasToprated, "toprated");

    return map;
  }, []);

  // =========================================================
  // FILTER OPTIONS

  // =========================================================



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

        allProducts.flatMap((item) => {

          const values = [];



          if (item.materialtype) {

            values.push(item.materialtype);

          }



          if (item.materialComposition) {

            values.push(item.materialComposition);

          }



          return values;

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



  // =========================================================

  // CHECKBOX HANDLER

  // =========================================================



  const handleCheckbox = (value, setter) => {

    setter((previous) =>

      previous.includes(value)

        ? previous.filter((item) => item !== value)

        : [...previous, value]

    );

  };



  // =========================================================

  // PRICE FILTER

  // =========================================================



  const handlePriceFilter = (min, max) => {

    setMinPrice(min);

    setMaxPrice(max);

  };



  // =========================================================

  // CLEAR FILTERS

  // =========================================================



  const clearAllFilters = () => {

    setSelectedBrands([]);

    setSelectedColors([]);

    setSelectedSizes([]);



    setMinPrice("");

    setMaxPrice("");

    setMinRating("");



    setSelectedClosureTypes([]);

    setSelectedCareInstructions([]);

    setSelectedStrapTypes([]);

    setSelectedCountries([]);

    setSelectedMaterials([]);

    setSelectedPatterns([]);

    setSelectedNeckStyles([]);

    setSelectedBraBandSizes([]);

    setSelectedBraCupSizes([]);

  };



  // =========================================================

  // CHECK IF ANY FILTER IS ACTIVE

  // =========================================================



  const hasActiveFilters =

    selectedBrands.length > 0 ||

    selectedColors.length > 0 ||

    selectedSizes.length > 0 ||

    minPrice !== "" ||

    maxPrice !== "" ||

    minRating !== "" ||

    selectedClosureTypes.length > 0 ||

    selectedCareInstructions.length > 0 ||

    selectedStrapTypes.length > 0 ||

    selectedCountries.length > 0 ||

    selectedMaterials.length > 0 ||

    selectedPatterns.length > 0 ||

    selectedNeckStyles.length > 0 ||

    selectedBraBandSizes.length > 0 ||

    selectedBraCupSizes.length > 0;



  // =========================================================

  // MAIN FILTER

  // =========================================================



  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedProductCategory !== "all") {
        const categories = productCategoryMap.get(String(product.id));
        if (!categories?.has(selectedProductCategory)) return false;
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

      if (selectedColors.length > 0) {
        const productColors = Array.isArray(product.colors) ? product.colors : [];
        if (!selectedColors.some((color) => productColors.includes(color))) return false;
      }

      if (selectedSizes.length > 0) {
        let productSizes = [];
        if (Array.isArray(product.sizes)) productSizes = product.sizes;
        else if (Array.isArray(product.size)) productSizes = product.size;
        else if (product.size) productSizes = [product.size];
        if (!selectedSizes.some((size) => productSizes.map(String).includes(String(size)))) return false;
      }

      const price = Number(product.price || 0);
      if (minPrice !== "" && price < Number(minPrice)) return false;
      if (maxPrice !== "" && price > Number(maxPrice)) return false;

      if (minRating !== "" && Number(product.rating || 0) < Number(minRating)) return false;

      if (selectedClosureTypes.length > 0 && !selectedClosureTypes.includes(product.closureType)) return false;
      if (selectedCareInstructions.length > 0 && !selectedCareInstructions.includes(product.careInstructions)) return false;
      if (selectedStrapTypes.length > 0 && !selectedStrapTypes.includes(product.straptype)) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(product.country)) return false;

      if (selectedMaterials.length > 0) {
        const productMaterials = [product.materialtype, product.materialComposition].filter(Boolean);
        if (!selectedMaterials.some((material) => productMaterials.includes(material))) return false;
      }

      if (selectedPatterns.length > 0 && !selectedPatterns.includes(product.pattern)) return false;
      if (selectedNeckStyles.length > 0 && !selectedNeckStyles.includes(product.neckStyle)) return false;

      if (selectedBraBandSizes.length > 0) {
        const values = Array.isArray(product.braBandSize)
          ? product.braBandSize
          : product.braBandSize ? [product.braBandSize] : [];
        if (!selectedBraBandSizes.some((size) => values.map(String).includes(String(size)))) return false;
      }

      if (selectedBraCupSizes.length > 0) {
        const values = Array.isArray(product.braCupSize)
          ? product.braCupSize
          : product.braCupSize ? [product.braCupSize] : [];
        if (!selectedBraCupSizes.some((size) => values.map(String).includes(String(size)))) return false;
      }

      return true;
    });
  }, [
    allProducts,
    selectedProductCategory,
    productCategoryMap,
    selectedBrands,
    selectedColors,
    selectedSizes,
    minPrice,
    maxPrice,
    minRating,
    selectedClosureTypes,
    selectedCareInstructions,
    selectedStrapTypes,
    selectedCountries,
    selectedMaterials,
    selectedPatterns,
    selectedNeckStyles,
    selectedBraBandSizes,
    selectedBraCupSizes,
  ]);

  // =========================================================
  // PRODUCT CARD

  // =========================================================



  const ProductCard = ({ item }) => {

    const rating = Math.floor(Number(item.rating || 0));



    return (

      <Link

        to={`/product/${item.id}`}

        className="flex bg-gray-200 flex-col gap-2 min-w-0"

      >

        <img

          src={item.image?.[0]}

          alt={item.name}

          className="h-72 w-full object-cover mix-blend-darken"

        />



        <button

          className="

            bg-white relative py-2 -mt-18 px-4

            rounded-full border lack

            hover:opacity-100 opacity-0

            cursor-pointer

          "

          onClick={(e) => e.preventDefault()}

        >

          Quick Look

        </button>



        <div className="bg-white mt-8 p-2">

          <p className="font-bold">

            ₹{item.price}

          </p>



          <p className="line-through text-gray-500">

            ₹{item.mrp}

          </p>



          <p className="text-sm">

            {item.name?.slice(0, 50)}...

          </p>



          <div className="flex gap-2 items-center">

            <p className="text-sm">

              {item.rating}

            </p>



            <p className="text-yellow-500 text-sm">

              {"★".repeat(rating)}

              {"☆".repeat(5 - rating)}

            </p>



            <p className="text-sm text-gray-600">

              {item.ratingCount} ratings

            </p>

          </div>

        </div>

      </Link>

    );

  };



  // =========================================================

  // SKELETON CARD

  // =========================================================



  const ProductSkeleton = () => (

    <div className="bg-gray-200 p-2 rounded animate-pulse">

      <div className="h-72 w-full bg-gray-300 rounded" />



      <div className="h-4 bg-gray-300 rounded mt-3 w-3/4" />



      <div className="h-4 bg-gray-300 rounded mt-2 w-1/2" />



      <div className="h-4 bg-gray-300 rounded mt-2 w-1/3" />



      <div className="h-4 bg-gray-300 rounded mt-2 w-2/3" />

    </div>

  );



  // =========================================================

  // RENDER

  // =========================================================



  return (

    <div>

      <div className="flex flex-col bg-white md:flex-row gap-2 p-2">



        {/* ===================================================

            LEFT FILTER SIDEBAR

        =================================================== */}



        <div className="w-64 flex flex-col gap-4">



          {/* CATEGORY */}



          <div className="flex flex-col gap-2">

            <h1 className="font-semibold text-sm">

              Category

            </h1>



            <Link

              to="/women/clothing"

              className="flex items-center text-sm"

            >

              <IoIosArrowBack />

              Clothing & Accessories

            </Link>



            <Link

              to="/women/clothing"

              className="flex items-center text-sm"

            >

              <IoIosArrowBack />

              Women

            </Link>



            <Link

              to="/women/lingerie"

              className="flex items-center text-sm"

            >

              <IoIosArrowBack />

              Lingerie

            </Link>



            <Link

              to="/women/lingerie/bras"

              className="flex items-center text-sm"

            >

              <IoIosArrowBack />

              Bras

            </Link>



            <h1 className="font-semibold text-sm px-4">

              Adhesive Bras

            </h1>

          </div>



          {/* AMAZON PRIME */}



          <div>

            <h2 className="font-semibold text-sm">

              Amazon Prime

            </h2>



            <label className="flex items-center cursor-pointer">

              <input

                type="checkbox"

                className="accent-orange-400"

              />



              <TiTick className="text-orange-400 text-lg" />



              <span className="text-blue-500 font-bold">

                prime

              </span>

            </label>

          </div>



          {/* DELIVERY DAY */}



          <div>

            <h2 className="font-semibold text-sm">

              Delivery Day

            </h2>



            <label className="flex items-center cursor-pointer">

              <input

                type="checkbox"

                className="accent-orange-400"

              />



              <span className="ml-1 text-sm">

                Get It by Tomorrow

              </span>

            </label>

          </div>



          {/* BRAND */}



          {brands.length > 0 && (

            <div className=" pb-4">

              <h3 className="font-bold mb-3">

                Brand

              </h3>



              {brands.map((brand) => (

                <label

                  key={brand}

                  className="

                    flex items-center gap-2

                    mb-2 text-sm cursor-pointer

                  "

                >

                  <input

                    type="checkbox"

                    checked={selectedBrands.includes(

                      brand

                    )}

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



          {/* PRICE */}



          <div className=" pb-4">

            <h1 className="font-semibold text-sm mb-2">

              Price

            </h1>



            <button

              onClick={() =>

                handlePriceFilter("", 300)

              }

              className="block text-sm hover:text-amber-500 mb-2"

            >

              Under ₹300

            </button>



            <button

              onClick={() =>

                handlePriceFilter(300, 500)

              }

              className="block text-sm hover:text-amber-500 mb-2"

            >

              ₹300 - ₹500

            </button>



            <button

              onClick={() =>

                handlePriceFilter(500, 1000)

              }

              className="block text-sm hover:text-amber-500 mb-2"

            >

              ₹500 - ₹1000

            </button>



            <button

              onClick={() =>

                handlePriceFilter(1000, 2000)

              }

              className="block text-sm hover:text-amber-500 mb-2"

            >

              ₹1000 - ₹2000

            </button>



            <button

              onClick={() =>

                handlePriceFilter(2000, "")

              }

              className="block text-sm hover:text-amber-500"

            >

              Over ₹2000

            </button>

          </div>



          {/* CUSTOMER REVIEW */}



          <div className=" pb-4">

            <h1 className="font-semibold text-sm mb-2">

              Customer Review

            </h1>



            {[4, 3, 2, 1].map((rating) => (

              <label

                key={rating}

                className="flex items-center gap-2 mb-2 cursor-pointer"

              >

                <input

                  type="radio"

                  name="rating"

                  checked={

                    minRating === String(rating)

                  }

                  onChange={() =>

                    setMinRating(String(rating))

                  }

                />



                <span className="text-sm hover:text-amber-500">

                  {rating} Stars & Up

                </span>

              </label>

            ))}



            {minRating !== "" && (

              <button

                onClick={() => setMinRating("")}

                className="text-xs text-blue-600"

              >

                Clear rating

              </button>

            )}

          </div>



          {/* DEALS */}



          <div className=" pb-4">

            <h1 className="font-semibold text-sm">

              Deals & Discounts

            </h1>



            <label className="flex gap-2 items-center">

              <input type="checkbox" />

              <span className="text-sm hover:text-amber-500">

                All Discounts

              </span>

            </label>



            <label className="flex gap-2 items-center">

              <input type="checkbox" />

              <span className="text-sm hover:text-amber-500">

                Buy More, Save More

              </span>

            </label>



            <label className="flex gap-2 items-center">

              <input type="checkbox" />

              <span className="text-sm hover:text-amber-500">

                Coupons

              </span>

            </label>



            <label className="flex gap-2 items-center">

              <input type="checkbox" />

              <span className="text-sm hover:text-amber-500">

                Today's Deals

              </span>

            </label>

          </div>



          {/* SIZE */}



          {sizes.length > 0 && (

            <div className=" pb-4">

              <h3 className="font-bold mb-3">

                Size

              </h3>



              {sizes.map((size) => (

                <label

                  key={size}

                  className="

                    flex items-center gap-2

                    mb-2 text-sm cursor-pointer

                  "

                >

                  <input

                    type="checkbox"

                    checked={selectedSizes.includes(

                      size

                    )}

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



          {/* CLOSURE TYPE */}



          {closureTypes.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Closure Type

              </h1>



              {closureTypes.map((type) => (

                <label

                  key={type}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedClosureTypes.includes(

                      type

                    )}

                    onChange={() =>

                      handleCheckbox(

                        type,

                        setSelectedClosureTypes

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {type}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* CARE INSTRUCTIONS */}



          {careInstructions.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Care Instructions

              </h1>



              {careInstructions.map((care) => (

                <label

                  key={care}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedCareInstructions.includes(

                      care

                    )}

                    onChange={() =>

                      handleCheckbox(

                        care,

                        setSelectedCareInstructions

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {care}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* BRA BRAND SIZE */}



          <div className=" pb-4">

            <h1 className="font-semibold text-sm mb-3">

              Bra Brand Size

            </h1>



            <div className="grid gap-2 grid-cols-4">

              {[

                "24",

                "26",

                "28",

                "30",

                "32",

                "34",

                "36",

                "38",

                "40",

                "42",

                "44",

                "46",

                "48",

                "50",

                "52",

                "54",

              ].map((size) => (

                <button

                  key={size}

                  onClick={() =>

                    handleCheckbox(

                      size,

                      setSelectedBraBandSizes

                    )

                  }

                  className={`

                    border p-1 rounded-lg text-sm cursor-pointer

                    ${

                      selectedBraBandSizes.includes(

                        size

                      )

                        ? "border-orange-500 bg-orange-50 text-orange-600"

                        : "border-gray-300"

                    }

                  `}

                >

                  {size}

                </button>

              ))}

            </div>

          </div>



          {/* BRA CUP SIZE */}



          {braCupSizes.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Bra Cup Size

              </h1>



              {braCupSizes.map((size) => (

                <label

                  key={size}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedBraCupSizes.includes(

                      size

                    )}

                    onChange={() =>

                      handleCheckbox(

                        size,

                        setSelectedBraCupSizes

                      )

                    }

                  />



                  <span className="text-sm">

                    {size}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* STRAP TYPE */}



          {strapTypes.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Strap Type

              </h1>



              {strapTypes.map((type) => (

                <label

                  key={type}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedStrapTypes.includes(

                      type

                    )}

                    onChange={() =>

                      handleCheckbox(

                        type,

                        setSelectedStrapTypes

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {type}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* COUNTRY */}



          {countries.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Country of Origin

              </h1>



              {countries.map((country) => (

                <label

                  key={country}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedCountries.includes(

                      country

                    )}

                    onChange={() =>

                      handleCheckbox(

                        country,

                        setSelectedCountries

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {country}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* MATERIAL */}



          {materials.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Material

              </h1>



              {materials.map((material) => (

                <label

                  key={material}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedMaterials.includes(

                      material

                    )}

                    onChange={() =>

                      handleCheckbox(

                        material,

                        setSelectedMaterials

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {material}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* COLOUR */}



          {colors.length > 0 && (

  <div className="pb-4">

    <h3 className="font-bold mb-3">

      Colour

    </h3>



    <div className="grid grid-cols-5 gap-2">

      {colors.map((color) => {

        const colorMap = {

          Black: "#000000",

          White: "#ffffff",

          Red: "#dc2626",

          Blue: "#2563eb",

          Green: "#16a34a",

          Yellow: "#fde047",

          Orange: "#fb923c",

          Pink: "#f9a8d4",

          Purple: "#9333ea",

          Brown: "#78350f",

          Grey: "#808080",

          Gray: "#808080",

          Beige: "#e5d18a",

          Maroon: "#991b1b",

          Navy: "#172554",

          Cream: "#fff7d6",

        };



        const bgColor =

          colorMap[color] || color.toLowerCase();



        const isSelected =

          selectedColors.includes(color);



        return (

          <button

            key={color}

            type="button"

            title={color}

            onClick={() =>

              handleCheckbox(

                color,

                setSelectedColors

              )

            }

            className={`

              h-7 w-7

              border

              transition

              cursor-pointer

              ${

                isSelected

                  ? "border-black ring-2 ring-black ring-offset-1"

                  : "border-gray-300"

              }

            `}

            style={{

              backgroundColor: bgColor,

            }}

          />

        );

      })}

    </div>

  </div>

)}



          {/* PATTERN */}



          {patterns.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Pattern

              </h1>



              {patterns.map((pattern) => (

                <label

                  key={pattern}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedPatterns.includes(

                      pattern

                    )}

                    onChange={() =>

                      handleCheckbox(

                        pattern,

                        setSelectedPatterns

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {pattern}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* NECK STYLE */}



          {neckStyles.length > 0 && (

            <div className=" pb-4">

              <h1 className="font-semibold text-sm mb-2">

                Neck Style

              </h1>



              {neckStyles.map((style) => (

                <label

                  key={style}

                  className="flex gap-2 items-center mb-2 cursor-pointer"

                >

                  <input

                    type="checkbox"

                    checked={selectedNeckStyles.includes(

                      style

                    )}

                    onChange={() =>

                      handleCheckbox(

                        style,

                        setSelectedNeckStyles

                      )

                    }

                  />



                  <span className="text-sm hover:text-amber-500">

                    {style}

                  </span>

                </label>

              ))}

            </div>

          )}



          {/* CLEAR FILTERS */}



          {hasActiveFilters && (

            <button

              onClick={clearAllFilters}

              className="

                bg-orange-500 text-white

                rounded-lg py-2 px-3

                text-sm font-semibold

                hover:bg-orange-600

              "

            >

              Clear All Filters

            </button>

          )}

        </div>



        {/* ===================================================

            RIGHT CONTENT

        =================================================== */}



        <div className="flex-1 min-w-0 w-full">



          <h1 className="font-semibold text-4xl">

            Women's Adhesive Bras

          </h1>



          {/* =================================================

              FILTERED RESULTS

          ================================================= */}



          {hasActiveFilters ? (

            <section>

              <div className="flex items-center justify-between mt-6 mb-4">

                <h1 className="text-2xl font-bold">

                  Filtered Results

                </h1>



                <p className="text-sm text-gray-600">

                  {filteredProducts.length} results

                </p>

              </div>



              {loading ? (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                  {[1, 2, 3, 4, 5, 6, 7, 8].map(

                    (item) => (

                      <ProductSkeleton key={item} />

                    )

                  )}

                </div>

              ) : filteredProducts.length > 0 ? (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                  {filteredProducts.map((item) => (

                    <ProductCard

                      key={item.id}

                      item={item}

                    />

                  ))}

                </div>

              ) : (

                <div className="border border-gray-300 rounded-xl p-10 text-center">

                  <h2 className="font-semibold text-lg">

                    No products found

                  </h2>



                  <p className="text-gray-500 text-sm mt-2">

                    Try changing or clearing your filters.

                  </p>



                  <button

                    onClick={clearAllFilters}

                    className="

                      mt-4 bg-orange-500

                      text-white px-5 py-2

                      rounded-lg

                    "

                  >

                    Clear Filters

                  </button>

                </div>

              )}

            </section>

          ) : (

            <>

              {/* =============================================

                  FEATURE CATEGORIES

              ============================================= */}



              <section>

                <h1 className="text-2xl font-bold mt-6">

                  Feature Categories

                </h1>



                <div className="flex text-center justify-between gap-3">



                  <a

                    href="/women/sport"

                    className="

                      h-48 w-48 rounded-full

                      bg-gray-100 p-8

                    "

                  >

                    <img

                      src="https://m.media-amazon.com/images/I/31-2cmNibBL.\_AC.\_SR240,240.jpg"

                      alt="Women"

                      className="mix-blend-darken"

                    />



                    <p>Women</p>

                  </a>



                  <a

                    href="/women/lingerie"

                    className="

                      h-48 w-48 rounded-full

                      bg-gray-100 p-8

                    "

                  >

                    <img

                      src="https://m.media-amazon.com/images/I/41u4ukX+y0L.\_AC.\_SR240,240.jpg"

                      alt="Lingerie"

                      className="mix-blend-darken"

                    />



                    <p>Lingerie</p>

                  </a>



                  <a

                    href="/women/lingerie/bras"

                    className="

                      h-48 w-48 rounded-full

                      bg-gray-100 p-8

                    "

                  >

                    <img

                      src="https://m.media-amazon.com/images/I/410b1UuLwVL.\_AC.\_SR240,240.jpg"

                      alt="Bras"

                      className="mix-blend-darken"

                    />



                    <p>Bras</p>

                  </a>



                  <a

                    href="/women/lingerie/bras/adhesive"

                    className="

                      h-48 w-48 rounded-full

                      bg-gray-100 p-8

                    "

                  >

                    <img

                      src="https://m.media-amazon.com/images/I/41hUqCKY3aL.\_AC.\_SR240,240.jpg"

                      alt="Adhesive"

                      className="mix-blend-darken"

                    />



                    <p>Adhesive</p>

                  </a>

                </div>

              </section>



              {/* =============================================

                  RECOMMENDED

              ============================================= */}



              <section>

                <h1 className="text-2xl font-bold mt-18">

                  Recommended for you

                </h1>



                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">

                  {adhesiveBrasRecommended.map(

                    (item) => (

                      <ProductCard

                        key={item.id}

                        item={item}

                      />

                    )

                  )}

                </div>

              </section>



              {/* =============================================

                  HOT NEW RELEASES

              ============================================= */}



              <section>

                <h1 className="text-2xl font-bold mt-18">

                  Hot new releases

                </h1>



                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">

                  {adhesiveBrasHotreleases.map(

                    (item) => (

                      <ProductCard

                        key={item.id}

                        item={item}

                      />

                    )

                  )}

                </div>

              </section>



              {/* =============================================

                  TOP RATED

              ============================================= */}



              <section>

                <h1 className="text-2xl font-bold mt-18">

                  Top rated

                </h1>



                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">

                  {adhesiveBrasToprated.map(

                    (item) => (

                      <ProductCard

                        key={item.id}

                        item={item}

                      />

                    )

                  )}

                </div>

              </section>



              {/* =============================================

                  BRANDS

              ============================================= */}



              <section>

                <h1 className="text-2xl font-bold mt-18">

                  Brands related to this category

                </h1>



                <div className="flex gap-3 mt-4 flex-wrap">

                  {brands.map((brand) => (

                    <button

                      key={brand}

                      onClick={() =>

                        handleCheckbox(

                          brand,

                          setSelectedBrands

                        )

                      }

                      className="

                        border border-gray-300

                        rounded-lg px-5 py-3

                        hover:border-orange-500

                        hover:text-orange-500

                      "

                    >

                      {brand}

                    </button>

                  ))}

                </div>

              </section>



              {/* =============================================

                  BEST SELLERS

              ============================================= */}



              <section>

                <h1 className="text-2xl font-bold mt-18">

                  Best sellers

                </h1>



                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">

                  {adhesiveBrasBestsellers.map(

                    (item) => (

                      <ProductCard

                        key={item.id}

                        item={item}

                      />

                    )

                  )}

                </div>

              </section>



              {/* =============================================

                  RESULT COUNT + ALL PRODUCTS (ek sath)

              ============================================= */}



         {/* =============================================

    RESULT COUNT + ALL 16 PRODUCTS (ek sath)

\============================================= */}



{(() => {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 mt-4 border border-gray-300 rounded-2xl">
      {loading ? (
        <div className="h-5 w-64 bg-gray-300 rounded animate-pulse" />
      ) : (
        <h1>
          {filteredProducts.length > 0
            ? `1-${filteredProducts.length} of ${filteredProducts.length} results for Adhesive Bras`
            : "0 results for Adhesive Bras"}
        </h1>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <ProductSkeleton key={item} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredProducts.map((item, index) => (
            <ProductCard
              key={`${item.id}-${item.brand || "product"}-${index}`}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div className="border border-gray-300 rounded-xl p-10 text-center">
          <h2 className="font-semibold text-lg">No products found</h2>
          <p className="text-gray-500 text-sm mt-2">Try changing or clearing your filters.</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
})()}
            </>

          )}

        </div>

      </div>

    </div>

  );

};



export default AdhesiveBras;