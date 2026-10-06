import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

const loungeWearCategories = [
  {name:"Babydolls", path:"/women/clothing/sleep-lounge-wear/babydolls"},
  {name:"Nighte & Nightdresses", path:"/women/clothing/sleep-lounge-wear/nighties-nightdresses"},
  {name:"Pyjamas & Lounge Pants", path:"/women/clothing/sleep-lounge-wear/pyjamas-lounge-pants"},
  {name:"Nightwear Sets", path:"/women/clothing/sleep-lounge-wear/nightwear-sets"},
  {name:"Pyjama Sets", path:"/women/clothing/sleep-lounge-wear/pyjama-sets"},
  {name:"Pajama Tops", path:"/women/clothing/sleep-lounge-wear/pajama-tops"},
  {name:"Onesies", path:"/women/clothing/sleep-lounge-wear/onesies"},
  {name:"Lounge Shorts", path:"/women/clothing/sleep-lounge-wear/lounge-shorts"},
]

const SleepLoungeWear = () => {
  return (
    <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <aside className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
           <Link to="/women/clothing" className="flex items-center  text-sm">
                                                     <IoIosArrowBack />  Clothing & Accessories
                                                    </Link>
                                                    <Link to="/women/clothing" className="flex items-center  text-sm">
                                                     <IoIosArrowBack /> Women
                                                    </Link>
         
           <h1 className="font-semibold text-sm px-4">Sleep & Loungewear</h1>

           <div className="flex flex-col gap-2 px-4">
            {loungeWearCategories.map((category, index) => (
              <Link key={index} to={category.path} className="text-sm hover:text-yellow-700">
                {category.name}
              </Link>
            ))}
           </div>
        </aside>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>
        </div>
      </div>
    </div>
  )
}

export default SleepLoungeWear