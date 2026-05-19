import React, { useState } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { MdClose, MdChevronRight, MdPerson } from "react-icons/md";
/* ─────────────────────────────────────────────
   NAV LIST — bottom strip links
───────────────────────────────────────────── */
const NAV_LIST = [
    {name:"Fresh" , link:"/fresh", hasDropdown:true},
    {name:"MX Player" ,link:"/mx-player" },
    {name:"Sell" , link:"/sell"},
    {name:"BestSellers", link:"/bestsellers"},
    {name:"Today 's Deals" ,link:"/deals"},
    {name:"Mobiles",link:"/mobiles"},
    {name:"New Releases" , link:"new-releases"},
    {name:"Customer Service" , link:"customer-service"},
    {name:"Prime" , link:"/prime" ,hasDropdown:true},
    {name:"Amazon Pay", link:"/pay"},
    {name:"Electronics", link:"/electronics"},
    {name:"Fashion", link:"/fashion"},
    {name:"Home & Kitchen", link:",home-kitchen"}
];

const ALL_MENU = [
    {section :"Trending", items:[{label:"Bestsellers", link:"/bestsellers"},
        {label:"New Releases" , link:"/new-releases"},
        {label:"Movers and Shake",link:"/movers"}
    ]},
    {section:"Digital Content and Devices",items:{label:"Echo & Alexa" , link:"/alexa" , a}}
]


const AllSideBar = () => {
    const [allOpen,setAllOpen] = useState(false);
  return (
   <>
    <div className="bg-[#232f3e] flex items-center gap-0 px-2 py-0.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
{/* ☰ All button — opens sidebar */}

<button onClick={()=> setAllOpen(true)} className='flex items-center gap-1.5 text-white text-[13px] font-bold px-3 py-2 rounded border-2 border-transparent hover:border-white transition-colors shrink-0 cursor-pointer '>
     <span className="text-[16px] leading-none">☰</span>
            <span>All</span>
</button>

{NAV_LIST.map((item)=>(
    <Link key={item.name} to={item.link}    className="flex items-center gap-0.5 text-white text-[13px] px-3 py-1.5 rounded border-2 border-transparent hover:border-white transition-colors shrink-0 whitespace-nowrap">
          {item.name}
              {item.hasDropdown && <IoMdArrowDropdown size={14} />}
    </Link>
))}
   </div>

    {/* ══════════════════════════════════════
          ALL MENU SIDEBAR DRAWER
      ══════════════════════════════════════ */}
      {allOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 transition-opacity" onClick={()=> setAllOpen(false)}/>
            
    )}
    {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${allOpen ? "translate-x-0" : "-translate-x-full"}`}>
       {/* Drawer Header */}

       <div className="bg-[#232f3e] flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
            <div className='bg-white rounded-full p-1.5'>
                <MdPerson size={20} className="text-[#232f3e]"/>

            </div>
             <span className="text-white font-bold text-[16px]">Hello</span>

        </div>
        <button onClick={()=> setAllOpen(false)} className='text-white hover:text-gray-300 transition-colors cursor-pointer p-1 rounded hover:bg-white/10'> <MdClose size={22} /></button>

       </div>

       {/* Drawer Body — scrollable */}
       <div>

       </div>

        {/* Bottom padding */}
          <div className="h-8" />
    </div>
   </>
  )
}

export default AllSideBar