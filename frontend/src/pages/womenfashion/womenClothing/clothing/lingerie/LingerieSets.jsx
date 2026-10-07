import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'



const lingerFeaturedCategories = [
  {name:"Women" , image:"https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg", path:"/women/clothing"},
  {name:"Lingerie",image:"https://m.media-amazon.com/images/I/410fdLYfsZL._AC._SR240,240.jpg", path:"/women/lingerie"},
  {name:"Lingerie Sets",image:"https://m.media-amazon.com/images/I/41H4uAgaaiL._AC._SR240,240.jpg", path:"/women/lingerie/lingerie-sets"}
]

const LingerieSets = () => {
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
                               <Link to="/women/lingerie" className="flex items-center  text-sm">
                                 <IoIosArrowBack /> Lingerie
                               </Link>
           <h1 className="font-semibold text-sm px-4">Lingerie Sets</h1>
        </aside>

        {/* main */}
         <main className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>

          <div className="flex flex-wrap gap-4 p-4  ">
            {lingerFeaturedCategories.map((item, index) => (
              <div>
              <Link to={item.path} key={index} className="flex items-center bg-gray-100  w-48 h-48 rounded-full gap-2 p-8">
                <img src={item.image} alt={item.name} className=" object-cover mix-blend-darken" /> 
              </Link>
              <h1 className="font-semibold text-center text-lg px-4">{item.name}</h1>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default LingerieSets