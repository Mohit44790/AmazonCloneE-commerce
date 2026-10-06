import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'


const babydollCategories = [
  {name:"Women", image:"https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg" ,path:"/women/clothing/sleep-lounge-wear/women"},
  {name:"Sleep & Lounge", image:"https://m.media-amazon.com/images/I/41pvLW0jokL._AC._SR240,240.jpg" ,path:"/women/clothing/sleep-lounge-wear/nighties-nightdresses"},
  {name:"Babydoll", image:"https://m.media-amazon.com/images/I/412gz-fNcmL._AC._SR240,240.jpg" ,path:"/women/clothing/sleep-lounge-wear/babydoll"},
]
const Babydolls = () => {
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
           <Link to="/women/clothing/sleep-loungewear" className="flex items-center  text-sm">
             <IoIosArrowBack /> Sleep & Loungewear
           </Link>
           <h1 className="font-segmibold text-sm px-4">Babydolls</h1>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>

          <div className="flex flex-wrap gap-4 p-4">
            {babydollCategories.map((category, index) => (
              <Link key={index} to={category.path} className="w-48 h-48 rounded-full p-8 bg-gray-100 flex flex-col items-center justify-center">
                <img src={category.image} alt={category.name} className="w-full h-32 object-cover mix-blend-darken mb-2" />
                <span className="text-sm text-center">{category.name}</span>
              </Link>
            ))}
          </div>
         </div>
        </div>
      </div>
    
  )
}

export default Babydolls