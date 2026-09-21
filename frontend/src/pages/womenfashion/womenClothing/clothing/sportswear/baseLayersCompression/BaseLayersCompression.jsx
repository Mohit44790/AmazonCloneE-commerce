import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
const BaseLayersCompression = () => {
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
           <h1 className="font-semibold text-sm px-4">Base Layers & Compression</h1>
            <div className="px-6">
                       <Link to="/women/clothing/sports-wear/base-layers-compression/armwarmers" className="flex items-center  text-sm">
                                   ArmWarmers
                                 </Link>
                       <Link to="/women/clothing/sports-wear/base-layers-compression/compression-socks" className="flex items-center  text-sm">
                                  Compression Socks
                                 </Link>
                       <Link to="/women/clothing/sports-wear/base-layers-compression/legwarmers" className="flex items-center  text-sm">
                                   Leg Warmers
                                 </Link>
                       <Link to="/women/clothing/sports-wear/base-layers-compression/pants" className="flex items-center  text-sm">
                                   Pants
                                 </Link>
                       <Link to="/women/clothing/sports-wear/base-layers-compression/shirts" className="flex items-center  text-sm">
                                   Shirts
                                 </Link>
                       <Link to="/women/clothing/sports-wear/base-layers-compression/shorts" className="flex items-center  text-sm">
                                 Shorts
                                 </Link>
                       <Link to="/women/clothing/sports-wear/base-layers-compression/thermal-underwear" className="flex items-center  text-sm">
                                  Thermal Underwear
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

export default BaseLayersCompression