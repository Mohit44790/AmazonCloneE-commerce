import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
const AthleticSocks = () => {
  return (
     <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
           <Link to="/women/clothing" className="flex items-center  text-sm">
            <IoIosArrowBack /> Women
           </Link>
           <Link to="/women/clothing/sports-wear" className="flex items-center  text-sm">
             <IoIosArrowBack /> Sportswear
           </Link>
           <h1 className="font-semibold text-sm px-4">Athletic Socks</h1>
           <Link to="/women/clothing/sports-wear/ankle-socks" className="flex items-center  text-sm">
              Ankle Socks
           </Link>
           <Link to="/women/clothing/sports-wear/crew-socks" className="flex items-center  text-sm">
             Crew Socks
           </Link>
           <Link to="/women/clothing/sports-wear/knee-high-socks" className="flex items-center  text-sm">
             Knee-High Socks
           </Link>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>
        </div>
      </div>
    </div>
  )
}

export default AthleticSocks