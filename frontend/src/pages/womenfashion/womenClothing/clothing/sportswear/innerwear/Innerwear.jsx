import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
const Innerwear = () => {
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
           <h1 className="font-semibold text-sm px-4">Innerwear</h1>
             <div className="px-6">
 <Link to="/women/clothing/sports-wear/briefs" className="flex items-center  text-sm">
             Briefs
           </Link>
 <Link to="/women/clothing/sports-wear/protective-sport-bras" className="flex items-center  text-sm">
             Protective Sport bras
           </Link>
 <Link to="/women/clothing/sports-wear/sports-bras" className="flex items-center  text-sm">
             Sports Bras
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

export default Innerwear