import React, { Children } from 'react'


  const Field = ({label, error,required,Children,hint}) => (
    <div className='mb-4'>
      <label className='block text-sm font-semibold text-gray-300 mb-1'>
        {label} {required && <span className='text-red-400'>*</span>}
      </label>
      {Children}
      {hint && <p className='text-xs text-gray-500 mt-1'>{hint}</p>}
      {error && <p className='text-red-400 text-xs mt-1 flex items-center gap-1'><MdError size/>{error}</p>}
    </div>
  )

  const inputCls = (err) => `w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-[#FF9900]/60 focus:border-[#FF9900] ${err ? "border-red-500" :"border-white/10 hover:border-white/20"}`;

  const SIZES = ["XS","S","M","L","XL","XXL","XXXL","28","30","32","34","36","38","40","42"];
  const GENDERS = ["men","women","unisex","boys","girls","kids"];
  const AGE_GROUPS = ["adults","teen","kids","infant"];
  const STATUSES = ["draft","active","inactive"];
  const SHIPPING_CLASSES = ["standard","express","overnight","free"];

const CreateProducts = () => {
  const navigate = useNavigate();
  const imgRef = useRef();


  
  return (
    <div className='text-white'>
      
    </div>
  )
}

export default CreateProducts