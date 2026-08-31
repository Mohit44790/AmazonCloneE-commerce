import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

const LehengaCholis = () => {
  return (
    <div>
      <div className='flex'>
        <div className='w-64 border border-r-2 border-gray-200'>
          <h1>Category</h1>
          <Link to={"/women"} className='flex items-center'>
          <IoIosArrowBack className='mt-1'/>
          <h1>Clothing & Accessoriess</h1>
          </Link>
        </div>
        <div className='w-full'>
          <img src="https://m.media-amazon.com/images/G/31/img23/WA/2024/july/HOTW/mob2._CB568761755_.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default LehengaCholis