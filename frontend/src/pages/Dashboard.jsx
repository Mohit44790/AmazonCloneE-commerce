import React from 'react'
import { useNavigate } from 'react-router-dom';

// * ── Star Rating ── */
const Stars = ({ avg = 0, count }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <MdStar key={i} size={13} className={i<=Math.round(avg)?"text-[#FF9900]":"text-gray-300"}/>
    ))}
    {count !== undefined && <span className="text-xs text-gray-500 ml-0.5">({count})</span>}
  </div>
);

/* ── Product Card ── */
const ProductCard = ({p}) => {
    const addToCart = useCartStore(s => s.addItem);
    const navigate = useNavigate();
    return(
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer border-gray-100"
        onClick={() => navigate(`/product/${p.slug}`)}>
            <div className="aspect-square overflow-hidden bg-gray-50 relative">
                <img src={p.images?.[0]?.url || "/placeholder.jpg"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                {p.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2">
    -{p.discount}%
                    </span>
                )}
                 {p.isBestSeller && (
          <span className="absolute top-2 right-2 bg-[#FF9900] text-black text-[10px] font-bold px-2 py-0.5 rounded">
            BESTSELLER
          </span>
        )}

            </div>
            <div className="p-3">
        <p className="text-gray-800 text-sm font-medium leading-tight line-clamp-2 mb-1">{p.name}</p>
        <Stars avg={p.rating?.average} count={p.rating?.count}/>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-gray-900 font-bold text-base">₹{p.finalPrice?.toLocaleString() || p.price?.toLocaleString()}</span>
          {p.comparePrice && <span className="text-gray-400 text-xs line-through">₹{p.comparePrice?.toLocaleString()}</span>}
        </div>
        {p.shipping?.freeShipping && (
          <p className="text-green-600 text-[11px] mt-1 flex items-center gap-1"><MdLocalShipping size={12}/> FREE Delivery</p>
        )}
        <button
          onClick={e => { e.stopPropagation(); addToCart(p); }}
          className="w-full mt-2 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 text-xs font-bold rounded-full transition-colors">
          Add to Cart
        </button>
      </div>

        </div>
    );
};

/* ── Section Header ── */
const SectionHeader = ({ title, subtitle, to }) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {to && (
      <Link to={to} className="flex items-center gap-1 text-[#0066c0] hover:text-[#c45500] text-sm font-medium">
        See all <MdArrowForward size={16}/>
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard