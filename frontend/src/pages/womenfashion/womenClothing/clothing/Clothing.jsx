import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'


const womenclothing = [
    {label:"Ethnic Wear" , link:"/women/clothing/ethnic-wear"},
    {label:"Western Wear" , link:"/women/clothing/western-wear"},
    {label:"SportsWear" ,link:"/women/clothing/sports-wear"},
    {label:"Lingerie", link:"/women/clothing/lingerie"},
    {label:"Sleep & Lounge Wear", link:"/women/clothing/sleep-lounge-wear"},
    {label:"Accessories", link:"/women/clothing/accessories"},
    {label:"Swim & Beachwear", link:"/women/clothing/swim-beachwear"},
    {label:"Maternity", link:"/women/clothing/maternity"},
    {label:"Sunglasses & Spectacles", link:"/women/clothing/sunglasses-spectacles"},
    {label:"Lingerie & Nightwear" , link:"/women/clothing/lingerie-nightwear"},
    {label:"Overalls", link:"/women/clothing/overalls"},
] 

const Clothing = () => {
  return (
    <div className='w-full h-full flex flex-col gap-2 bg-white p-2'>
        <div className='flex gap-2'>
            <div className="border-r px-2 border-gray-300  w-64">
                <h1 className="font-semibold">Category</h1>
                 <div className="flex gap-1 text-sm">
                    <IoIosArrowBack className="mt-1"/>
                  <h2 className="text-sm">Clothing & Accessories</h2>
                 </div>
                <h2 className="font-semibold px-6">Women</h2>
                 <div>
                    {womenclothing.map((item, index) => (
                        <div key={index} className="px-9 text-sm hover:bg-gray-100 cursor-pointer">
                            <a href={item.link}>{item.label}</a>        
                        </div>
                    ))}
                 </div>
            </div>
            <div className="flex-1 w-full" >
                <div className="bg-gray-200 p-4 w-full">
                    <div className="bg-white p-4">
                        <h1 className="font-semibold text-lg">Blockbuster Deals</h1>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Clothing