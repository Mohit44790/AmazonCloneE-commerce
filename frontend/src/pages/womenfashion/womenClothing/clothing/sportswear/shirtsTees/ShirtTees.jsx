import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
const ShirtTees = () => {
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
           <h1 className="font-semibold text-sm px-4">Shirts & Tees</h1>
            <div className="px-6">
                       <Link to="/women/clothing/sports-wear/shirts-tees/button-down-shirts" className="flex items-center  text-sm">
                                  Button-Down Shirts
                                 </Link>
                       <Link to="/women/clothing/sports-wear/shirts-tees/polos" className="flex items-center  text-sm">
                                  Polos
                                 </Link>
                       <Link to="/women/clothing/sports-wear/shirts-tees/t-shirts" className="flex items-center  text-sm">
                                   T-shirts
                                 </Link>
                       <Link to="/women/clothing/sports-wear/shirts-tees/tank-tops" className="flex items-center  text-sm">
                                 Tank Tops
                                 </Link>
                       
                                     </div>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>
        </div>
      </div>
    </div>
  )
}

export default ShirtTees