import React, { useEffect, useMemo, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

const BustiersCorsets = () => {
  const [loading,setLoading] = useState(true);
  const [selectedColors,setSelectedColors] = useState([]);
  const [selectedSizes,setSelectedSizes] = useState([]);
  const [selectedBrands,setSelectedBrands] = useState([]);
  const [selectedMaterials,setSelectedMatrials] = useState([]);
  const [selectedOccasions,setSelectedOccasions] = useState([]);
  const [selectedFitTypes,setSelectedFitTypes] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [selectedClosures,setSelectedClosures] = useState([]);
  const [selectedStyles,setSelectedStyles] = useState([]);
  const [selectedNecks, setSelectedNecks] = useState([]);
  const [selectedLenghts,setSelectedLenghts] = useState([]);
  const [selectedPriceRange,setSelectedPriceRange] = useState('');

 const priceRanges = [
    { label: 'Under ₹300', min: 0, max: 300 },
    { label: '₹300 - ₹500', min: 300, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹1,500', min: 1000, max: 1500 },
    { label: 'Over ₹1,500', min: 1500, max: Infinity },

  ];

  useEffect(() => {
    const timer = setTimeout(() =>setLoading(false),800);
    return () => clearTimeout(timer);
  },[]);

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextFriday = new Date(today);
  const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
  nextFriday.setDate(today.getDate() + daysUntilFriday);

  const formattedFriday = nextFriday.toLocaleDateString('en-US', {

    weekday: 'short', month: 'short', day: 'numeric',

  });

   const formattedTomorrow = tomorrow.toLocaleDateString('en-US', {

    weekday: 'short', month: 'short', day: 'numeric',

  });

   const categoryProducts = useMemo(() => [
  
  
    ], []);

    const allColors = [...new Set(categoryProducts.flatMap((item) => item.colors || []))];
    const allSizes = [...new Set(categoryProducts.flatMap((item) => {
    
        const sizes = item.sizes ?? item.size ?? [];
    
        return Array.isArray(sizes) ? sizes : [sizes];
    
      }))];
  return (
      <div>

     <div className='flex flex-col bg-white md:flex-row gap-2 p-2'>
        <div className="w-64 flex flex-col gap-2">
           <h1 className="font-semibold text-sm">Category</h1>
             <h1 className="font-semibold text-sm">Category</h1>
                      <Link to="/women/clothing" className="flex items-center  text-sm">
                       <IoIosArrowBack />  Clothing & Accessories
                      </Link>
                      <Link to="/women/clothing" className="flex items-center  text-sm">
                       <IoIosArrowBack /> Women
                      </Link>
                      <Link to="/women/lingerie" className="flex items-center  text-sm">
                        <IoIosArrowBack /> Lingerie
                      </Link>
                      
           <h1 className="font-semibold text-sm px-4">Bustiers & Corsets</h1>
        </div>
         <div className='flex-1 min-w-0 w-full'>
          <h1 className="font-semibold text-4xl px-4">Featured categories</h1>
        </div>
      </div>
    </div>
  )
}

export default BustiersCorsets