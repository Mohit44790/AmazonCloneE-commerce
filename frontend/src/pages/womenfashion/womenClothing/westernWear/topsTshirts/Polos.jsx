import React from 'react'
import AmazonFashion from '../../../AmazonFashion'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

const Polos = () => {
  return (
     <div>
      <AmazonFashion/>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className="w-64 border-r px-4 p-4 bg-white border-gray-200">
         <h1 className="font-semibold">Category</h1>
         <Link to={"/women/western-wear"} className="flex items-center text-sm" >
         <IoIosArrowBack />
          <h1>Clothing & Accessories</h1>
         </Link>
         <Link to={"/women/western-wear"} className="flex items-center text-sm" >
         <IoIosArrowBack />
          <h1>Women</h1>
         </Link>
         <Link to={"/women/western-wear"} className="flex items-center text-sm" >
         <IoIosArrowBack />
          <h1>Western Wear</h1>
         </Link>
         <Link to={"/women/western-wear"} className="flex items-center text-sm" >
         <IoIosArrowBack />
          <h1>Tops, T-Shirts & Shirts</h1>
         </Link>
           <h1 className="font-semibold px-5">Polos</h1>
          
        </div>
        <div className='flex-1 bg-white min-w-0 w-full'>
                    <div className="bg-white p-4 border mt-2 mx-6 border-gray-300 rounded-xl">
                          <h1>1-12 of over 40,000 results for Tops, T-Shirts & Shirts</h1>
                    </div>
        </div>
      </div>
        
    </div>
  )
}

export default Polos