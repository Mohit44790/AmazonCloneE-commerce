import React from 'react'
import AmazonFashion from '../../AmazonFashion'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

const Blouses = () => {
  return (
    <div>
      <AmazonFashion/>
      <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="border-r px-2 bg-white border-gray-300 w-full md:w-64 lg:w-56 shrink-0">
          <h1 className='font-semibold'>Category</h1>
          <Link to="/women/ethnic-wear" className="flex items-center gap-1 text-sm">
          <IoIosArrowBack/>
          <h1>Clothing & Accessories</h1>
          </Link>
          <Link to="/women/ethnic-wear" className="flex items-center gap-1 text-sm">
          <IoIosArrowBack/>
          <h1>Women</h1>
          </Link>
          <Link to="/women/ethnic-wear" className="flex items-center gap-1 text-sm">
          <IoIosArrowBack/>
          <h1 >Ethnic Wear</h1>
          </Link>
          <h1 className='font-semibold px-4'>Blouses</h1>
        </div>
        <div className='flex-1 min-w-0 w-full'>
          <img src="https://m.media-amazon.com/images/G/31/img2020/fashion/WomensApparel2024/HOTW/BLOUSES_1236x556._CB564707582_.jpg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Blouses