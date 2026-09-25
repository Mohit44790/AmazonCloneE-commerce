import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

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
             <div className="px-6">
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
        </div>
      </div>
    </div>
  )
}

export default Bras