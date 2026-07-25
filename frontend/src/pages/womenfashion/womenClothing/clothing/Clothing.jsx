import React, { useRef, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { womenClothingData } from '../../../../component/data/Womenfashion.js'


const womenclothing = [
    {label:"Ethnic Wear" , link:"/women/clothing/ethnic-wear"},
    {label:"Western Wear" , link:"/women/clothing/western-wear"},
    {label:"SportsWear" ,link:"/women/clothing/sports-wear"},
    {label:"Lingerie", link:"/women/clothing/lingerie"},
    {label:"Sleep & Lounge Wear", link:"/women/clothing/sleep-lounge-wear"},
    {label:"Accessories", link:"/women/clothing/accessories"},
    {label:"Swim & Beachwear", link:"/women/clothing/swim-beachwear"},
    {label:"Maternity", link:"/women/clothing/maternity"},
    {label:"Sunglasses & Spectacles", link:"/women/clothing/sunglasses-spectacles"},
    {label:"Lingerie & Nightwear" , link:"/women/clothing/lingerie-nightwear"},
    {label:"Overalls", link:"/women/clothing/overalls"},
]

// Item ki fixed width + gap (Tailwind: w-32/36/40 responsive, gap-3 = 12px)
const ITEM_WIDTH = 160
const GAP = 12
const VISIBLE_COUNT = 5 // ek baar me 5 images ke baad scroll ho

const Clothing = () => {
    const scrollRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

    const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = VISIBLE_COUNT * (ITEM_WIDTH + GAP)
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 300)
  }

  return (
   // w-fulls typo fix -> w-full, aur overflow-x-hidden lagaya taaki page kabhi bhi horizontally overflow na ho
   <div className='w-full max-w-full overflow-x-hidden flex flex-col gap-2 bg-white p-2'>
        {/* Mobile par sidebar aur content stack (flex-col), desktop par side-by-side (md:flex-row) */}
        <div className='flex flex-col md:flex-row gap-2'>
            <div className="border-r px-2 border-gray-300 w-full md:w-64 lg:w-56 shrink-0">
                <h1 className="font-semibold">Category</h1>
                 <div className="flex gap-1 text-sm">
                    <IoIosArrowBack className="mt-1"/>
                  <h2 className="text-sm">Clothing & Accessories</h2>
                 </div>
                <h2 className="font-semibold px-6">Women</h2>
                 <div>
                    {womenclothing.map((item, index) => (
                        <div key={index} className="px-9 text-sm hover:bg-gray-100 cursor-pointer">
                            <a href={item.link}>{item.label}</a>
                        </div>
                    ))}
                 </div>
            </div>
            {/* min-w-0 zaroori hai warna flex item apni content-width se page ko overflow kar deta hai */}
            <div className="flex-1 min-w-0 w-full">
                <div className="bg-gray-200 p-4 w-full">
                    <div className="bg-white p-4">
                        <h1 className="font-semibold text-lg mb-2">Blockbuster Deals</h1>

                        <div className="relative flex items-center w-full min-w-0">
                            {/* Left Arrow - hamesha visible, sirf tab jab scroll ho chuka ho */}
                            {canScrollLeft && (
                              <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 z-10 bg-white shadow-2xl border border-gray-100 py-7 px-2 rounded-sm"
                              >
                                <IoIosArrowBack/>
                              </button>
                            )}

                            <div
                              ref={scrollRef}
                              onScroll={checkScroll}
                              className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar w-full min-w-0"
                            >
                                {womenClothingData.map((item) => (
                                  <a
                                    key={item.id}
                                    href={item.link}
                                    className="flex-shrink-0 w-28 sm:w-36 md:w-40 text-center block"
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.label}
                                      className="w-full object-cover bg-gray-100"
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = "https://via.placeholder.com/412x527?text=Image+Unavailable"
                                      }}
                                    />
                                    {/* <h3 className="text-sm mt-1">{item.label}</h3>s */}
                                  </a>
                                ))}
                            </div>

                            {/* Right Arrow - hamesha visible, sirf end tak scroll hone par hide */}
                            {canScrollRight && (
                              <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 z-10 bg-white shadow-2xl border border-gray-100 py-7 px-1 rounded-sm"
                              >
                                <IoIosArrowForward/>
                              </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className='bg-orange-400 px-2 mt-2 rounded-2xl'>
           <img src="https://m.media-amazon.com/images/G/31/img23/WA/2026/MARCH/FLIP/P0/DOSSIER/New-Launches-._CB784870558_.gif" alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Clothing