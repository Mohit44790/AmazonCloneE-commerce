import React from 'react'


const Stars = ({ avg = 0, count }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <MdStar key={i} size={13} className={i<=Math.round(avg)?"text-[#FF9900]":"text-gray-300"}/>
    ))}
    {count !== undefined && <span className="text-xs text-gray-500 ml-0.5">({count})</span>}
  </div>
);

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard