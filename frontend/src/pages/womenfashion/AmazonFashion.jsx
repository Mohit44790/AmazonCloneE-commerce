import React, { useState, useRef } from 'react'

// ---------- Helper to quickly build {label, link} item lists ----------
const mk = (label, link) => ({ label, link })

// ---------- Mega-menu data (columns) for each top-level tab ----------
// Har column: { heading, headingLink, items: [{label, link}], extra / extra2 / extra3 for sub-sections }

const womenMenu = {
  columns: [
    {
      heading: 'CLOTHING',
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
      heading: 'WATCHES',
      headingLink: '/women/watches',
      items: [
        mk('Gold & rose-gold', '/women/watches/gold-rose-gold'),
        mk('Stainless steel', '/women/watches/stainless-steel'),
        mk('Leather', '/women/watches/leather'),
      ],
      extra: {
        heading: 'JEWELLERY',
        headingLink: '/women/jewellery',
        items: [
          mk('Gold & Diamond Jewellery', '/women/jewellery/gold-diamond'),
          mk('Traditional Imitation', '/women/jewellery/traditional-imitation'),
          mk('Fashion Jewellery', '/women/jewellery/fashion-jewellery'),
          mk('Silver Jewellery', '/women/jewellery/silver-jewellery'),
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
  columns: [
    {
      heading: 'CLOTHING',
      headingLink: '/men/clothing',
      items: [
        mk('T-Shirts & Polos', '/men/clothing/tshirts-polos'),
        mk('Shirts', '/men/clothing/shirts'),
        mk('Trousers', '/men/clothing/trousers'),
        mk('Jeans', '/men/clothing/jeans'),
        mk('Innerwear', '/men/clothing/innerwear'),
        mk('Sportswear', '/men/clothing/sportswear'),
        mk('Sleep & Lounge Wear', '/men/clothing/sleep-lounge-wear'),
        mk('Ethnic Wear', '/men/clothing/ethnic-wear'),
        mk('Ties, Socks & Belts', '/men/clothing/ties-socks-belts'),
        mk('Suits & Blazers', '/men/clothing/suits-blazers'),
        mk('Sweaters', '/men/clothing/sweaters'),
        mk('Jackets & Coats', '/men/clothing/jackets-coats'),
      ],
    },
    {
      heading: 'SHOES',
      headingLink: '/men/shoes',
      items: [
        mk('Sports Shoes', '/men/shoes/sports-shoes'),
        mk('Formal Shoes', '/men/shoes/formal-shoes'),
        mk('Casual Shoes', '/men/shoes/casual-shoes'),
        mk('Sneakers', '/men/shoes/sneakers'),
        mk('Loafers & Mocassins', '/men/shoes/loafers-mocassins'),
        mk('Flip-Flops', '/men/shoes/flip-flops'),
        mk('Boots', '/men/shoes/boots'),
        mk('Sandals & Floaters', '/men/shoes/sandals-floaters'),
        mk('Thong Sandals', '/men/shoes/thong-sandals'),
        mk('Boat Shoes', '/men/shoes/boat-shoes'),
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
      extra2: {
        heading: 'EYEWEAR',
        headingLink: '/men/eyewear',
        items: [mk('Sunglasses', '/men/eyewear/sunglasses'), mk('Spectacle Frames', '/men/eyewear/spectacle-frames')],
      },
      extra3: {
        heading: 'WALLETS',
        headingLink: '/men/wallets',
        items: [],
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
  columns: [
    {
      heading: 'BOYS CLOTHING',
      headingLink: '/kids/boys/clothing',
      items: [
        mk('T-Shirts', '/kids/boys/clothing/tshirts'),
        mk('Shirts', '/kids/boys/clothing/shirts'),
        mk('Shorts', '/kids/boys/clothing/shorts'),
        mk('Jeans', '/kids/boys/clothing/jeans'),
        mk('Ethnic Wear', '/kids/boys/clothing/ethnic-wear'),
        mk('Innerwear', '/kids/boys/clothing/innerwear'),
        mk('Winter Wear', '/kids/boys/clothing/winter-wear'),
      ],
    },
    {
      heading: 'GIRLS CLOTHING',
      headingLink: '/kids/girls/clothing',
      items: [
        mk('Dresses', '/kids/girls/clothing/dresses'),
        mk('Tops & Tees', '/kids/girls/clothing/tops-tees'),
        mk('Ethnic Wear', '/kids/girls/clothing/ethnic-wear'),
        mk('Jeans & Leggings', '/kids/girls/clothing/jeans-leggings'),
        mk('Innerwear', '/kids/girls/clothing/innerwear'),
        mk('Winter Wear', '/kids/girls/clothing/winter-wear'),
      ],
    },
    {
      heading: 'SHOES',
      headingLink: '/kids/shoes',
      items: [
        mk("Boys' Shoes", '/kids/shoes/boys'),
        mk("Girls' Shoes", '/kids/shoes/girls'),
        mk('Sandals', '/kids/shoes/sandals'),
        mk('Sports Shoes', '/kids/shoes/sports-shoes'),
        mk('School Shoes', '/kids/shoes/school-shoes'),
      ],
      extra: {
        heading: 'TOYS & ACCESSORIES',
        headingLink: '/kids/toys-accessories',
        items: [
          mk('Backpacks', '/kids/toys-accessories/backpacks'),
          mk('Watches', '/kids/toys-accessories/watches'),
          mk('Toys', '/kids/toys-accessories/toys'),
        ],
      },
    },
  ],
  promos: [
    { label: "Kids' Clothing", cta: 'Explore Store', link: '/kids/clothing', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&h=380&fit=crop' },
    { label: 'School Essentials', cta: 'See More', link: '/kids/school-essentials', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=300&h=380&fit=crop' },
  ],
}

const bagsMenu = {
  columns: [
    {
      heading: 'BAGS',
      headingLink: '/bags-luggage/bags',
      items: [
        mk('Handbags', '/bags-luggage/bags/handbags'),
        mk('Backpacks', '/bags-luggage/bags/backpacks'),
        mk('Clutches', '/bags-luggage/bags/clutches'),
        mk('Wallets', '/bags-luggage/bags/wallets'),
        mk('Travel Duffles', '/bags-luggage/bags/travel-duffles'),
        mk('Laptop Bags', '/bags-luggage/bags/laptop-bags'),
      ],
    },
    {
      heading: 'LUGGAGE',
      headingLink: '/bags-luggage/luggage',
      items: [
        mk('Hard-sided Luggage', '/bags-luggage/luggage/hard-sided'),
        mk('Soft-sided Luggage', '/bags-luggage/luggage/soft-sided'),
        mk('Cabin Luggage', '/bags-luggage/luggage/cabin'),
        mk('Trolley Bags', '/bags-luggage/luggage/trolley-bags'),
        mk('Duffle Bags', '/bags-luggage/luggage/duffle-bags'),
      ],
    },
  ],
  promos: [
    { label: 'Bags & Luggage', cta: 'Explore Store', link: '/bags-luggage', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=380&fit=crop' },
    { label: 'Travel Essentials', cta: 'See More', link: '/bags-luggage/travel-essentials', image: 'https://images.unsplash.com/photo-1553341640-9397992456f6?w=300&h=380&fit=crop' },
  ],
}

const sportswearMenu = {
  columns: [
    {
      heading: 'MEN',
      headingLink: '/sportswear/men',
      items: [
        mk('Running shoes', '/sportswear/men/running-shoes'),
        mk('Training shoes', '/sportswear/men/training-shoes'),
        mk('Walking shoes', '/sportswear/men/walking-shoes'),
        mk('Football shoes', '/sportswear/men/football-shoes'),
        mk('Trekking shoes', '/sportswear/men/trekking-shoes'),
        mk('Sports t-shirts', '/sportswear/men/sports-tshirts'),
        mk('Shorts', '/sportswear/men/shorts'),
        mk('Track pants', '/sportswear/men/track-pants'),
        mk('Swimwear', '/sportswear/men/swimwear'),
        mk('Sweatshirts', '/sportswear/men/sweatshirts'),
        mk('Gym bags', '/sportswear/men/gym-bags'),
        mk('Accessories', '/sportswear/men/accessories'),
      ],
    },
    {
      heading: 'WOMEN',
      headingLink: '/sportswear/women',
      items: [
        mk('Running shoes', '/sportswear/women/running-shoes'),
        mk('Training shoes', '/sportswear/women/training-shoes'),
        mk('Walking shoes', '/sportswear/women/walking-shoes'),
        mk('Trekking shoes', '/sportswear/women/trekking-shoes'),
        mk('Sports t-shirts', '/sportswear/women/sports-tshirts'),
        mk('Sports bras', '/sportswear/women/sports-bras'),
        mk('Tights & leggings', '/sportswear/women/tights-leggings'),
        mk('Shorts', '/sportswear/women/shorts'),
        mk('Swimwear', '/sportswear/women/swimwear'),
        mk('Sweatshirts', '/sportswear/women/sweatshirts'),
        mk('Gym bags', '/sportswear/women/gym-bags'),
        mk('Accessories', '/sportswear/women/accessories'),
      ],
    },
    {
      heading: 'KIDS',
      headingLink: '/sportswear/kids',
      items: [
        mk("Boys' Clothing", '/sportswear/kids/boys-clothing'),
        mk("Boys' Shoes", '/sportswear/kids/boys-shoes'),
        mk("Girls' Clothing", '/sportswear/kids/girls-clothing'),
        mk("Girls' Shoes", '/sportswear/kids/girls-shoes'),
      ],
      extra: {
        heading: 'ACCESSORIES',
        headingLink: '/sportswear/kids/accessories',
        items: [
          mk('Backpacks', '/sportswear/kids/accessories/backpacks'),
          mk('Gym Bags', '/sportswear/kids/accessories/gym-bags'),
          mk('Sports Watches', '/sportswear/kids/accessories/sports-watches'),
        ],
      },
    },
    {
      heading: 'TOP BRANDS',
      headingLink: '/sportswear/top-brands',
      items: [
        mk('Puma', '/sportswear/top-brands/puma'),
        mk('adidas', '/sportswear/top-brands/adidas'),
        mk('Reebok', '/sportswear/top-brands/reebok'),
        mk('Skechers', '/sportswear/top-brands/skechers'),
        mk('Asics', '/sportswear/top-brands/asics'),
        mk('Fila', '/sportswear/top-brands/fila'),
        mk('Speedo', '/sportswear/top-brands/speedo'),
        mk('New Balance', '/sportswear/top-brands/new-balance'),
        mk('Nike', '/sportswear/top-brands/nike'),
      ],
      extra: {
        heading: 'SPORTS AND FITNESS GEAR',
        headingLink: '/sportswear/fitness-gear',
        items: [
          mk('Cricket', '/sportswear/fitness-gear/cricket'),
          mk('Badminton', '/sportswear/fitness-gear/badminton'),
          mk('Exercise and Fitness', '/sportswear/fitness-gear/exercise-fitness'),
        ],
      },
    },
  ],
  promos: [
    { label: "Men's sportswear", cta: 'See More', link: '/sportswear/men', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=380&fit=crop' },
    { label: "Women's sportswear", cta: 'See More', link: '/sportswear/women', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=380&fit=crop' },
  ],
}

const salesMenu = {
  columns: [],
  grid: [
    { label: 'Clothing', sub: '40% - 70% off', link: '/deals/clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=250&h=250&fit=crop' },
    { label: 'Shoes', sub: '40% - 70% off', link: '/deals/shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=250&h=250&fit=crop' },
    { label: 'Watches', sub: '40% - 70% off', link: '/deals/watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=250&h=250&fit=crop' },
    { label: 'Bags & Luggage', sub: '40% - 70% off', link: '/deals/bags-luggage', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=250&h=250&fit=crop' },
    { label: 'Jewellery', sub: 'Minimum 70% off', link: '/deals/jewellery', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=250&h=250&fit=crop' },
    { label: 'Sunglasses', sub: '40% - 80% off', link: '/deals/sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=250&h=250&fit=crop' },
  ],
}

const NAV_TABS = [
  { key: 'women', label: 'Women', data: womenMenu },
  { key: 'men', label: 'Men', data: menMenu },
  { key: 'kids', label: 'Kids', data: kidsMenu },
  { key: 'bags', label: 'Bags & Luggage', data: bagsMenu },
  { key: 'sportswear', label: 'Sportswear', data: sportswearMenu },
  { key: 'sales', label: 'Sales & Deals', data: salesMenu },
]

// ---------- Column renderer (heading + items are both links; handles extra/extra2/extra3 sub-sections) ----------

const Section = ({ heading, headingLink, items }) => (
  <div className="mb-4">
    <a
      href={headingLink}
      className="text-xs font-bold text-gray-800 tracking-wide mb-2 block hover:text-orange-600 hover:underline"
    >
      {heading}
    </a>
    {items.length > 0 && (
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label}>
            <a href={item.link} className="text-sm text-gray-700 hover:text-orange-600 hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const Column = ({ col }) => (
  <div className="min-w-[170px]">
    <Section heading={col.heading} headingLink={col.headingLink} items={col.items} />
    {['extra', 'extra2', 'extra3'].map((key) => (col[key] ? <Section key={key} {...col[key]} /> : null))}
  </div>
)

// ---------- Mega dropdown panel ----------

const MegaMenu = ({ data }) => {
  if (data.grid) {
    // Sales & Deals: simple promo grid, no columns
    return (
      <div className="grid grid-cols-6 gap-6 p-6">
        {data.grid.map((g) => (
          <a key={g.label} href={g.link} className="text-center block group">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={g.image}
                alt={g.label}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="font-semibold text-sm mt-2">{g.label}</p>
            <p className="text-xs text-gray-600">{g.sub}</p>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="flex p-6 gap-10">
      <div className="flex gap-10 flex-1">
        {data.columns.map((col, i) => (
          <Column col={col} key={i} />
        ))}
      </div>
      <div className="flex gap-4 shrink-0">
        {data.promos.map((p) => (
          <a key={p.label} href={p.link} className="text-center block w-32 group">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={p.image}
                alt={p.label}
                className="w-32 h-40 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="font-semibold text-sm mt-2">{p.label}</p>
            <p className="text-xs text-blue-600 hover:underline">{p.cta}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

// ---------- Main component ----------

const AmazonFashion = () => {
  const [activeTab, setActiveTab] = useState(null)
  const closeTimer = useRef(null)

  // Chhota sa delay taaki tab se dropdown tak mouse move karte waqt menu flicker na kare
  const openTab = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveTab(key)
  }

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveTab(null), 150)
  }

  const activeData = NAV_TABS.find((t) => t.key === activeTab)?.data

  return (
    <div className="w-full font-sans bg-white z-50 relative">
      {/* Top bar */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mr-10">Amazon Fashion</h1>

        <nav className="flex gap-8" onMouseLeave={scheduleClose}>
          {NAV_TABS.map((tab) => (
            <div key={tab.key} onMouseEnter={() => openTab(tab.key)} className="relative">
              <button
                className={`flex items-center gap-1 text-sm font-medium pb-1 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-800 border-transparent hover:text-blue-600'
                }`}
              >
                {tab.label}
                <svg
                  className={`w-3 h-3 mt-0.5 transition-transform ${activeTab === tab.key ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* Dropdown mega menu — ek hi jagah render hota hai, active tab ke hisaab se content badalta hai */}
      {activeTab && activeData && (
        <div
          onMouseEnter={() => openTab(activeTab)}
          onMouseLeave={scheduleClose}
          className="absolute left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-xl"
        >
          <MegaMenu data={activeData} />
        </div>
      )}
    </div>
  )
}

export default AmazonFashion