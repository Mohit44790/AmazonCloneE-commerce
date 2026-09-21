import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
const Sets = () => {
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
           <h1 className="font-semibold text-sm px-4">Sets</h1>
             <div className="px-6">
            <Link to="/women/clothing/sports-wear/sweatsuits" className="flex items-center  text-sm">
                        Sweatsuits
                      </Link>
            <Link to="/women/clothing/sports-wear/tracksuits" className="flex items-center  text-sm">
                       Tracksuits
                      </Link>
            <Link to="/women/clothing/sports-wear/workout-sets" className="flex items-center  text-sm">
                        Workout Top & Bottom Sets
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

export default Sets