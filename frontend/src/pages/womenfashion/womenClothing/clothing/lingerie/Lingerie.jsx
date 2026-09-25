import React, { useEffect, useRef, useState } from "react";
import AmazonFashion from "../../../AmazonFashion.jsx";
import { lingerieCloths, lingerieCloths2, lingerieCollection } from "../../../../../component/data/Womenfashion.js";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const LingerieList = [
  { name: "Bras", link: "/women/lingerie/bras" },
  { name: "Panties", link: "/women/lingerie/panties" },
  { name: "Shapeware", link: "/women/lingerie/shapeware" },
  { name: "Camisoles & Tanks", link: "/women/lingerie/camisoles-tanks" },
  { name: "Lingerie Sets", link: "/women/lingerie/lilngerie-sets" },
  { name: "Accessories", link: "/women/lingerie/accessories" },
  { name: "Pantyhose & Stockings", link: "/women/lingerie/pantyhose" },
  { name: "Thermals", link: "/women/lingerie/thermals" },
  { name: "Bodysuits", link: "/women/lingerie/bodysuits" },
  { name: "Bustiers & Corsets", link: "/women/lingerie/bustiers" },
  { name: "Garters & Suspender", link: "/women/lingerie/garters-suspender" },
];

const Lingerie = () => {
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll Left
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // Scroll Right
  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white">
      <AmazonFashion />

      <div className="flex flex-col md:flex-row gap-2 p-2">
        {/* ================= SIDEBAR ================= */}
        <div className="w-full md:w-72 p-2 border-r-2 border-gray-200 shrink-0">
          {loading ? (
            <>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-5 w-44 bg-gray-200 rounded animate-pulse mb-3"
                />
              ))}

              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-4 ml-4" />

              {Array.from({ length: 11 }).map((_, index) => (
                <div
                  key={index}
                  className="h-3 w-28 bg-gray-200 rounded animate-pulse mb-3 ml-7"
                />
              ))}
            </>
          ) : (
            <>
              <h1>Category</h1>

              <Link to="/women/clothing-accessories" className="flex items-center">
                <IoIosArrowBack />
                <p>Clothing & Accessories</p>
              </Link>

              <Link to="/women/clothing" className="flex items-center">
                <IoIosArrowBack />
                <p>Women</p>
              </Link>

              <h1 className="px-4 font-semibold">Lingerie</h1>

              {LingerieList.map((item, id) => (
                <div key={id}>
                  <Link to={item.link}>
                    <p className="px-7 hover:text-blue-600 cursor-pointer">
                      {item.name}
                    </p>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ================= MAIN ================= */}
        <div className="w-full min-w-0">
          {/* ================= CAROUSEL ================= */}

          <div className="bg-gray-200 p-3 md:p-4">
            <div className="relative bg-white p-2">
              {/* LEFT BUTTON */}
              <button
                onClick={scrollLeft}
                disabled={loading}
                className="
                  absolute
                  left-1
                  top-1/2
                  -translate-y-1/2
                  z-10
                  bg-white
                  shadow-md
                  hover:bg-gray-100
                  py-8
                  p-4
                  flex
                  items-center
                  justify-center
                "
              >
                <IoIosArrowBack size={22} />
              </button>

              {/* ================= SLIDER ================= */}

              <div
                ref={sliderRef}
                className="
                  flex
                  gap-3
                  overflow-x-auto
                  scroll-smooth
                  snap-x
                  snap-mandatory
                  px-10
                  scrollbar-hide
                "
              >
                {loading
                  ? /* ================= SKELETON ================= */

                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="
                        flex-none
                        w-[150px]
                        sm:w-[180px]
                        md:w-[200px]
                        snap-start
                      "
                      >
                        {/* Image Skeleton */}
                        <div
                          className="
                          w-full
                          aspect-square
                          bg-gray-200
                          rounded
                          animate-pulse
                        "
                        />

                        {/* Text Skeleton */}
                        <div
                          className="
                          h-4
                          w-24
                          bg-gray-200
                          rounded
                          animate-pulse
                          mx-auto
                          mt-3
                        "
                        />
                      </div>
                    ))
                  : /* ================= REAL CARDS ================= */

                    lingerieCollection.map((item) => (
                      <div
                        key={item.id}
                        className="
                        flex-none
                       
                        snap-start
                        text-center
                      "
                      >
                        <Link to={item.link}>
                          <img
                            src={item.image}
                            alt={item.label}
                            loading="lazy"
                            className="
                            w-34
                            aspect-square
                            object-cover
                            rounded
                            hover:scale-[1.03]
                            transition-transform
                            duration-300
                          "
                          />
                        </Link>

                        <p className="mt-2 font-medium text-sm md:text-base">
                          {item.label}
                        </p>
                      </div>
                    ))}
              </div>

              {/* RIGHT BUTTON */}

              <button
                onClick={scrollRight}
                disabled={loading}
                className="
                  absolute
                  right-1
                  top-1/2
                  -translate-y-1/2
                  z-10
                  bg-white
                  shadow-md
                  hover:bg-gray-100
                  py-8
                  p-4
                  flex
                  items-center
                  justify-center
                "
              >
                <IoIosArrowForward size={22} />
              </button>
            </div>

         <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
  {lingerieCloths.map((item) => (
    <Link
      key={item.id}
      to={`/product/${item.id}`}
      className="group min-w-0"
    >
      {/* IMAGE CARD */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <div className=" gap-[2px] bg-gray-200 aspect-square object-contain">
         
              <img
                src={item.images?.[0]}
                alt="omae"
                loading="lazy"
                className="
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-105
                  transition-transform
                  duration-300
                "
              />
            </div>
        
        </div>

        {/* PRODUCT INFO */}
        <div className="p-2">

          <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">
            {item.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">

            <span className="font-bold">
              ₹{item.price}
            </span>

            <span className="text-xs text-gray-500 line-through">
              ₹{item.mrp}
            </span>

            <span className="text-xs text-green-600 font-semibold">
              {item.discount}% off
            </span>

          </div>

        </div>

     
    </Link>
  ))}
</div>

          </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
  {lingerieCloths2.map((item) => (
    <Link
      key={item.id}
      to={`/product/${item.id}`}
      className="group min-w-0"
    >
      {/* IMAGE CARD */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <div className=" gap-[2px] bg-gray-200 aspect-square object-contain">
         
              <img
                src={item.images?.[0]}
                alt="omae"
                loading="lazy"
                className="
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-105
                  transition-transform
                  duration-300
                "
              />
            </div>
        
        </div>

        {/* PRODUCT INFO */}
        <div className="p-2">

          <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">
            {item.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">

            <span className="font-bold">
              ₹{item.price}
            </span>

            <span className="text-xs text-gray-500 line-through">
              ₹{item.mrp}
            </span>

            <span className="text-xs text-green-600 font-semibold">
              {item.discount}% off
            </span>

          </div>

        </div>

     
    </Link>
  ))}
</div>
        </div>
      </div>
    </div>
  );
};

export default Lingerie;
