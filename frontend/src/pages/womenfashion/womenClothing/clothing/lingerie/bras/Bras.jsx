import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { bras } from '../../../../../../component/data/Womenfashion'

const Bras = () => {
  return (
     <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
           <Link to="/women/clothing" className="flex items-center  text-sm">
            <IoIosArrowBack /> Clothing & Accessories
           </Link>
           <Link to="/women/clothing" className="flex items-center  text-sm">
            <IoIosArrowBack /> Women
           </Link>
           <Link to="/women/clothing/lingerie" className="flex items-center  text-sm">
             <IoIosArrowBack /> Lingerie
           </Link>
           <h1 className="font-semibold text-sm px-4">Bras</h1>
             <div className="px-6x`">
                 <Link to="/women/lingerie/bras/adhesive" className="flex items-center  text-sm">
            Adhesive Bras
           </Link>
                 <Link to="/women/clothing/sports-wear/innerwear/sports-bras" className="flex items-center  text-sm">
            Sports Bras
           </Link>
                 <Link to="/women/lingerie/bras/mastectomy" className="flex items-center  text-sm">
            Mastectomy Bras
           </Link>
                 <Link to="/women/lingerie/bras/everyday" className="flex items-center  text-sm">
            Everyday Bras
           </Link>
             </div>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-xl">Results</h1>
          <p className="text-sm text-gray-600">
            Check each product page for other buying options. Price and other details may vary based on product size and colour.
          </p>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 bg-gray-100">

  {bras.map((item) => (
    <div
      key={item.id}
      className="
        w-full
        bg-white
        border
        border-gray-200
        overflow-hidden
        hover:shadow-md
        transition
        flex
        flex-col
      "
    >

      {/* ================= BADGE ================= */}

      {item.badge && (
        <div className="px-2 pt-1">
          <span className="
            inline-block
            bg-orange-700
            text-white
            text-xs
            font-semibold
            px-2
            py-1
            rounded
          ">
            {item.badge}
          </span>
        </div>
      )}

      {/* ================= PRODUCT IMAGE ================= */}

      <Link
        to={`/product/${item.id}`}
        className="
          block
          w-full
          h-[290px]
          bg-white
          overflow-hidden
        "
      >
        <img
          src={
            Array.isArray(item.images)
              ? item.images[0]
              : item.image
          }
          alt={item.name}
          className="
            w-full
            h-full
            object-contain
            hover:scale-105
            transition-transform
            duration-300
          "
          loading="lazy"
        />
      </Link>

      {/* ================= CARD CONTENT ================= */}

      <div className="px-2 pb-3">

        {/* COLORS */}

        {item.colors?.length > 0 && (
          <div className="flex gap-2 py-2">

            {item.colors.map((color, index) => (
              <span
                key={index}
                title={color.name}
                className="
                  w-5
                  h-5
                  rounded-full
                  border
                  border-gray-500
                  shadow-sm
                "
                style={{
                  backgroundColor:
                    color.hex || "#ddd",
                }}
              />
            ))}

          </div>
        )}

        {/* ================= TITLE ================= */}

        <Link to={`/product/${item.id}`}>

          <h2 className="
            text-[16px]
            leading-6
            text-gray-900
            hover:text-orange-700
            line-clamp-2
            min-h-[48px]
          ">
            {item.brand && (
              <span className="font-bold">
                {item.brand}{" "}
              </span>
            )}

            {item.name}
          </h2>

        </Link>

        {/* ================= RATING ================= */}

        <div className="flex items-center gap-1 mt-2">

          <span className="text-sm">
            {item.rating?.average || "4.0"}
          </span>

          <span className="text-orange-500 text-sm">
            ★★★★★
          </span>

          {item.rating?.count && (
            <span className="
              text-blue-600
              text-sm
            ">
              ({item.rating.count})
            </span>
          )}

        </div>

        {/* ================= BOUGHT ================= */}

        {item.boughtInPastMonth && (
          <p className="
            text-sm
            text-gray-600
            mt-1
          ">
            {item.boughtInPastMonth}+ bought in past month
          </p>
        )}

        {/* ================= PRICE ================= */}

        <div className="flex items-center gap-2 mt-2">

          <span className="
            text-2xl
            text-gray-900
          ">
            ₹{item.price}
          </span>

          {item.mrp && (
            <span className="
              text-sm
              text-gray-500
            ">
              M.R.P.:
              <span className="line-through ml-1">
                ₹{item.mrp}
              </span>
            </span>
          )}

          {item.discount && (
            <span className="
              text-sm
              text-gray-700
            ">
              ({item.discount}% off)
            </span>
          )}

        </div>

        {/* ================= COUPON ================= */}

        {item.coupon && (
          <div className="mt-2">

            <span className="
              bg-green-200
              text-green-900
              text-sm
              px-1
              py-1
            ">
              You pay ₹{item.couponPrice || item.price}
            </span>

            <span className="
              text-sm
              ml-1
            ">
              with coupon
            </span>

          </div>
        )}

        {/* ================= DELIVERY ================= */}

        {item.delivery && (
          <p className="
            text-sm
            mt-2
            text-gray-700
          ">
            <span className="font-semibold">
              FREE delivery
            </span>{" "}
            {item.delivery}
          </p>
        )}

        {/* ================= BUTTON ================= */}

        <button
          type="button"
          className="
            w-full
            mt-3
            bg-yellow-400
            hover:bg-yellow-500
            rounded-full
            py-2
            text-sm
            font-medium
          "
          onClick={(e) => {
            e.preventDefault();

            console.log(
              "Add to cart:",
              item.id
            );
          }}
        >
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