import React, { useRef, useState } from 'react'
import AmazonFashion from '../../AmazonFashion.jsx'
import { ethinicBrandfocus, ethinicWearSlidertwo, ethnicWear } from '../../../../component/data/Womenfashion.js'
import { Link } from 'react-router-dom'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const womenEthnicWear = [
  {label:"Blouses" , link:"/womenfashion/womenClothing/ethinicWear/blouses" },
  {label:"Bottoms Wear","link":"/womenfashion/womenClothing/ethinicWear/Bottoms-wear"},
  {label:"Chunnis & Dupattas","link":"/womenfashion/womenClothing/ethinicWear/Chunnis-Dupattas"},
  {label:"Dress Material","link":"/womenfashion/womenClothing/ethinicWear/Dress-Material"},
  {label:"Gowns", link:"/womenfashion/womenClothing/ethinicWear/Gowns"},
  {label:"Kurtas & Suits", link:"/womenfashion/womenClothing/ethinicWear/Kurtas-Suits"},  
  {label:"Lehenga Cholis", link:"/womenfashion/womenClothing/ethinicWear/Lehenga-Cholis"},
  
  {label:"Sarees", link:"/womenfashion/womenClothing/ethinicWear/Sarees"},
]

// Slider mein ek time par kitne items visible rahenge
const SLIDE_VISIBLE_COUNT = 4

const EthnicWear = () => {
  const sliderRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkSliderScroll = () => {
    const el = sliderRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  const scrollSlider = (direction) => {
    const el = sliderRef.current
    if (!el) return
    // Container ki poori visible width jitna scroll karo -> exactly 4 items aage/peeche
    const scrollAmount = el.clientWidth
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
    setTimeout(checkSliderScroll, 300)
  }

  return (
    <div className='bg-white'>
      {/* Yeh style scrollbar ko sabhi browsers mein hide karta hai — global CSS par depend nahi karta */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <AmazonFashion/>
      <div className='flex p-2'>
        <div className='w-64 border-r-2 border-gray-200 p-2'>
          <h1 className="text-lg font-bold">Category</h1>
         <div className="flex gap-1 text-sm">
                            <IoIosArrowBack className="mt-1"/>
                          <h2 className="text-sm">Clothing & Accessories</h2>
                         </div>
                         <div className="flex gap-1 text-sm">
                          <IoIosArrowBack className="mt-1"/>
                          <h2 className="">Women</h2>
                         </div>
                         <h1 className="text-sm px-4 font-semibold">Ethnic Wear</h1>
          <div>
            {womenEthnicWear.map((item,id)=>(
              <div key={id} className='px-6  text-sm cursor-pointer'>
                <Link to={item.link}>{item.label}</Link>    
              </div>
            ))}
          </div>
        </div>
        <div className='p-2 px-2 w-full'>
          <div className=''>
            <h1 className='text-lg font-bold'>Womens Ethnic Wear</h1>
            <div className='flex w-64'>
              <img src="https://m.media-amazon.com/images/G/31/img23/WA/sept/toggle/Ethnic-Toggle-2_01.jpg" alt="img1" />
              <img src="https://m.media-amazon.com/images/G/31/img23/WA/sept/toggle/Ethnic-Toggle-2_02.jpg" alt="img2" />
            </div>

            <div className='bg-gray-200 p-4'>

            <div className='flex bg-white'>
              {ethnicWear.map((item,id)=>(
                <div className='text-center w-32 p-2' key={id}>
                  <Link to={item.link}>
                  <img src={item.image} alt={item.label} />
                  <p>{item.label}</p>
                  </Link>
                </div>
              ))}

            </div>

            <div className="bg-orange-500 p-4 mt-2 rounded-3xl">
              <div className="relative flex items-center min-w-0">
                {/* Left Arrow - shuru mein hidden, scroll hone ke baad dikhega */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollSlider('left')}
                    className="absolute left-0 z-10 h-full px-3 flex items-center justify-center bg-white/95 shadow-lg rounded-l-2xl"
                  >
                    <IoIosArrowBack className="text-xl"/>
                  </button>
                )}

                <div
                  ref={sliderRef}
                  onScroll={checkSliderScroll}
                  className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full min-w-0"
                >
                  {ethinicWearSlidertwo.map((item,id)=>{
                    // kuch items ka image field array hai, kuch string — dono safely handle karo
                    const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image
                    const hasPrice = item.price != null

                    return (
                      <div
                        className="flex-shrink-0"
                        style={{ width: `calc((100% - ${(SLIDE_VISIBLE_COUNT - 1) * 1}rem) / ${SLIDE_VISIBLE_COUNT})` }}
                        key={id}
                      >
                        {hasPrice ? (
                          // Product card — white background, rounded corners, image + name + price
                          <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-full">
                            <img src={imgSrc} alt={item.title} className="w-full h-80 object-cover"/>
                            <div className="p-3">
                              <p className="text-sm text-gray-900 line-clamp-1">{item.title}</p>
                              <p className="mt-1">
                                <span className="text-sm align-top">₹</span>
                                <span className="text-lg font-medium">{item.price}</span>
                                <span className="text-sm align-top">00</span>
                              </p>
                              {item.mrp && (
                                <p className="text-xs text-gray-600 mt-0.5">
                                  M.R.P:{' '}
                                  <span className="line-through">
                                    ₹{item.mrp.toLocaleString('en-IN')}.00
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Promo banner (no title/price) — bina card ke, seedha background mein blend
                          <img src={imgSrc} alt="ethnic wear promo" className="w-full h-full object-cover rounded-2xl"/>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Right Arrow - end tak scroll hone par hide */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollSlider('right')}
                    className="absolute right-0 z-10 h-full px-3 flex items-center justify-center bg-white/95 shadow-lg rounded-r-2xl"
                  >
                    <IoIosArrowForward className="text-xl"/>
                  </button>
                )}
              </div>
             
            </div>
             
              </div>
              <div className='mx-8 mt-8'>
                <h1 className='text-2xl font-semibold'>Brands in focus</h1>
                <div className='flex gap-2'>
                  {ethinicBrandfocus.map((item,id)=>(
                    <Link key={id} to={item.link} className=''>
                    <img src={item.image} alt="" />
                    </Link>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EthnicWear