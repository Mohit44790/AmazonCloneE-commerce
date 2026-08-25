import React from 'react'
import AmazonFashion from '../../AmazonFashion'
import { Link} from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

const WesternWearlist = [
  {label:"Tops & T-Shirts & Shirts" , link:"/western-weat/tops-t-shirts-shirts"},
  {label:"Dresses & Jumpsuits", link:"/western-wear/dresses-jumpsuits"},
  {label:"Trousers", link:"/western-wear/trousers"},
  {label:"Jeans & Jeggings", link:"/western-wear/jeans-jeggings"},
  {label:"Skirts & Shorts", link:"/western-wear/skirts-shortss"},
  {label:"Shrugs", link:"/western-wear/shrugs"},
  {label:"Leggings", link:"/western-wear/leggings"},
  {label:"Rainwear", link:"/western-wear/rainwear"},
  {label:"Ponchos & Capes", link:"/western-wear/ponchos-capes"},
  {label:"Winter Wear", link:"/western-wear/winter-wear"},

]

const WesternWear = () => {
  return (
    <div>
      <AmazonFashion/>
      <div className="flex flex-col md:flex-row gap-4">

        <div className="border-r px-2 bg-white border-gray-300 w-full md:w-64 lg:w-56 shrink-0">
          <h1>Category</h1>
          <Link to={"/women/western-wear"} className="flex items-center gap-1 text-sm"  >
          <IoIosArrowBack/>
          <h1>Clothing & Accessories</h1>
          </Link>
          <Link to={"/women/western-wear"} className="flex items-center gap-1 text-sm"  >
          <IoIosArrowBack/>
          <h1>Women</h1>
          </Link>
          <h1 className="font-semibold px-4">Western Wear</h1>
          <div>
            {WesternWearlist.map((item,id)=>(
              <div key={id} className="px-6 text-sm cursor-pointer">
                <Link to={item.link}>
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className='flex-1 min-w-0 w-full'>
          <h1>side</h1>
        </div>
      </div>
    </div>
  )
}

export default WesternWear