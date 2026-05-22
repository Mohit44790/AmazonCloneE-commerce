import React, { useState, useEffect } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { MdClose, MdChevronRight, MdPerson, MdArrowBack } from "react-icons/md";

/* ─────────────────────────────────────────────
   NAV LIST — bottom strip links
───────────────────────────────────────────── */
const NAV_LIST = [
  { name: "Fresh",            link: "/fresh",            hasDropdown: true },
  { name: "MX Player",        link: "/mx-player" },
  { name: "Sell",             link: "/sell" },
  { name: "Bestsellers",      link: "/bestsellers" },
  { name: "Today's Deals",    link: "/deals" },
  { name: "Mobiles",          link: "/mobiles" },
  { name: "New Releases",     link: "/new-releases" },
  { name: "Customer Service", link: "/customer-service" },
  { name: "Prime",            link: "/prime",            hasDropdown: true },
  { name: "Amazon Pay",       link: "/pay" },
  { name: "Electronics",      link: "/electronics" },
  { name: "Fashion",          link: "/fashion" },
  { name: "Home & Kitchen",   link: "/home-kitchen" },
  {name:"Computers" , link:"/computers"},
  {name:"Toys & Games" , link:"/toys"},
];

/* ─────────────────────────────────────────────
   ALL MENU SIDEBAR DATA (with subItems)
───────────────────────────────────────────── */
// Update ALL_MENU items to support sections in subItems
const ALL_MENU = [
  {
    section: "Trending",
    items: [
      { label: "Bestsellers", link: "/bestsellers" },
      { label: "New Releases", link: "/new-releases" },
      { label: "Movers and Shakers", link: "/movers" },
    ],
  },
  {
    section: "Digital Content and Devices",
    items: [
      {
        label: "Echo & Alexa", link: "/alexa", arrow: true,
        seeAllLink: "/alexa",
        subSections: [
          {
            title: "Devices",
            items: [
              { label: "Echo Dot", link: "/alexa/echo-dot" },
              { label: "Echo Show", link: "/alexa/echo-show" },
              { label: "Echo Plus", link: "/alexa/echo-plus" },
            ],
          },
          {
            title: "Content & Resources",
            items: [
              { label: "Meet Alexa", link: "/alexa/meet" },
              { label: "Alexa Skills", link: "/alexa/skills" },
              { label: "Alexa App", link: "/alexa/app" },
              { label: "Alexa Smart Home", link: "/alexa/smart-home" },
              { label: "Amazon Prime Music", link: "/primemusic" },
            ],
          },
        ],
      },
      {
        label: "Fire TV", link: "/firetv", arrow: true,
        seeAllLink: "/firetv",
        subSections: [
          {
            title: "Devices",
            items: [
              { label: "Fire TV Stick", link: "/firetv/stick" },
              { label: "Fire TV Cube", link: "/firetv/cube" },
              { label: "Fire TV 4K", link: "/firetv/4k" },
            ],
          },
        ],
      },
      {
        label: "Kindle E-Readers & eBooks", link: "/kindle", arrow: true,
        seeAllLink: "/kindle",
        subSections: [
          {
            title: "Devices",
            items: [
              { label: "Kindle Paperwhite", link: "/kindle/paperwhite" },
              { label: "Kindle Oasis", link: "/kindle/oasis" },
            ],
          },
          {
            title: "Content",
            items: [
              { label: "eBooks", link: "/kindle/ebooks" },
              { label: "Kindle Unlimited", link: "/kindle/unlimited" },
            ],
          },
        ],
      },
      {
        label: "Audible Audiobooks", link: "/audible", arrow: true,
        seeAllLink: "/audible",
        subSections: [
          { title: "Explore", items: [{ label: "Browse Audiobooks", link: "/audible/browse" }, { label: "Free Trial", link: "/audible/trial" }] },
        ],
      },
      {
        label: "Amazon Prime Video", link: "/primevideo", arrow: true,
        seeAllLink: "/primevideo",
        subSections: [
          { title: "Browse", items: [{ label: "Movies", link: "/primevideo/movies" }, { label: "TV Shows", link: "/primevideo/tv" }, { label: "Kids", link: "/primevideo/kids" }] },
        ],
      },
      {
        label: "Amazon Prime Music", link: "/primemusic", arrow: true,
        seeAllLink: "/primemusic",
        subSections: [
          { title: "Browse", items: [{ label: "Top Charts", link: "/primemusic/charts" }, { label: "Playlists", link: "/primemusic/playlists" }] },
        ],
      },
    ],
  },
  {
    section: "Shop By Category",
    items: [
      {
        label: "Mobiles, Computers", link: "/mobiles", arrow: true,
        seeAllLink: "/mobiles",
        subSections: [
          {
            title: "Mobiles",
            items: [
              { label: "All Mobile Phones", link: "/mobiles/phones" },
              { label: "Cases & Covers", link: "/mobiles/cases" },
              { label: "Screen Protectors", link: "/mobiles/screen-protectors" },
              { label: "Power Banks", link: "/mobiles/power-banks" },
            ],
          },
          {
            title: "Computers & Accessories",
            items: [
              { label: "Tablets", link: "/mobiles/tablets" },
              { label: "Wearable Devices", link: "/mobiles/wearables" },
              { label: "Smart Home", link: "/mobiles/smart-home" },
              { label: "Office Supplies", link: "/mobiles/office" },
              { label: "Software", link: "/mobiles/software" },
            ],
          },
        ],
      },
      {
        label: "TV, Appliances, Electronics", link: "/electronics", arrow: true,
        seeAllLink: "/electronics",
        subSections: [
          {
            title: "Electronics",
            items: [
              { label: "Cameras", link: "/electronics/cameras" },
              { label: "Headphones", link: "/electronics/headphones" },
              { label: "Laptops", link: "/electronics/laptops" },
              { label: "Televisions", link: "/electronics/tvs" },
            ],
          },
        ],
      },
      {
        label: "Men's Fashion", link: "/men-fashion", arrow: true,
        seeAllLink: "/men-fashion",
        subSections: [
          {
            title: "Men's Clothing",
            items: [
              { label: "T-Shirts", link: "/men/tshirts" },
              { label: "Shirts", link: "/men/shirts" },
              { label: "Jeans", link: "/men/jeans" },
              { label: "Trousers", link: "/men/trousers" },
            ],
          },
          {
            title: "Footwear & Accessories",
            items: [
              { label: "Shoes", link: "/men/shoes" },
              { label: "Watches", link: "/men/watches" },
              { label: "Bags", link: "/men/bags" },
            ],
          },
        ],
      },
      {
        label: "Women's Fashion", link: "/women-fashion", arrow: true,
        seeAllLink: "/women-fashion",
        subSections: [
          {
            title: "Clothing",
            items: [
              { label: "Sarees", link: "/women/sarees" },
              { label: "Kurtis", link: "/women/kurtis" },
              { label: "Dresses", link: "/women/dresses" },
              { label: "Tops", link: "/women/tops" },
            ],
          },
          {
            title: "Footwear & Accessories",
            items: [
              { label: "Shoes", link: "/women/shoes" },
              { label: "Handbags", link: "/women/handbags" },
              { label: "Jewellery", link: "/women/jewellery" },
            ],
          },
        ],
      },
      {
        label: "Home, Kitchen, Pets", link: "/home-kitchen", arrow: true,
        seeAllLink: "/home-kitchen",
        subSections: [
          {
            title: "Home & Kitchen",
            items: [
              { label: "Furniture", link: "/home/furniture" },
              { label: "Cookware", link: "/home/cookware" },
              { label: "Bedding", link: "/home/bedding" },
              { label: "Home Decor", link: "/home/decor" },
            ],
          },
        ],
      },
      {
        label: "Beauty, Health, Grocery", link: "/beauty", arrow: true,
        seeAllLink: "/beauty",
        subSections: [
          { title: "Beauty & Health", items: [{ label: "Skincare", link: "/beauty/skincare" }, { label: "Haircare", link: "/beauty/haircare" }, { label: "Makeup", link: "/beauty/makeup" }] },
        ],
      },
      {
        label: "Sports, Fitness, Bags", link: "/sports", arrow: true,
        seeAllLink: "/sports",
        subSections: [
          { title: "Sports", items: [{ label: "Exercise & Fitness", link: "/sports/fitness" }, { label: "Cricket", link: "/sports/cricket" }, { label: "Badminton", link: "/sports/badminton" }] },
        ],
      },
      {
        label: "Books", link: "/books", arrow: true,
        seeAllLink: "/books",
        subSections: [
          { title: "Browse", items: [{ label: "Fiction", link: "/books/fiction" }, { label: "Non-Fiction", link: "/books/non-fiction" }, { label: "Children's Books", link: "/books/children" }] },
        ],
      },
      {
        label: "Toys & Games", link: "/toys", arrow: true,
        seeAllLink: "/toys",
        subSections: [
          { title: "Browse", items: [{ label: "Action Figures", link: "/toys/action" }, { label: "Board Games", link: "/toys/board" }, { label: "Remote Control", link: "/toys/rc" }] },
        ],
      },
      {
        label: "Grocery", link: "/grocery", arrow: true,
        seeAllLink: "/grocery",
        subSections: [
          { title: "Browse", items: [{ label: "Snacks", link: "/grocery/snacks" }, { label: "Beverages", link: "/grocery/beverages" }, { label: "Staples", link: "/grocery/staples" }] },
        ],
      },
    ],
  },
  {
    section: "Help & Settings",
    items: [
      { label: "Your Account", link: "/account" },
      { label: "Customer Service", link: "/customer-service" },
      { label: "Sign in", link: "/signin" },
    ],
  },
];

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const AllSideBar = () => {
  const [allOpen, setAllOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(null);

  useEffect(() => {
    document.body.style.overflow = allOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [allOpen]);

  const openSub = (item) => {
    if (item.subSections?.length) {
      setSubMenu({
        title: item.label,
        seeAllLink: item.seeAllLink,
        subSections: item.subSections,
      });
    }
  };

  const closeSidebar = () => { setAllOpen(false); setSubMenu(null); };

  return (
    <>
      {/* ── Bottom Nav Strip ── */}
      <div className="bg-[#232f3e] w-full flex items-center gap-0 px-2 py-0.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => { setAllOpen(true); setSubMenu(null); }}
          className="flex items-center gap-1.5 text-white text-[13px] font-bold px-3 py-2 rounded border-2 border-transparent hover:border-white transition-colors shrink-0 cursor-pointer"
        >
          <span className="text-[16px] leading-none">☰</span>
          <span>All</span>
        </button>
        {NAV_LIST.map((item) => (
          <Link
            key={item.name}
            to={item.link}
            className="flex items-center gap-0.5 text-white text-[13px] px-3 py-1.5 rounded border-2 border-transparent hover:border-white transition-colors shrink-0 whitespace-nowrap"
          >
            {item.name}
            {item.hasDropdown && <IoMdArrowDropdown size={14} />}
          </Link>
        ))}
      </div>

      {/* ── Backdrop ── */}
      {allOpen && (
        <div className="fixed inset-0 bg-black/60 z-10" onClick={closeSidebar} />
      )}

      {/* ── Drawer ── */}
      <div
        className={`fixed top-0 left-0 h-full w-92 max-w-[80vw] bg-white z-20 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out overflow-hidden
          ${allOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-[#232f3e] flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1.5">
              <MdPerson size={20} className="text-[#232f3e]" />
            </div>
            <span className="text-white font-bold text-xl">Hello, sign in</span>
          </div>
          <button onClick={closeSidebar} className="text-white cursor-pointer p-1 rounded hover:bg-white/10">
            <MdClose size={22} />
          </button>
        </div>

        {/* ── Main Menu ── */}
        <div
          className={`absolute inset-0 top-[56px] flex flex-col transition-transform duration-300 ease-in-out bg-white
            ${subMenu ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="flex-1 overflow-y-auto">
            {ALL_MENU.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "border-t border-gray-200" : ""}>
                <div className="px-4 pt-4 pb-1">
                  <h3 className="text-[17px] font-extrabold text-gray-900">{group.section}</h3>
                </div>
                {group.items.map((item) =>
                  item.arrow ? (
                    <button
                      key={item.label}
                      onClick={() => openSub(item)}
                      className="flex items-center justify-between w-full px-4 py-3 text-[14px] text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <MdChevronRight size={20} className="text-gray-400 shrink-0" />
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.link}
                      onClick={closeSidebar}
                      className="flex items-center justify-between px-4 py-3 text-[14px] text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <span>{item.label}</span>
                    </Link>
                  )
                )}
              </div>
            ))}
            <div className="h-8" />
          </div>
        </div>

        {/* ── Sub Menu Panel ── */}
        <div
          className={`absolute inset-0 top-[56px] flex flex-col transition-transform duration-300 ease-in-out bg-white
            ${subMenu ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Back header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
            <button
              onClick={() => setSubMenu(null)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              <MdArrowBack size={20} />
            </button>
            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Main Menu</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {subMenu && (
              <>
                {/* Category title + See all */}
                {/* <div className="px-4 pt-5 pb-3 border-b border-gray-200"> */}
                  {/* <h2 className="text-[20px] font-extrabold text-gray-900 mb-2">
                    {subMenu.title}
                  </h2> */}
                  {/* <Link
                    to={subMenu.seeAllLink}
                    onClick={closeSidebar}
                    className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline"
                  >
                    See all {subMenu.title}
                  </Link> */}
                {/* </div> */}

                {/* Sub sections */}
                {subMenu.subSections.map((section, si) => (
                  <div key={si} className={si > 0 ? "border-t  border-gray-200" : ""}>
                    {/* Section title */}
                    <div className="px-4 pt-4 pb-1">
                      <h3 className="text-xl  font-extrabold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    {/* Section items */}
                    {section.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.link}
                        onClick={closeSidebar}
                        className="flex items-center px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </>
            )}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllSideBar;
