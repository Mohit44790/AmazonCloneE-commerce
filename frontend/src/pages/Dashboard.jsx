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

                    </span>
                )}

            </div>

        </div>
    )
}

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard