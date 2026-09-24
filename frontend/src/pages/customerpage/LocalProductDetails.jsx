import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MdAdd,
  MdRemove,
  MdFavoriteBorder,
  MdShare,
  MdLocalShipping,
  MdSecurity,
  MdReplay,
  MdStar,
  MdStarBorder,
} from "react-icons/md";

import { getLocalProductById } from "../../component/data/products.js";

const LocalProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const localProduct = getLocalProductById(id);

      setProduct(localProduct);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-4 md:p-6 animate-pulse">

          <div className="h-4 w-48 bg-gray-200 rounded mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="space-y-3">
              <div className="aspect-square bg-gray-200 rounded" />

              <div className="flex gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-16 h-16 bg-gray-200 rounded"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">

              <div className="h-5 w-24 bg-gray-200 rounded" />

              <div className="h-7 w-full bg-gray-200 rounded" />

              <div className="h-7 w-4/5 bg-gray-200 rounded" />

              <div className="h-5 w-40 bg-gray-200 rounded" />

              <div className="h-10 w-44 bg-gray-200 rounded" />

              <div className="h-20 w-full bg-gray-200 rounded" />

            </div>

            <div className="border rounded-xl p-5 space-y-4">

              <div className="h-8 bg-gray-200 rounded" />

              <div className="h-10 bg-gray-200 rounded" />

              <div className="h-10 bg-gray-200 rounded" />

              <div className="h-12 bg-gray-200 rounded-full" />

              <div className="h-12 bg-gray-200 rounded-full" />

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-6xl mb-4">
            🛍️
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            This local product does not exist.
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Product ID: {id}
          </p>

          <Link
            to="/products"
            className="inline-block mt-5 bg-[#FFD814] hover:bg-[#F7CA00] px-6 py-3 rounded-full font-semibold"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // PRODUCT DATA
  // =====================================================

  const images =
    product.images?.length > 0
      ? product.images
      : product.image
      ? [{ url: product.image }]
      : [];

  const currentImage =
    images[activeImage]?.url || product.image;

  const price = Number(product.price || 0);

  const mrp = Number(product.mrp || price);

  const discount =
    product.discount ||
    (mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0);

  const stock = Number(product.stock ?? 10);

  const sizes = product.sizes || [];

  const rating = Number(
    product.rating?.average || product.rating || 0
  );

  // =====================================================
  // QUANTITY
  // =====================================================

  const increaseQty = () => {
    setQuantity((old) =>
      Math.min(stock || 10, old + 1)
    );
  };

  const decreaseQty = () => {
    setQuantity((old) =>
      Math.max(1, old - 1)
    );
  };

  // =====================================================
  // ADD CART
  // =====================================================

  const handleAddToCart = () => {
    console.log("Local product added:", {
      product,
      quantity,
      size: selectedSize,
    });

    alert("Product added to cart");
  };

  // =====================================================
  // RATING
  // =====================================================

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= Math.round(rating) ? (
            <MdStar
              key={star}
              size={18}
              className="text-[#FF9900]"
            />
          ) : (
            <MdStarBorder
              key={star}
              size={18}
              className="text-gray-300"
            />
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="text-xs text-gray-500 mb-5 flex gap-2 flex-wrap">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <span>/</span>

          <span>
            Products
          </span>

          <span>/</span>

          <span className="text-gray-700">
            {product.name}
          </span>

        </div>

        {/* =================================================
            PRODUCT
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* =================================================
              IMAGE SECTION
          ================================================= */}

          <div>

            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 aspect-square">

              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.currentTarget.src =
                    "/placeholder.png";
                }}
              />

            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">

                {images.map((image, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      setActiveImage(index)
                    }
                    className={`w-16 h-16 shrink-0 border-2 rounded-lg overflow-hidden ${
                      activeImage === index
                        ? "border-[#FF9900]"
                        : "border-gray-200"
                    }`}
                  >

                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                  </button>

                ))}

              </div>
            )}

            {/* ACTIONS */}

            <div className="flex gap-5 mt-4">

              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500">
                <MdFavoriteBorder size={20} />
                Wishlist
              </button>

              <button className="flex items-center gap-1 text-sm text-gray-600">
                <MdShare size={20} />
                Share
              </button>

            </div>

          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div>

            {/* BRAND */}

            {product.brand && (
              <p className="text-blue-600 text-sm mb-1">
                {product.brand}
              </p>
            )}

            {/* NAME */}

            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="flex items-center gap-2 mt-3">

              {renderStars()}

              <span className="text-blue-600 text-sm">
                {product.rating?.count || 0} ratings
              </span>

            </div>

            <hr className="my-4" />

            {/* DISCOUNT */}

            {discount > 0 && (
              <p className="text-red-500 font-semibold text-sm">
                -{discount}% off
              </p>
            )}

            {/* PRICE */}

            <div className="flex items-center gap-3 mt-1">

              <span className="text-3xl font-bold">
                ₹{price.toLocaleString()}
              </span>

              {mrp > price && (
                <span className="text-gray-500 line-through">
                  ₹{mrp.toLocaleString()}
                </span>
              )}

            </div>

            <p className="text-xs text-gray-500 mt-1">
              Inclusive of all taxes
            </p>

            {/* SIZE */}

            {sizes.length > 0 && (

              <div className="mt-6">

                <p className="font-semibold text-sm mb-2">
                  Size:
                  <span className="font-normal ml-2">
                    {selectedSize}
                  </span>
                </p>

                <div className="flex gap-2 flex-wrap">

                  {sizes.map((size) => (

                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`px-5 py-2 border rounded-lg text-sm font-semibold ${
                        selectedSize === size
                          ? "border-[#FF9900] bg-orange-50"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>

                  ))}

                </div>

              </div>
            )}

            {/* HIGHLIGHTS */}

            {product.highlights?.length > 0 && (

              <div className="mt-6">

                <h2 className="font-bold mb-2">
                  About this item
                </h2>

                <ul className="space-y-2">

                  {product.highlights.map(
                    (item, index) => (

                      <li
                        key={index}
                        className="text-sm text-gray-700 flex gap-2"
                      >
                        <span>•</span>
                        <span>{item}</span>
                      </li>

                    )
                  )}

                </ul>

              </div>
            )}

            {/* DESCRIPTION */}

            <div className="mt-6">

              <h2 className="font-bold mb-2">
                Description
              </h2>

              <p className="text-sm text-gray-600 leading-6">
                {product.description ||
                  `${product.name} is available at an attractive price.`}
              </p>

            </div>

          </div>

          {/* =================================================
              BUY BOX
          ================================================= */}

          <div>

            <div className="border border-gray-300 rounded-xl p-5">

              {/* PRICE */}

              <p className="text-2xl font-bold">
                ₹{price.toLocaleString()}
              </p>

              {/* DELIVERY */}

              <div className="mt-4 text-sm">

                <p>
                  <b>FREE Delivery</b>
                </p>

                <p className="text-gray-500 mt-1">
                  Delivery available across selected locations.
                </p>

              </div>

              {/* PINCODE */}

              <div className="mt-5">

                <p className="text-sm font-semibold mb-2">
                  Check delivery
                </p>

                <div className="flex gap-2">

                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter pincode"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none focus:border-orange-500"
                  />

                  <button
                    className="text-blue-600 font-semibold text-sm"
                    onClick={() => {
                      if (pincode.length === 6) {
                        alert(
                          `Delivery checked for ${pincode}`
                        );
                      }
                    }}
                  >
                    Check
                  </button>

                </div>

              </div>

              {/* STOCK */}

              <p
                className={`font-semibold mt-5 ${
                  stock > 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {stock > 0
                  ? stock < 10
                    ? `Only ${stock} left in stock`
                    : "In Stock"
                  : "Out of Stock"}
              </p>

              {/* QUANTITY */}

              {stock > 0 && (

                <div className="flex items-center gap-3 mt-4">

                  <span className="text-sm">
                    Quantity:
                  </span>

                  <div className="flex items-center border rounded-lg overflow-hidden">

                    <button
                      onClick={decreaseQty}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <MdRemove />
                    </button>

                    <span className="px-4 font-semibold">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQty}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <MdAdd />
                    </button>

                  </div>

                </div>
              )}

              {/* CART */}

              <button
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className="w-full mt-5 bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-40 py-3 rounded-full font-semibold"
              >
                Add to Cart
              </button>

              {/* BUY */}

              <button
                disabled={stock <= 0}
                className="w-full mt-3 bg-[#FFA41C] hover:bg-[#FA8900] disabled:opacity-40 py-3 rounded-full font-semibold"
              >
                Buy Now
              </button>

              {/* FEATURES */}

              <div className="border-t mt-5 pt-4 space-y-3">

                <div className="flex items-center gap-3 text-sm text-gray-600">

                  <MdLocalShipping
                    size={22}
                    className="text-gray-500"
                  />

                  <span>
                    Free Delivery
                  </span>

                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">

                  <MdSecurity
                    size={22}
                    className="text-gray-500"
                  />

                  <span>
                    Secure transaction
                  </span>

                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">

                  <MdReplay
                    size={22}
                    className="text-gray-500"
                  />

                  <span>
                    Easy returns
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            LOCAL PRODUCT DETAILS
        ================================================= */}

        <div className="mt-10 border-t pt-8">

          <h2 className="text-xl font-bold mb-5">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-lg p-4">

              <p className="text-xs text-gray-500">
                Product ID
              </p>

              <p className="font-semibold mt-1">
                {product.id}
              </p>

            </div>

            {product.brand && (

              <div className="bg-gray-50 rounded-lg p-4">

                <p className="text-xs text-gray-500">
                  Brand
                </p>

                <p className="font-semibold mt-1">
                  {product.brand}
                </p>

              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">

              <p className="text-xs text-gray-500">
                Price
              </p>

              <p className="font-semibold mt-1">
                ₹{price.toLocaleString()}
              </p>

            </div>

            <div className="bg-gray-50 rounded-lg p-4">

              <p className="text-xs text-gray-500">
                Availability
              </p>

              <p className="font-semibold mt-1">
                {stock > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LocalProductDetails;