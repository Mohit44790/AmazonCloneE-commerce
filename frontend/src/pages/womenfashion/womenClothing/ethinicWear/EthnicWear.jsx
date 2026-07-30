import React from 'react'
import AmazonFashion from '../../AmazonFashion'

const EthnicWear = () => {
  return (
    <div className='bg-white'>
      <AmazonFashion/>
      <div className='flex p-2'>
        <div className='w-64 border-r-2 border-gray-200 p-2'>
          <h1>Category</h1>
        </div>
        <div className='p-2 px-2'>
          <div>
            <h1 className='text-lg font-bold'>Womens Ethnic Wear</h1>
            <div className='flex w-64'>
              <img src="https://m.media-amazon.com/images/G/31/img23/WA/sept/toggle/Ethnic-Toggle-2_01.jpg" alt="img1" />
              <img src="https://m.media-amazon.com/images/G/31/img23/WA/sept/toggle/Ethnic-Toggle-2_02.jpg" alt="img2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EthnicWear