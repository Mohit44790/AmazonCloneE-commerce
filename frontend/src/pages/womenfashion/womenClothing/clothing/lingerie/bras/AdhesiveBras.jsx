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
            
            <div>
              <h1 className="font-semibold text-sm">Brands</h1>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">UNDERNEAT</p>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">DClub</p> 
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Sanfe</p>

            </div>

             <div>
              <h1 className="font-semibold text-sm">Price</h1>
              <p>Under ₹300 </p>
              <p>₹300 - ₹500</p>
              <p>₹500 - ₹1000</p>
              <p>₹1000 - ₹2000</p>
              <p>Over ₹2000</p>
             </div>

            <div>
              <h1 className="font-semibold text-sm">Customer Review</h1>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">4 Stars & Up</p>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">3 Stars & Up</p> 
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">2 Stars & Up</p>
              <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">1 Star & Up</p>
            </div>
                
                <div>
                  <h1 className="font-semibold text-sm">Deals & Discounts</h1>
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">All Discounts</p>
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Buy More, Save More</p> 
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Coupons</p>
                  <input type="checkbox"  /> <p className="text-sm hover:text-amber-500">Today's Deals</p>
                </div>
  
                       <div>
                        <h1 className="font-semibold text-sm">Bra Cup Size</h1>
                        <div className='grid gap-1 grid-cols-4 '>

                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">A</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">C</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">DDD</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">E</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">EE</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">F</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">FF</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">G</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">GG</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">H</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">I</button>
                        <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">J</button>
                        </div>
                       </div>

                       <div>
                        <h1 className="font-semibold text-sm">Closure Type</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Back Closure</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Front Closure</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Pull On</p>
                       </div>
                       <div>
                        <h1 className="font-semibold text-sm">Care Instructions</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Dry Clean Only</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Hand Wash Only</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Machine Wash</p>
                       </div>

                       <div>
                        <h1 className="font-semibold text-sm">Bra Brand Size</h1>
                        <div className='grid gap-2 grid-cols-4 '>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">24</button>
                          <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">26</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">28</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">30</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">32</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">34</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">36</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">38</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">40</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">42</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">44</button>
                          <button className="border border-gray-300 p-1 rounded-lg text-sm cursor-pointer">46</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">48</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">50</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">52</button>
                          <button className="border border-gray-300 p-1  rounded-lg text-sm cursor-pointer">54</button>
                       </div>
                       </div>

                        <div>
                        <h1 className="font-semibold text-sm">Strap Type
</h1>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Adjustable</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Halter</p>
                        <input type="checkbox" /> <p className="text-sm hover:text-amber-500">Invisible</p>
                       </div>
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
      className="flex bg-gray-200 flex-col gap-2"
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
          <div className="flex gap-2">
  {adhesiveBrasHotreleases.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 "
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

          {/* Top rated */}
          <section>
            <h1 className='text-2xl font-bold mt-18'>Top rated</h1>
 <div className="flex gap-2">
  {adhesiveBrasToprated.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 "
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

          {/* Brands related to this category */}
           <section>
            <h1 className='text-2xl font-bold mt-18'>Brands related to this category</h1>

          </section>

        {/* Best sellers  */}
           <section>
            <h1 className='text-2xl font-bold mt-18'>Best sellers </h1>
           <div className="flex gap-2">
  {adhesiveBrasBestsellers.map((item, id) => (
    <Link
      key={id}
      to={`/product/${item.id}`}
      className="flex bg-gray-200 flex-col gap-2 "
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

         <div className="flex flex-col gap-2 bg-white p-4 mt-4 border border-gray-300 rounded-2xl">
                    <h1>1-11 of over 2,000 results for Adhesive Bras</h1>
                  </div>
        </div>
      </div>
    </div>
  )
}

export default AdhesiveBras