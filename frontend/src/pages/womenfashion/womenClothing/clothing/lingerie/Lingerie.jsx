import React from 'react'
import AmazonFashion from '../../../AmazonFashion.jsx'
import { lingerieCollection } from '../../../../../component/data/Womenfashion.js'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'


const LingerieList = [
  {name:"Bras" ,link:"/women/lingerie/bras"},
  {name:"Panties", link:"/women/lingerie/panties"},
  {name:"Shapeware",link:"/women/lingerie/shapeware"},
  {name:"Camisoles & Tanks",link:"/women/lingerie/camisoles-tanks"},
  {name:"Lingerie Sets",link:"/women/lingerie/lilngerie-sets"},
  {name:"Accessories",link:"/women/lingerie/accessories"},
  {name:"Pantyhose & Stockings",link:"/women/lingerie/pantyhose"},
  {name:"Thermals",link:"/women/lingerie/thermals"},
  {name:"Bodysuits",link:"/women/lingerie/bodysuits"},
  {name:"Bustiers & Corsets",link:"/women/lingerie/bustiers"},
  {name:"Garters & Suspender",link:"/women/lingerie/garters-suspender"}
]

const Lingerie = () => {
  return (
    <div className='bg-white'>
      <AmazonFashion/>

      <div className='flex'>
        <div className='w-64 p-2 border-r-2 border-gray-200'>
          <h1>Category</h1>
          <div className='flex items-center '>
            <IoIosArrowBack />
            <p>Clothing & Accessories</p>
          </div>
          <div className="flex items-center">
            <IoIosArrowBack />
            <p>Women</p>
          </div>
          <div>
            
            <h1 className='px-4 font-semibold'>Lingerie</h1>
            {LingerieList.map((item,id) =>(
              <div>
                <Link key={id} to={item.link}>
                <p className=' px-7'>{item.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className='w-full'>
          <div className='bg-gray-200 p-4'>
            <div className='flex bg-white p-6'>
              {lingerieCollection.map((item) => (
  <div key={item.id} className="text-center">
   <Link    to={item.link}><img
      src={item.image}
      alt={item.label}
      className="w-full h-auto"
    /></Link> 
    <p className="mt-2 font-medium">{item.label}</p>
  </div>
))}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Lingerie