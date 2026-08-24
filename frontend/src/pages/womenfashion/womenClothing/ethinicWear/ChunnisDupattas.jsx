import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
import AmazonFashion from '../../AmazonFashion'

const ChunnisDupattas = () => {
  return (
    <div>
      <AmazonFashion/>
      <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="border-r px-2 bg-white border-gray-300 w-full md:w-64 lg:w-56 shrink-0">
          <h1 className='font-semibold'>Category</h1>
          <Link to="/women/ethnic-wear" className="flex items-center gap-1 text-sm">
          <IoIosArrowBack/>
          <h1>Clothing & Accessories</h1>
          </Link>
          <Link to="/women/ethnic-wear" className="flex items-center gap-1 text-sm">
          <IoIosArrowBack/>
          <h1>Women</h1>
          </Link>
          <Link to="/women/ethnic-wear" className="flex items-center gap-1 text-sm">
          <IoIosArrowBack/>
          <h1 >Ethnic Wear</h1>
          </Link>
          <h1 className='font-semibold px-4'>Chunnis & Dupattas</h1>
        </div>
        <div className='flex-1 min-w-0 w-full'>
         <h1>Featured categories</h1>
        </div>
      </div>
    </div>
  )
}


export default ChunnisDupattas