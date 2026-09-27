import { useDispatch, useSelector } from 'react-redux';
import AmazonFashion from '../../../components/AmazonFashion';
import Clothing from '../../../components/commanPages/Clothing';
import { useEffect, useRef, useState } from 'react';
import { getBanners } from '../../../redux/Slices/bannerSlice';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { fetchProductsByCategory } from '../../../redux/Slices/productSlice';
import { useNavigate } from 'react-router-dom';
import StarRating from '../../../components/StarRating';
import { TiTick } from 'react-icons/ti';

const Sarees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { banners } = useSelector((state) => state.banners);
  const { categoryProducts } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [currentIndexSarees, setCurrentIndexSarees] = useState(0);
  const [currentIndexActiveWear, setCurrentIndexActiveWear] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Sarees Top brands');
  
  const intervalRefSarees = useRef(null);
  const intervalRefActiveWear = useRef(null);


    //skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch banners and products
  useEffect(() => {
    dispatch(getBanners());
    dispatch(fetchProductsByCategory(["Sarees Deal", "Sarees Top brands", "Sarees Premium Styles", "Sarees New Launches"]));
  }, [dispatch]);

  useEffect(() => {
  console.log(categoryProducts); // Check if data is fetched
}, [categoryProducts]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };



const sareeCategories = ['Sarees Top brands', 'Sarees Deal', 'Sarees Premium Styles', 'Sarees New Launches'];

const filteredProducts = categoryProducts.filter((item) => {
  if (!item.category?.name) return false;

  return selectedCategory
    ? item.category.name === selectedCategory
    : sareeCategories.includes(item.category.name);
});

console.log(filteredProducts); // Check the filtered result


  // Filter "Sarees" banners
  const sarees = banners.flatMap((banner) =>
    banner.title?.toLowerCase().includes('sarees') && banner.imagesBase64?.length
      ? banner.imagesBase64.map((img) => ({ img: `data:image/jpeg;base64,${img}` }))
      : []
  );

  // Filter "Active Wear" banners
  const activeWear = banners.flatMap((banner) =>
    banner.title?.toLowerCase().includes('styles') && banner.imagesBase64?.length
      ? banner.imagesBase64.map((img) => ({ img: `data:image/jpeg;base64,${img}` }))
      : []
  );

  const totalSlidesSarees = sarees.length;
  const totalSlidesActiveWear = activeWear.length;

  // Auto Slide logic for Sarees
  useEffect(() => {
    if (totalSlidesSarees > 0) {
      startAutoSlideSarees();
    }
    return () => stopAutoSlideSarees();
  }, [totalSlidesSarees]);

  const startAutoSlideSarees = () => {
    stopAutoSlideActiveWear();
    intervalRefSarees.current = setInterval(() => {
      setCurrentIndexSarees((prev) => (prev + 1) % totalSlidesSarees);
    }, 2000);
  };

  const stopAutoSlideSarees = () => {
    if (intervalRefSarees.current) clearInterval(intervalRefSarees.current);
  };

  const handlePrevSarees = () => {
    setCurrentIndexSarees((prev) => (prev - 1 + totalSlidesSarees) % totalSlidesSarees);
    startAutoSlideSarees();
  };

  const handleNextSarees = () => {
    setCurrentIndexSarees((prev) => (prev + 1) % totalSlidesSarees);
    startAutoSlideSarees();
  };

  // Auto Slide logic for Active Wear
  useEffect(() => {
    if (totalSlidesActiveWear > 0) {
      startAutoSlideActiveWear();
    }
    return () => stopAutoSlideActiveWear();
  }, [totalSlidesActiveWear]);

  const startAutoSlideActiveWear = () => {
    stopAutoSlideSarees();
    intervalRefActiveWear.current = setInterval(() => {
      setCurrentIndexActiveWear((prev) => (prev + 1) % totalSlidesActiveWear);
    }, 2000);
  };

  const stopAutoSlideActiveWear = () => {
    if (intervalRefActiveWear.current) clearInterval(intervalRefActiveWear.current);
  };

  const handlePrevActiveWear = () => {
    setCurrentIndexActiveWear((prev) => (prev - 1 + totalSlidesActiveWear) % totalSlidesActiveWear);
    startAutoSlideActiveWear();
  };

  const handleNextActiveWear = () => {
    setCurrentIndexActiveWear((prev) => (prev + 1) % totalSlidesActiveWear);
    startAutoSlideActiveWear();
  };

  // Dot Indicator click handler for Sarees
  const handleDotClickSarees = (index) => {
    setCurrentIndexSarees(index);
  };

  // Dot Indicator click handler for Active Wear
  const handleDotClickActiveWear = (index) => {
    setCurrentIndexActiveWear(index);
  };

  return (
    <div>
      <AmazonFashion />
      <div className='flex flex-col md:flex-row'>
        {/* Sidebar */}
        <div className='w-64 border-r px-4 mx-2 border-gray-200'>
          <h1 className='text-medium font-semibold'>Category</h1>
          <Clothing />
          <h1 className='text-sm font-semibold px-4 mt-1'>Sarees</h1>

          {/* Amazon Prime Filter */}
          <div className="mt-3">
            {loading ? (
              <>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-36 h-3 bg-gray-100 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-sm">Amazon Prime</h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-orange-400"
                    // checked={primeOnly}
                    // onChange={() => setPrimeOnly(!primeOnly)}
                  />
                  <TiTick className="text-orange-400 text-lg" />
                  <span className="text-blue-500 font-bold">prime</span>
                </label>
              </>
            )}
          </div>
          
          {/* Delivery Day Filter */}
          <div className="mt-3">
            {loading ? (
              <>
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-40 h-3 bg-gray-100 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-sm">Delivery Day</h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-orange-400"
                    // checked={deliveryTomorrowOnly}
                    // onChange={() => setDeliveryTomorrowOnly(!deliveryTomorrowOnly)}
                  />
                  <span className="ml-1 text-sm">Get It by Tomorrow</span>
                </label>
              </>
            )}
          </div>
          
          
                    {/* Review */}
                  {/* Customer Reviews */}
          <div className="mb-1 text-sm mt-4">
            {loading ? (
              <>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h1 className="font-bold text-sm">Customer Reviews</h1>
                <p>
                  <span className="text-yellow-500 text-xl">★★★★☆</span> & up
                </p>
              </>
            )}
          </div>
          
          {/* Deals & Discounts */}
          <div className="mt-3">
            {loading ? (
              <>
                <div className="w-36 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-28 h-3 bg-gray-100 rounded animate-pulse mb-1"></div>
                <div className="w-32 h-3 bg-gray-100 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h1 className="font-semibold text-sm">Deals & Discounts</h1>
                <p>All Discounts</p>
                <p>Today's Deal</p>
              </>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className='w-full'>
          {/* Sarees Images */}
          <div className='flex flex-wrap'>
            <img
              src='https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/Sareestore/PC/desktop-Part1_01.jpg'
              alt='Saree Part 1'
              className='w-full max-w-md h-auto object-cover'
            />
            <img
              src='https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/Sareestore/PC/desktop-Part1_02.jpg'
              alt='Saree Part 2'
              className='w-full max-w-md h-auto object-cover'
            />
          </div>

          {/* Sarees Banner Carousel */}
          {sarees.length > 0 && (
            <div className='relative mt-4'>
              <img
                src={sarees[currentIndexSarees].img}
                alt='Saree Banner'
                className='w-full h-96 object-cover rounded'
              />
              <button
                onClick={handlePrevSarees}
                className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white px-2 py-4 shadow'
              >
                <IoIosArrowBack />
              </button>
              <button
                onClick={handleNextSarees}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white px-2 py-4 shadow'
              >
                <IoIosArrowForward />
              </button>

              <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                {sarees.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleDotClickSarees(index)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${index === currentIndexSarees ? 'bg-blue-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          )}
          {/* sarees  */}
<div>
<img src="https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/Sareestore/PC/desktop-Part1_03._CB600039072_.jpg" alt="" />

</div>

<img src="https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/Sareestore/PC/desktop-Part1_11._CB600039075_.jpg" alt="" />
          {/* Active Wear Banner Carousel */}
          {activeWear.length > 0 && (
            <div className='relative mt-4'>
              <img
                src={activeWear[currentIndexActiveWear].img}
                alt='Active Wear Banner'
                className='w-full h-full object-cover rounded'
              />
              <button
                onClick={handlePrevActiveWear}
                className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white px-2 py-4 shadow'
              >
                <IoIosArrowBack />
              </button>
              <button
                onClick={handleNextActiveWear}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white px-2 py-4 shadow'
              >
                <IoIosArrowForward />
              </button>

              <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                {activeWear.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleDotClickActiveWear(index)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${index === currentIndexActiveWear ? 'bg-blue-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Buttons */}
         <div className='flex space-x-3 border border-gray-300 rounded-md p-3 bg-white shadow-sm'>
  {['Sarees Top brands', 'Sarees Deal', 'Sarees Premium Styles', 'Sarees New Launches'].map((category) => (
    <button
      key={category}
      className={`px-4 py-2 cursor-pointer rounded-md font-medium transition-colors duration-300 focus:outline-none
        ${
          selectedCategory === category
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
        }`}
      onClick={() => handleCategoryClick(category)}
    >
      {category.replace('Sarees ', '')}
    </button>
  ))}
</div>


          {/* Display filtered products */}
          <div>
  {filteredProducts.length === 0 ? (
    <p>No products found in this category.</p>
  ) : (
    <div className='grid grid-cols-2'>
      {filteredProducts.map((item, index) => (
        <div key={index}>
          <div className='bg-gradient-to-tl from-gray-200 via-white to-gray-300 items-center justify-center flex'>
            <img
              src={item.images?.[0]}
              alt={item.title}
              className='w-full h-54 object-contain cursor-pointer rounded mix-blend-darken'
               onClick={() => navigate(`/product/view/${item.id}`, {
      state: { from: 'Clothing & Accessories/Women/Ethnic Wear/Sarees' }
    })}
            />
          </div>
          <div className='p-2'>
            <p className='font-semibold'>{item.brand?.name}</p>
            <p>{item.description.slice(0, 70)}...</p>
            <div className='flex items-center gap-1'>
              <StarRating rating={item.ratingsAverage || 0} />
              <span className='text-xs text-gray-600'>({item.ratingsCount || 0})</span>
            </div>
            <div className='flex gap-1 text-sm font-semibold'>
              <p>
                {(item.price * (1 - item.discount / 100)).toFixed(0)}{' '}
                <span className='text-gray-500 line-through text-sm ml-2'>
                  M.R.P ₹{item.price}
                </span>
              </p>
              <p className='text-sm'>({item.discount}% off)</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        </main>
      </div>
    </div>
  );
};

export default Sarees;
