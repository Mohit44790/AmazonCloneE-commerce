import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

const SportsBras = () => {
  return (
      <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
                     <Link to="/women/clothing" className="flex items-center  text-sm">
                      <IoIosArrowBack />  Clothing & Accessories
                     </Link>
                     <Link to="/women/clothing" className="flex items-center  text-sm">
                      <IoIosArrowBack /> Women
                     </Link>
                     <Link to="/women/lingerie" className="flex items-center  text-sm">
                       <IoIosArrowBack /> Lingerie
                     </Link>
                     <Link to="/women/lingerie/bras" className="flex items-center  text-sm">
                       <IoIosArrowBack /> Bras
                     </Link>
                     <h1 className="font-semibold text-sm px-4">Adhesive Bras</h1>
          
                        <h2 className="font-semibold text-sm">Amazon Prime</h2>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="accent-orange-400"
                            
                            />
                            <TiTick className="text-orange-400 text-lg" />
                            <span className="text-blue-500 font-bold">prime</span>
                          </label>
          
                     <h2 className="font-semibold text-sm">Delivery Day</h2>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="accent-orange-400"
                                              />
                            <span className="ml-1 text-sm">Get It by Tomorrow</span>
                          </label>
           <h1 className="font-semibold text-sm px-4">Sports Bras</h1>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>
        </div>
      </div>
    </div>
  )
}

export default SportsBras