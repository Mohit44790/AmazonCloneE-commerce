import React from 'react'
import AmazonFashion from '../../AmazonFashion.jsx'
import { lingerieCollection } from '../../../../component/data/Womenfashion.js'
import { Link } from 'react-router-dom'

const Lingerie = () => {
  return (
    <div className='bg-white'>
      <AmazonFashion/>

      <div className='flex'>
        <div className='w-56'>
          <h1>Category</h1>
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