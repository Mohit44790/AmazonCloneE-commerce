
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import AmazonFashion from "../../../AmazonFashion.jsx";

import {
  lingerieCollection,
  lingerieCloths,
  lingerieCloths2,
} from "../../../../../component/data/Womenfashion.js";

import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";

/* =========================================================
   CATEGORY LIST
========================================================= */

const LingerieList = [
  {
    name: "Bras",
    link: "/women/lingerie/bras",
  },
  {
    name: "Panties",
    link: "/women/lingerie/panties",
  },
  {
    name: "Shapewear",
    link: "/women/lingerie/shapeware",
  },
  {
    name: "Camisoles & Tanks",
    link: "/women/lingerie/camisoles-tanks",
  },
  {
    name: "Lingerie Sets",
    link: "/women/lingerie/lingerie-sets",
  },
  {
    name: "Accessories",
    link: "/women/lingerie/accessories",
  },
  {
    name: "Pantyhose & Stockings",
    link: "/women/lingerie/pantyhose",
  },
  {
    name: "Thermals",
    link: "/women/lingerie/thermals",
  },
  {
    name: "Bodysuits",
    link: "/women/lingerie/bodysuits",
  },
  {
    name: "Bustiers & Corsets",
    link: "/women/lingerie/bustiers",
  },
  {
    name: "Garters & Suspender",
    link: "/women/lingerie/garters-suspender",
  },
];

/* =========================================================
   SKELETON
========================================================= */

const CollectionSkeleton = () => {
  return (
    <div className="flex gap-4 overflow-hidden px-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-36 shrink-0 animate-pulse"
        >
          <div className="w-36 h-36 bg-gray-200 rounded" />

          <div className="h-4 w-24 bg-gray-200 rounded mt-3 mx-auto" />
        </div>
      ))}
    </div>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="flex gap-4 overflow-hidden px-12">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="w-52 shrink-0 animate-pulse"
        >
          <div className="w-52 h-72 bg-gray-200 rounded" />

          <div className="h-4 w-40 bg-gray-200 rounded mt-3" />

          <div className="h-4 w-24 bg-gray-200 rounded mt-2" />

          <div className="h-4 w-20 bg-gray-200 rounded mt-2" />
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   REUSABLE SCROLL SECTION
========================================================= */

const HorizontalScroll = ({
  children,
  loading = false,
  type = "collection",
}) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -500,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">

      {/* LEFT BUTTON */}

      <button
        type="button"
        onClick={scrollLeft}
        disabled={loading}
        className="
          absolute
          left-1
          top-1/2
          -translate-y-1/2
          z-20
          w-10
          h-20
          bg-white
          shadow-md
          rounded-r-lg
          flex
          items-center
          justify-center
          hover:bg-gray-100
          disabled:opacity-40
          transition
        "
      >
        <IoIosArrowBack size={24} />
      </button>

      {/* =====================================================
          SCROLL CONTAINER

          IMPORTANT:
          Every HorizontalScroll creates its OWN ref.
          Therefore every section scrolls independently.
      ===================================================== */}

      <div
        ref={sliderRef}
        className="
          flex
          gap-4
          overflow-x-auto
          scroll-smooth
          px-12
          py-2
          scrollbar-hide
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >

        {loading ? (
          type === "collection" ? (
            <CollectionSkeleton />
          ) : (
            <ProductSkeleton />
          )
        ) : (
          children
        )}

      </div>

      {/* RIGHT BUTTON */}

      <button
        type="button"
        onClick={scrollRight}
        disabled={loading}
        className="
          absolute
          right-1
          top-1/2
          -translate-y-1/2
          z-20
          w-10
          h-20
          bg-white
          shadow-md
          rounded-l-lg
          flex
          items-center
          justify-center
          hover:bg-gray-100
          disabled:opacity-40
          transition
        "
      >
        <IoIosArrowForward size={24} />
      </button>

    </div>
  );
};

/* =========================================================
   IMAGE HELPER
========================================================= */

const getProductImage = (product) => {

  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return product.images[0];
  }

  if (Array.isArray(product.image)) {
    return product.image[0];
  }

  if (product.image) {
    return product.image;
  }

  return "/placeholder.png";
};

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({ item }) => {

  const image = getProductImage(item);

  const discount =
    item.discount ??
    (
      item.mrp && item.price
        ? Math.round(
            ((item.mrp - item.price) / item.mrp) * 100
          )
        : 0
    );

  return (
    <Link
      to={`/product/${item.id}`}
      className="
        w-52
        shrink-0
        block
        bg-white
        rounded-lg
        overflow-hidden
        border
        border-gray-200
        hover:shadow-lg
        transition
        duration-300
      "
    >

      {/* IMAGE */}

      <div className="
        w-full
        h-72
        bg-gray-100
        overflow-hidden
      ">

        <img
          src={image}
          alt={item.name}
          loading="lazy"
          className="
            w-full
            h-full
            object-cover
            hover:scale-105
            transition
            duration-300
          "
          onError={(e) => {
            e.currentTarget.src =
              "/placeholder.png";
          }}
        />

      </div>

      {/* DETAILS */}

      <div className="p-3">

        <h3 className="
          font-semibold
          text-sm
          text-gray-800
          line-clamp-2
          min-h-[40px]
        ">
          {item.name}
        </h3>

        {/* PRICE */}

        <div className="
          flex
          items-center
          gap-2
          mt-2
          flex-wrap
        ">

          <span className="
            text-base
            font-bold
            text-gray-900
          ">
            ₹{item.price}
          </span>

          {item.mrp && (
            <span className="
              text-sm
              text-gray-500
              line-through
            ">
              ₹{item.mrp}
            </span>
          )}

          {discount > 0 && (
            <span className="
              text-xs
              text-green-600
              font-semibold
            ">
              {discount}% off
            </span>
          )}

        </div>

      </div>

    </Link>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Lingerie = () => {

  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOADING
  ===================================================== */

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);

  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* =================================================
          AMAZON HEADER
      ================================================= */}

      <AmazonFashion />

      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="
        flex
        flex-col
        md:flex-row
        gap-2
        p-2
      ">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="
          w-full
          md:w-72
          shrink-0
          p-3
          border-r-2
          border-gray-200
        ">

          {loading ? (

            <div className="animate-pulse">

              <div className="
                h-5
                w-24
                bg-gray-200
                rounded
                mb-5
              " />

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="
                    h-5
                    w-48
                    bg-gray-200
                    rounded
                    mb-4
                  "
                />
              ))}

              <div className="
                h-5
                w-28
                bg-gray-200
                rounded
                ml-4
                mb-4
              " />

              {Array.from({
                length: 11,
              }).map((_, index) => (

                <div
                  key={index}
                  className="
                    h-4
                    w-36
                    bg-gray-200
                    rounded
                    ml-7
                    mb-3
                  "
                />

              ))}

            </div>

          ) : (

            <>
              <h1 className="
                font-semibold
                mb-3
              ">
                Category
              </h1>

              <Link
                to="/women/clothing-accessories"
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  hover:text-blue-600
                "
              >
                <IoIosArrowBack />

                <span>
                  Clothing & Accessories
                </span>
              </Link>

              <Link
                to="/women/clothing"
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  mt-2
                  hover:text-blue-600
                "
              >
                <IoIosArrowBack />

                <span>
                  Women
                </span>
              </Link>

              <h2 className="
                px-4
                font-semibold
                mt-4
                mb-2
              ">
                Lingerie
              </h2>

              {LingerieList.map(
                (item) => (

                  <Link
                    key={item.name}
                    to={item.link}
                    className="
                      block
                      px-7
                      py-1
                      text-sm
                      hover:text-blue-600
                    "
                  >
                    {item.name}
                  </Link>

                )
              )}

            </>

          )}

        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="
          flex-1
          min-w-0
        ">

          {/* =================================================
              SECTION 1
              LINGERIE COLLECTION
          ================================================= */}

          <section className="
            bg-gray-200
            p-3
            md:p-4
            rounded
          ">

            <div className="
              bg-white
              p-2
              rounded
            ">

              <h2 className="
                text-lg
                font-bold
                px-3
                mb-2
              ">
                Lingerie Collection
              </h2>

              <HorizontalScroll
                loading={loading}
                type="collection"
              >

                {!loading &&
                  lingerieCollection?.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="
                          w-36
                          shrink-0
                          text-center
                        "
                      >

                        <Link
                          to={item.link}
                          className="block"
                        >

                          <img
                            src={item.image}
                            alt={item.label}
                            loading="lazy"
                            className="
                              w-36
                              h-36
                              object-cover
                              rounded
                              hover:scale-105
                              transition
                              duration-300
                            "
                          />

                        </Link>

                        <p className="
                          mt-2
                          font-medium
                          text-sm
                          line-clamp-2
                        ">
                          {item.label}
                        </p>

                      </div>

                    )
                  )}

              </HorizontalScroll>

            </div>

          </section>

          {/* =================================================
              SECTION 2
              LINGERIE PRODUCTS

              THIS HAS ITS OWN SCROLL.
          ================================================= */}

          <section className="
            mt-5
            bg-gray-100
            p-3
            md:p-4
            rounded
          ">

            <div className="
              bg-white
              p-2
              rounded
            ">

              <div className="
                flex
                items-center
                justify-between
                px-3
                mb-2
              ">

                <h2 className="
                  text-lg
                  font-bold
                ">
                  Lingerie Products
                </h2>

                <Link
                  to="/women/lingerie"
                  className="
                    text-blue-600
                    text-sm
                    hover:underline
                  "
                >
                  See all
                </Link>

              </div>

              <HorizontalScroll
                loading={loading}
                type="product"
              >

                {!loading &&
                  lingerieCloths?.map(
                    (item) => (

                      <ProductCard
                        key={item.id}
                        item={item}
                      />

                    )
                  )}

              </HorizontalScroll>

            </div>

          </section>

          {/* =================================================
              SECTION 3
              ANOTHER INDEPENDENT SCROLL
          ================================================= */}

          <section className="
            mt-5
            bg-gray-100
            p-3
            md:p-4
            rounded
          ">

            <div className="
              bg-white
              p-2
              rounded
            ">

              <h2 className="
                text-lg
                font-bold
                px-3
                mb-2
              ">
                Trending Lingerie
              </h2>

              <HorizontalScroll
                loading={loading}
                type="product"
              >

                {!loading &&
                  lingerieCloths2?.map(
                    (item) => (

                      <ProductCard
                        key={`trending-${item.id}`}
                        item={item}
                      />

                    )
                  )}

              </HorizontalScroll>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
};

export default Lingerie;

