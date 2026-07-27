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
    {
        heading:"WATCHES",
        headingLink:"/women/watches",
        items:[
            mk('Gold & rose-gold',"/women/watches/gold-rose-gold"),
            mk("Stainless steel" ,"/women/watches/stainless-steel"),
            mk("Leather","/women/watches/leather"),
        ],
        extra:{
            heading:"JEWELLERY",
            headingLink:"/women/jewellery",
            items:[
                mk("GOLD & Diamond Jewellery","/women/jewellery/gold-diamond"),
                mk("Traditional Imitation","/women/jewellery/traditional-imitation"),
                mk("Fashion Jewellery","/women/jewellery/fashion-jewellery"),
                mk("Silver Jewellery","/women/jewellery/sliver-jewellery"),
            ],
        },
    },
    ],
     promos: [
    { label: "Women's Clothing", cta: 'Explore Store', link: '/women/clothing', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300&h=380&fit=crop' },
    { label: 'Silver Jewellery', cta: 'Explore Store', link: '/women/jewellery/silver-jewellery', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=380&fit=crop' },
    { label: 'MAX | Just Launched', cta: 'Explore Store', link: '/brands/max', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=380&fit=crop' },
  ],
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