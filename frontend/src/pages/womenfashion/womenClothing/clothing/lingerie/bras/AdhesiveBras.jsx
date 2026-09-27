import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

const AdhesiveBras = () => {
  return (
      <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
           <Link to="/women/clothing" className="flex items-center  text-sm">
            <IoIosArrowBack /> Women
           </Link>
           <Link to="/women/lingerie/bras" className="flex items-center  text-sm">
             <IoIosArrowBack /> Bras
           </Link>
           <h1 className="font-semibold text-sm px-4">Adhesive Bras</h1>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Women's Adhesive Bras</h1>

          <section>
            <h1>Feature Categories</h1>
            <div className='flex text-center '>

               <a href="/women/sport"  className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Women</p>
               </a>

               <a href="women/lingerie" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Lingerie</p>
               </a>
               <a href="/women/lingerie/bras" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/410b1UuLwVL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken'  />
                <p>Bras</p>
               </a>
               <a href="women/lingerie/bras/adhesive" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41hUqCKY3aL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Adhesive</p>
               </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdhesiveBras