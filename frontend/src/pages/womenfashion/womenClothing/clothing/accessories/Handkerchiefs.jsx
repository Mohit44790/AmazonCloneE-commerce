import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

const Handkerchiefs = () => {
  return (
   <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
           <Link to="/women/clothing" className="flex items-center  text-sm">
            <IoIosArrowBack /> Women
           </Link>
           <Link to="/women/clothing/sleep-loungewear" className="flex items-center  text-sm">
             <IoIosArrowBack /> Accessories
           </Link>
           <h1 className="font-semibold text-sm px-4">Handkerchiefs</h1>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>
        </div>
      </div>
    </div>
  )
}

export default Handkerchiefs