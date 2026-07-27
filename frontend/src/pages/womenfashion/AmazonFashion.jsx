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

const menMenu = {
    columns:[
        {
            heading:"CLOTHING",
            headingLink:"/men/clothing",
            items:[
                mk("T-Shirts & Polos","/men/clothing.tshirts-polos"),
                mk("Shirts","/men/clothing/shirts"),
                mk("Trousers","/men/clothing/trousers"),
                mk("Jeans","/men/clothing/jeans"),
                mk("Innerwear","/men/clothing/innerwear"),
                mk("Sportswear","/men/clothing/sportswear"),
                mk("Sleep & Lounge Wear","/men/clothing/sleep-lounge-wear"),
                mk("Ethnic wear","/men/clothing/ethnic-wear"),
                mk("Ties, Socks & Belts","/men/clothing/suits-blazers"),
                mk('Suits & Blazers', '/men/clothing/suits-blazers'),
                mk('Sweaters', '/men/clothing/sweaters'),
                mk('Jackets & Coats', '/men/clothing/jackets-coats'),
            ],
        },
        {
            heading:"SHOES",
            headingLink:"/men/shoes",
            items:[
                mk("Sports Shoes","/men/shoes/sports-shoes"),
                mk("Formal Shoes","/men/shoes/formal-shoes"),
                mk("Casual Shoes","/men/shoes/casual-shoes"),
                mk("Sneakers","/men/shoes/sneakers"),
                mk("Loafers & Mocassins","/men/shoes/loafers-mocassins"),
                mk("Flip-Flops","/men/shoes/flip-flops"),
                mk("Boots","/men/shoes/boots"),
                mk("Sandals & Floaters","/men/shoes/sandals-floaters"),
                mk("Thong Sandals","/men/shoes/thong-sandals"),
                mk("Boat Shoes","/men/shoes/boat-shoes"),
            ],
        },
        {
      heading: 'WATCHES',
      headingLink: '/men/watches',
      items: [
        mk('Metallic', '/men/watches/metallic'),
        mk('Chronographs', '/men/watches/chronographs'),
        mk('Leather', '/men/watches/leather'),
      ],
      extra: {
        heading: 'JEWELLERY',
        headingLink: '/men/jewellery',
        items: [mk('Rings', '/men/jewellery/rings'), mk('Bracelets', '/men/jewellery/bracelets')],
            },
            extra2:{
                heading:"EYEWEAR",
                headingLink:"/men/eyewear",
                items:[mk("Sunglasses","/men/eyewear/sunglasses"),mk("Spectacle Frames","/men/eyewear/spectacle-Frames")],

            },
            extra3:{
                heading:"WALLETS",
                headingLink:"/men/wallets",
                items:[],
            },
        },
    ],
     promos: [
    { label: "Men's Clothing", cta: 'Explore Store', link: '/men/clothing', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=380&fit=crop' },
    { label: 'Running Shoes', cta: 'See More', link: '/men/shoes/sports-shoes', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=380&fit=crop' },
    { label: 'MAX | Just Launched', cta: 'Explore Store', link: '/brands/max', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=380&fit=crop' },
  ],

 
}
 const kidsMenu = {
   columns:[
    {
        heading:"BOYS CLOTHING",
        headingLink:"/kids/boys/clothing",
        items:[
            mk("T-Shirts","/kids/boys/clothing/tshirts"),
            mk("Shirts","/kids/boys/clothing/shirts"),
            mk("Shorts","/kids/boys/clothing/shorts"),
            mk("Jeans","/kids/boys/clothing/jeans"),
            mk("Ethnic Wear","/kids/boys/clothing/ethnic-wear"),
            mk('Innerwear', '/kids/boys/clothing/innerwear'),
            mk('Winter Wear', '/kids/boys/clothing/winter-wear'),
        ],
    },
    {
        heading:"GIRLS CLOTHING",
        headingLink:"/kids/girls/clothing",
        items:[
            mk("Dresses","/kids/girls/clothing/dresses"),
            mk("Tops & Tees","/kids/girls/clothing/tops-tees"),
            mk("Ethnic wear","/kids/girls/clothing/ethnic-wear"),
            mk("Jeans & Leggings","/kids/girls/clothing/jeans-leggings"),
            mk("Innerwear","/kids/girls/clothing/innerwear"),
            mk("winter wear","/kids/girls/clothing/winter-wear"),
        ],
    },
    {
        heading:"SHOES",
        headingLink:"/kids/shoes",
        items:[
            mk("")
        ]
    }
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