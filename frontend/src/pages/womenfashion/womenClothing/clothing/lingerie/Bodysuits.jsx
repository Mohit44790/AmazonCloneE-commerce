import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'


const bodysuitWomen = [
  {name:"women",image:"https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg",path:"/women/clothing"},
  {name:"Lingerie",image:"https://m.media-amazon.com/images/I/31jTmtNtHhL._AC._SR240,240.jpg",path:""},
  {name:"Bodysuites",image:"https://m.media-amazon.com/images/I/31B-86xksBL._AC._SR240,240.jpg",path:""},
]
const Bodysuits = () => {
  const [loading , setLoading] = useState(true);

     useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
        return () => clearTimeout(timer);
    }, []);


  return (
     <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
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
                    
           <h1 className="font-semibold text-sm px-4">Bodysuits</h1>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Women's Bodysuits</h1>
          <h1 className="font-semibold text-4xl mt-6 px-4">Featured categories</h1>

          <div className="flex flex-wrap gap-4 p-4">
                     {loading
                       ? Array.from({ length: 3 }).map((_, index) => (
                           <div key={index} className="w-48 animate-pulse">
                             <div className="bg-gray-200 w-48 h-48 rounded-full" />
                             <div className="h-5 w-24 bg-gray-200 rounded mx-auto mt-3" />
                           </div>
                         ))
                       : bodysuitWomen.map((item, index) => (
                           <div key={index}>
                             <Link to={item.path} className="flex items-center bg-gray-100 w-48 h-48 rounded-full gap-2 p-8">
                               <img src={item.image} alt={item.name} className="object-cover mix-blend-darken" />
                             </Link>
                             <h1 className="font-semibold text-center text-lg px-4">{item.name}</h1>
                           </div>
                         ))}
                   </div>
        </div>
      </div>
    </div>
  )
}

export default Bodysuits