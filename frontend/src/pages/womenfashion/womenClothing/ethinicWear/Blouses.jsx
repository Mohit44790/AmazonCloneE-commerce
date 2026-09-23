import React, { useEffect, useState } from 'react'
import AmazonFashion from '../../AmazonFashion'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import {
  blousesbrands,
  blousestypes
} from '../../../../component/data/Womenfashion.js'

const Blouses = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // ---------------- SKELETON ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AmazonFashion />

        <div className="flex flex-col md:flex-row gap-2 p-2">
          {/* Sidebar Skeleton */}
          <div className="border-r px-2 bg-white border-gray-300 w-full md:w-64 lg:w-56 shrink-0">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 mb-3"
              >
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}

            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse ml-4 mt-4" />
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 min-w-0 w-full">

            {/* Banner Skeleton */}
            <div className="w-full h-40 md:h-64 lg:h-80 bg-gray-200 rounded animate-pulse" />

            {/* Brands Section */}
            <div className="bg-gray-200 p-2 mt-2 rounded">
              <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-3" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded overflow-hidden"
                  >
                    <div className="w-full aspect-square bg-gray-300 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Types Section */}
            <div className="mt-4">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-3" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded overflow-hidden"
                  >
                    <div className="w-full aspect-square bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ---------------- ACTUAL PAGE ----------------
  return (
    <div>
      <AmazonFashion />

      <div className="flex flex-col bg-white md:flex-row gap-2 p-2">

        {/* Sidebar */}
        <div className="border-r px-2 bg-white border-gray-300 w-full md:w-64 lg:w-56 shrink-0">
          <h1 className="font-semibold">Category</h1>

          <Link
            to="/women/ethnic-wear"
            className="flex items-center gap-1 text-sm"
          >
            <IoIosArrowBack />
            <h1>Clothing & Accessories</h1>
          </Link>

          <Link
            to="/women/ethnic-wear"
            className="flex items-center gap-1 text-sm"
          >
            <IoIosArrowBack />
            <h1>Women</h1>
          </Link>

          <Link
            to="/women/ethnic-wear"
            className="flex items-center gap-1 text-sm"
          >
            <IoIosArrowBack />
            <h1>Ethnic Wear</h1>
          </Link>

          <h1 className="font-semibold px-4">
            Blouses
          </h1>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0 w-full">

          {/* Banner */}
          <img
            src="https://m.media-amazon.com/images/G/31/img2020/fashion/WomensApparel2024/HOTW/BLOUSES_1236x556._CB564707582_.jpg"
            alt="Blouses"
            className="w-full h-auto object-cover"
          />

          {/* Brands */}
          <div className="bg-amber-500 p-2 mt-2">

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {blousesbrands.map((item, id) => (
                <Link
                  to={item.link}
                  key={id}
                  className="block overflow-hidden rounded bg-white"
                >
                  <img
                    src={item.image}
                    alt="brand"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>

          </div>

          {/* Blouse Types */}
          <div className="mt-4">

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
              {blousestypes.map((item, id) => (
                <Link
                  to={item.link}
                  key={id}
                  className="block overflow-hidden rounded bg-white"
                >
                  <img
                    src={item.image}
                    alt="blouse"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Blouses