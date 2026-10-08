import React, { useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

import {
  lingeriesTopRated,
  lingeriesBestSellers,
  lingeriesRecommended,
  lingeriesHotNewReleases,
} from "../../../../../component/data/womenfashion.js";

const lingerFeaturedCategories = [
  {
    name: "Women",
    image:
      "https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg",
    path: "/women/clothing",
  },
  {
    name: "Lingerie",
    image:
      "https://m.media-amazon.com/images/I/410fdLYfsZL._AC._SR240,240.jpg",
    path: "/women/lingerie",
  },
  {
    name: "Lingerie Sets",
    image:
      "https://m.media-amazon.com/images/I/41H4uAgaaiL._AC._SR240,240.jpg",
    path: "/women/lingerie/lingerie-sets",
  },
];

const LingerieSets = () => {
  const [filters, setFilters] = useState({});

  // =====================================================
  // BOTH DATASETS COMBINED
  // =====================================================

  const categoryProducts = useMemo(() => {
    return [
      ...lingeriesTopRated,
      ...lingeriesBestSellers,
      ...lingeriesRecommended,
      ...lingeriesHotNewReleases,
    ];
  }, []);

  // =====================================================
  // FILTER TOGGLE
  // =====================================================

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];

      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // =====================================================
  // FILTER KEYS
  // These match your actual JSON fields
  // =====================================================

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

  // =====================================================
  // GET VALUE FROM PRODUCT
  // Handles string + array automatically
  // =====================================================

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

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

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

  // =====================================================
  // CREATE FILTER OPTIONS
  // =====================================================

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

  // =====================================================
  // CLEAR FILTER
  // =====================================================

  const clearFilters = () => {
    setFilters({});
  };


  const renderProductCard = (item) =>(
   <div key={item.id} className="rounded shadow-sm group relative bg-white">
<div className="bg-gray-100 relative">
  <img src={item.image?.[0]} alt={item.brand} className="w-full h-72 cursor-pointer object-contain rounded mix-blend-darken"/>
  <button className="absolute inset-0 top-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
     <span className="px-16 py-2 border bg-white text-black rounded-full text-sm">
            Quick Look
          </span>
  </button>
</div>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col bg-white md:flex-row gap-2 p-2">

        {/* =================================================
            LEFT SIDEBAR
        ================================================== */}

        <aside className="w-64 flex flex-col gap-2">

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

          <h1 className="font-semibold text-sm px-4">
            Lingerie Sets
          </h1>

          {/* =================================================
              FILTERS
          ================================================== */}

          {dynamicFilterKeys.map((key) => {
            const options = getFilterOptions(key);

            if (options.length === 0) {
              return null;
            }

            return (
              <div
                key={key}
                className="mt-4 border-b border-gray-200 pb-3"
              >
                <h2 className="font-semibold text-sm capitalize">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </h2>

                <div className="mt-2 max-h-48 overflow-y-auto">

                  {options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center cursor-pointer mt-1"
                    >
                      <input
                        type="checkbox"
                        className="accent-orange-400 mr-2"
                        checked={
                          filters[key]?.includes(option) || false
                        }
                        onChange={() =>
                          toggleFilter(key, option)
                        }
                      />

                      <span className="text-sm">
                        {option}
                      </span>
                    </label>
                  ))}

                </div>
              </div>
            );
          })}

          {/* CLEAR FILTER */}

          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-blue-600 text-left font-semibold"
            >
              Clear All Filters
            </button>
          )}

        </aside>

        {/* =================================================
            MAIN
        ================================================== */}

        <main className="flex-1 min-w-0 w-full">

          <h1 className="font-semibold text-4xl px-4">
            Featured categories
          </h1>

          {/* =================================================
              FEATURED CATEGORIES
          ================================================== */}

          <div className="flex flex-wrap gap-4 p-4">
            {lingerFeaturedCategories.map((item, index) => (
              <div key={index}>

                <Link
                  to={item.path}
                  className="flex items-center bg-gray-100 w-48 h-48 rounded-full gap-2 p-8"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover mix-blend-darken"
                  />
                </Link>

                <h1 className="font-semibold text-center text-lg px-4">
                  {item.name}
                </h1>

              </div>
            ))}
          </div>


<section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lingeriesRecommended.map(renderProductCard)}
            </div>
          </section>

    <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Hot new releases</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lingeriesHotNewReleases.map(renderProductCard)}
            </div>
          </section>

          

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Top rated</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lingeriesTopRated.map(renderProductCard)}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Best sellers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lingeriesBestSellers.map(renderProductCard)}
            </div>
          </section>



          {/* =================================================
              RESULT COUNT
          ================================================== */}

          <div className="px-4 mt-4">
            <h2 className="font-semibold text-lg">
              {filteredProducts.length} results for Lingerie Sets
            </h2>
          </div>

          {/* =================================================
              PRODUCTS
          ================================================== */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">

            {filteredProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-gray-100 p-2"
              >

                <img
                  src={
                    Array.isArray(item.image)
                      ? item.image[0]
                      : item.image
                  }
                  alt={item.name}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />

                <div className="bg-white p-2">

                  <p className="font-bold">
                    ₹{item.price}
                  </p>

                  <div className="flex gap-2 text-sm">

                    <p className="line-through text-gray-500">
                      ₹{item.mrp}
                    </p>

                    <p className="text-green-600">
                      {item.discount}% off
                    </p>

                  </div>

                  <p className="text-sm mt-1">
                    {item.name?.slice(0, 50)}
                    {item.name?.length > 50 ? "..." : ""}
                  </p>

                  <div className="flex gap-2 text-sm mt-1">

                    <span>
                      {item.rating} ⭐
                    </span>

                    <span className="text-gray-500">
                      ({item.ratingCount})
                    </span>

                  </div>

                </div>

              </Link>
            ))}

          </div>

          {/* =================================================
              NO RESULT
          ================================================== */}

          {filteredProducts.length === 0 && (
            <div className="p-10 text-center">
              <h2 className="font-semibold text-lg">
                No products found
              </h2>

              <button
                onClick={clearFilters}
                className="mt-3 text-blue-600"
              >
                Clear Filters
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default LingerieSets;