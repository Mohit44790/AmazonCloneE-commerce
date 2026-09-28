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

           <section>
            <h1 className='text-2xl font-bold mt-6'>Feature Categories</h1>
            <div className='flex text-center justify-between '>

               <a href="/women/sport"  className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Women</p>
               </a>

               <a href="/women/lingerie/sport" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/31Lyta42HgL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>SportWear</p>
               </a>
               <a href="/women/lingerie/bras" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41t0dkk6mwL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken'  />
                <p>InnerWear</p>
               </a>
               <a href="/women/lingerie/bras/adhesive" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/31yt+9tHmYL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Sport Bras</p>
               </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SportsBras