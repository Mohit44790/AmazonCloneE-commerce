import React from 'react'
import AmazonFashion from '../../AmazonFashion.jsx'
import { ethnicWear } from '../../../../component/data/Womenfashion.js'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

const womenEthnicWear = [
  {label:"Blouses" , link:"/womenfashion/womenClothing/ethinicWear/blouses" },
  {label:"Bottoms Wear","link":"/womenfashion/womenClothing/ethinicWear/Bottoms-wear"},
  {label:"Chunnis & Dupattas","link":"/womenfashion/womenClothing/ethinicWear/Chunnis-Dupattas"},
  {label:"Dress Material","link":"/womenfashion/womenClothing/ethinicWear/Dress-Material"},
  {label:"Gowns", link:"/womenfashion/womenClothing/ethinicWear/Gowns"},
  {label:"Kurtas & Suits", link:"/womenfashion/womenClothing/ethinicWear/Kurtas-Suits"},  
  {label:"Lehenga Cholis", link:"/womenfashion/womenClothing/ethinicWear/Lehenga-Cholis"},
  {label:"Shawls & Stoles", link:"/womenfashion/womenClothing/ethinicWear/Shawls-Stoles"},
  {label:"Sarees", link:"/womenfashion/womenClothing/ethinicWear/Sarees"},
]
const EthnicWear = () => {
  return (
    <div className='bg-white'>
      <AmazonFashion/>
      <div className='flex p-2'>
        <div className='w-64 border-r-2 border-gray-200 p-2'>
          <h1 className="text-lg font-bold">Category</h1>
         <div className="flex gap-1 text-sm">
                            <IoIosArrowBack className="mt-1"/>
                          <h2 className="text-sm">Clothing & Accessories</h2>
                         </div>
                         <div className="flex gap-1 text-sm">
                          <IoIosArrowBack className="mt-1"/>
                          <h2 className="">Women</h2>
                         </div>
                         <h1 className="text-sm px-4 font-semibold">Ethnic Wear</h1>
          <div>
            {womenEthnicWear.map((item,id)=>(
              <div key={id} className='px-6  text-sm cursor-pointer'>
                <Link to={item.link}>{item.label}</Link>    
              </div>
            ))}
          </div>
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