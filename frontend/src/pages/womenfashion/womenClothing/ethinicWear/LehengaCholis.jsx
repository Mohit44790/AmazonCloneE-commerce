import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { lehengaBrands, lehengaStyle } from '../../../../component/data/Womenfashion.js'

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
        <div className='w-full p-4'>
          
          <img src="https://m.media-amazon.com/images/G/31/img23/WA/2024/july/HOTW/mob2._CB568761755_.png" alt="" />
           <div className='bg-amber-500 p-3 mt-2'>
          
                    <div className='flex gap-2'>
                        {lehengaBrands.map((item,id)=>(
                          <Link id={item.link} key={id}>
                            <img src={item.image} alt="brands" />
                          
                          </Link>
                        ))}
                    </div>
                  </div>
                   
                    <div className='flex mt-4  gap-2'>
                        {lehengaStyle.map((item,id)=>(
                          <Link id={item.link} key={id}>
                            <img src={item.image} alt="brands" />
                          
                          </Link>
                        ))}
                    </div>
        </div>
      </div>
    </div>
  )
}

export default LehengaCholis