import React,{useState, useRef} from 'react'
// ---------- Helper to quickly build {label, link} item lists ----------
const mk = (label, link) => ({ label, link })
 
// ---------- Mega-menu data (columns) for each top-level tab ----------
// Har column: { heading, headingLink, items: [{label, link}], extra / extra2 / extra3 for sub-sections }
const womenMenu = {
    columns:[
        {heading:"CLOTHING",
            headingLink: '/women/clothing',
           items: [
        mk('New Arrivals', '/women/clothing/new-arrivals'),
        mk('Top Brands', '/women/clothing/top-brands'),
        mk('All Western Wear', '/women/clothing/western-wear'),
        mk('Shirts, Tops & Tees', '/women/clothing/shirts-tops-tees'),
        mk('Dresses', '/women/clothing/dresses'),
        mk('Jeans & Jeggings', '/women/clothing/jeans-jeggings'),
        mk('All Ethnic Wear', '/women/clothing/ethnic-wear'),
        mk('Kurtas', '/women/clothing/kurtas'),
        mk('Salwar Suits', '/women/clothing/salwar-suits'),
        mk('Sarees', '/women/clothing/sarees'),
        mk('Lingerie, Sleep & Lounge', '/women/clothing/lingerie-sleep-lounge'),
        mk('Sportswear', '/women/clothing/sportswear'),
      ],
      extra: {
        heading: 'HANDLOOMS & HANDICRAFTS',
        headingLink: '/women/handlooms-handicrafts',
        items: [],
      },
    },
    {
      heading: 'SHOES',
      headingLink: '/women/shoes',
      items: [
        mk('Fashion Sandals', '/women/shoes/fashion-sandals'),
        mk('Pumps & Peeptoes', '/women/shoes/pumps-peeptoes'),
        mk('Casual Slippers', '/women/shoes/casual-slippers'),
        mk('Casual Shoes', '/women/shoes/casual-shoes'),
        mk('Boots', '/women/shoes/boots'),
        mk('Sports Shoes', '/women/shoes/sports-shoes'),
        mk('Flip-Flops', '/women/shoes/flip-flops'),
        mk('Ballet Flats', '/women/shoes/ballet-flats'),
        mk('Ethnic Footwear', '/women/shoes/ethnic-footwear'),
        mk('Formal Shoes', '/women/shoes/formal-shoes'),
      ],
    },
    ]
}
// ---------- Main component ----------

const AmazonFashion = () => {
    const [activeTab, setActiveTab] = useState(null);
    const closeTimer = useRef(null);

      // Chhota sa delay taaki tab se dropdown tak mouse move karte waqt menu flicker na kare
    const openTab = (key) => {
        if(closeTimer.current) clearTimeout(closeTimer.current)
            setActiveTab(key)
    }  
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setActiveTab(null),150)
    }

    // const activeData = NAV_TABS.find((t) => t.key === activeTab)?.data
  return (
    <div className='w-full font-sans ng-white relative'>
        {/*Tob bar*/}
        <div className='flex items-center px-6 py-4 border-b border-gray-200'>
            <h1 className='text-2xl font-bold text-gray-900 mr-10'>Amazon Fashion</h1>

        </div>
        
    </div>
  )
}

export default AmazonFashion