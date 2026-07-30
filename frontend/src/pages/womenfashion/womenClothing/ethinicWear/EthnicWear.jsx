import React from 'react'
import AmazonFashion from '../../AmazonFashion.jsx'
import { ethnicWear } from '../../../../component/data/Womenfashion.js'
import { Link } from 'react-router-dom'

const EthnicWear = () => {
  return (
    <div className='bg-white'>
      <AmazonFashion/>
      <div className='flex p-2'>
        <div className='w-64 border-r-2 border-gray-200 p-2'>
          <h1>Category</h1>
        </div>
        <div className='p-2 px-2 w-full'>
          <div className=''>
            <h1 className='text-lg font-bold'>Womens Ethnic Wear</h1>
            <div className='flex w-64'>
              <img src="https://m.media-amazon.com/images/G/31/img23/WA/sept/toggle/Ethnic-Toggle-2_01.jpg" alt="img1" />
              <img src="https://m.media-amazon.com/images/G/31/img23/WA/sept/toggle/Ethnic-Toggle-2_02.jpg" alt="img2" />
            </div>

            <div className='bg-gray-200 p-4'>

            <div className='flex bg-white'>
              {ethnicWear.map((item,id)=>(
                <div className='text-center w-32 p-2'>
                  <Link key={id} to={item.link}>
                  <img src={item.image} alt={item.label} />
                  <p>{item.label}</p>
                  </Link>
                </div>
              ))}

            </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EthnicWear