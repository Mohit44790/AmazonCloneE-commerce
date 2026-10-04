import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { TiTick } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import { adhesiveBrasBestsellers, adhesiveBrasHotreleases, adhesiveBrasRecommended, adhesiveBrasToprated } from '../../../../../../component/data/womenfashion'

const AdhesiveBras = () => {
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
 
                

        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl">Women's Adhesive Bras</h1>

          <section>
            <h1 className='text-2xl font-bold mt-6'>Feature Categories</h1>
            <div className='flex text-center justify-between '>

               <a href="/women/sport"  className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/31-2cmNibBL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Women</p>
               </a>

               <a href="/women/lingerie" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41u4ukX+y0L._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Lingerie</p>
               </a>
               <a href="/women/lingerie/bras" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/410b1UuLwVL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken'  />
                <p>Bras</p>
               </a>
               <a href="/women/lingerie/bras/adhesive" className="h-48 w-48 rounded-full bg-gray-100 p-8">
                <img src="https://m.media-amazon.com/images/I/41hUqCKY3aL._AC._SR240,240.jpg" alt="img" className='mix-blend-darken' />
                <p>Adhesive</p>
               </a>
            </div>
          </section>
          {/* Recommended for you */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Recommended for you</h1>

            <div className="flex gap-2">
  {adhesiveBrasRecommended.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 p-2"
    >
      <img
        src={item.image?.[0]}
        alt={item.name}
        className="h-72 w-full object-cover mix-blend-darken"
      />

      <button
        className="bg-white relative py-2 -mt-18 px-4 rounded-full border border-black
        hover:opacity-100 opacity-0 cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Quick Look
      </button>

      <div className="bg-white mt-8 p-2">
        <p className="font-bold">₹{item.price}</p>

        <p className="line-through text-gray-500">
          ₹{item.mrp}
        </p>

        <p className="text-sm">
          {item.name.slice(0, 50)}...
        </p>

        <div className="flex gap-2 items-center">
          <p className="text-sm">
            {item.rating}
          </p>

          <p className="text-yellow-500 text-sm">
            {"★".repeat(Math.floor(item.rating || 0))}
            {"☆".repeat(5 - Math.floor(item.rating || 0))}
          </p>

          <p className="text-sm text-gray-600">
            {item.ratingCount} ratings
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>

          </section>

{/* Hot new releases */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Hot new releases</h1>
           <div className="flex">
              {adhesiveBrasHotreleases.map((item, id)=>(
                <Link key={id}>
                  <img src={item.image?.[0]} alt="" />
                </Link>
              ))}
            </div>
          </section>

          {/* Top rated */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Top rated</h1>
 <div>
              {adhesiveBrasToprated.map((item, id)=>(
                <Link key={id}>
                  <img src={item.image?.[0]} alt="" />
                </Link>
              ))}
            </div>
          </section>

          {/* Brands related to this category */}
           <section>
            <h1 className='text-2xl font-bold mt-18'>Brands related to this category</h1>

          </section>

        {/* Best sellers  */}
           <section>
            <h1 className='text-2xl font-bold mt-18'>Best sellers </h1>
              <div>
              {adhesiveBrasBestsellers.map((item, id)=>(
                <Link key={id}>
                  <img src={item.image?.[0]} alt="" />
                  <p>{item.rating}</p>
                  <div>
                    <p>{item.price}</p>
                    <p>{item.mrp}</p>
                    <p>{item.discount}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdhesiveBras