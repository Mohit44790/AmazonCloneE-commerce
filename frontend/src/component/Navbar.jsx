import React, { useState, useRef, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import amazon from "../assets/amazonLogo.png"
import AllSideBar from "../pages/mainlayout/AllSideBar";
import { MdArrowDropUp } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuthStore } from "../apiData/store/authStore";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हि", name: "हिन्दी" },
  { code: "mr", label: "म", name: "मराठी" },
];

const TRANSLATIONS = {
  en: {
    delivery: "Delivering to New Delhi",
    updateLocation: "Update location",
    searchPlaceholder: "Search Amazon.in",
    hello: "Hello, sign in",
    accountLists: "Account & Lists",
    returns: "Returns",
    orders: "& Orders",
    cart: "Cart",
    all: "All",
    todayDeals: "Today's Deals",
    customerService: "Customer Service",
    registry: "Registry",
    giftCards: "Gift Cards",
    sell: "Sell",
  },
  hi: {
    delivery: "डिलीवरी",
    updateLocation: "स्थान अपडेट करें",
    searchPlaceholder: "Amazon.in पर खोजें",
    hello: "नमस्ते, साइन इन करें",
    accountLists: "खाता और सूचियाँ",
    returns: "वापसी",
    orders: "और ऑर्डर",
    cart: "कार्ट",
    all: "सभी",
    todayDeals: "आज के सौदे",
    customerService: "ग्राहक सेवा",
    registry: "रजिस्ट्री",
    giftCards: "गिफ्ट कार्ड",
    sell: "बेचें",
  },
  mr: {
    delivery: "डिलिव्हरी",
    updateLocation: "स्थान अपडेट करा",
    searchPlaceholder: "Amazon.in वर शोधा",
    hello: "नमस्कार, साइन इन करा",
    accountLists: "खाते आणि याद्या",
    returns: "परतावा",
    orders: "आणि ऑर्डर",
    cart: "कार्ट",
    all: "सर्व",
    todayDeals: "आजचे सौदे",
    customerService: "ग्राहक सेवा",
    registry: "नोंदणी",
    giftCards: "भेट कार्डे",
    sell: "विका",
  },
};

const YOUR_LISTS = [
  { label: "Create a Wish List",    to: "/wishlist/create" },
  { label: "Wish from Any Website", to: "/wishlist/any-website" },
  { label: "Baby Wishlist",         to: "/wishlist/baby" },
  { label: "Discover Your Style",   to: "/style" },
  { label: "Explore Showroom",      to: "/showroom" },
]
 
const YOUR_ACCOUNT = [
  { label: "Admin Account",                          to: "/admin" },
  { label: "Your Account",                          to: "/account" },
  { label: "Your Orders",                           to: "/orders" },
  { label: "Your Wish List",                        to: "/wishlist" },
  { label: "Keep Shopping For",                     to: "/keep-shopping" },
  { label: "Your Recommendations",                  to: "/recommendations" },
  { label: "Your Prime Membership",                 to: "/prime" },
  { label: "Your Prime Video",                      to: "/primevideo" },
  { label: "Your Subscribe & Save Items",           to: "/subscribe-save" },
  { label: "Memberships & Subscriptions",           to: "/memberships" },
  { label: "Your Seller Account",                   to: "/seller" },
  { label: "Manage Your Content and Devices",       to: "/manage-content" },
  { label: "Register for a free Business Account",  to: "/business/register" },
]


export default function Navbar() {
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [showMenu ,setShowMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const langRef = useRef(null);
  const t = TRANSLATIONS[lang];
  const currentLang = LANGUAGES.find((l) => l.code === lang);
  const { user } = useAuthStore();
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 font-sans shadow-lg">

      {/* ── Main Bar ── */}
      <div className="bg-[#131921] flex items-center gap-1 px-3 py-2">

        {/* Logo */}
        <a
          href="#"
          className="flex items-center border-2 border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0"
        >
        <img src={amazon} alt="logo" className="w-28 " /><p className="text-white -mt-3">.in</p>
        </a>

        {/* Location — md+ only */}
        <button className="hidden md:flex items-center gap-1 text-white border-2 border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0 cursor-pointer">
          <IoLocationOutline size={20} className="mt-1 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] text-gray-300 leading-tight">{t.delivery}</p>
            <p className="text-[13px] font-bold leading-tight whitespace-nowrap">{t.updateLocation}</p>
          </div>
        </button>

        {/* Search Bar — grows to fill space */}
        <div className={`flex flex-1 min-w-0 rounded overflow-hidden transition-shadow duration-150 ${searchFocused ? "ring-2 ring-[#FF9900]" : ""}`}>
          <select className="bg-[#f3f3f3] border-r border-[#cdcdcd] text-[#333] text-[13px] px-2 shrink-0 outline-none cursor-pointer max-w-[60px] md:max-w-[80px]">
            <option>{t.all}</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Mobiles</option>
          </select>
          <input
            type="search"
            placeholder={t.searchPlaceholder}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 min-w-0 px-3 py-2 text-[14px] text-gray-800 bg-white outline-none"
          />
          <button className="bg-[#FF9900] hover:bg-[#e68a00] transition-colors px-3 md:px-4 flex items-center justify-center shrink-0 cursor-pointer">
            <FaSearch size={17} color="#333" />
          </button>
        </div>

        {/* Language Selector */}
        <div ref={langRef} className="relative shrink-0">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 text-white border-2 border-transparent hover:border-white rounded px-2 py-1 transition-colors cursor-pointer"
          >
            <span className="text-base">🇮🇳</span>
            <span className="text-[13px] font-bold">{currentLang.label}</span>
            <IoMdArrowDropdown size={14} />
          </button>

          {langOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999] overflow-hidden min-w-[168px]">
              {/* Arrow pointer */}
              <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-200" />
              <div className="px-4 py-2 text-[11px] font-bold text-gray-400 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                Choose language
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-[14px] text-left transition-colors cursor-pointer
                    ${lang === l.code
                      ? "bg-orange-50 border-l-[3px] border-[#FF9900]"
                      : "border-l-[3px] border-transparent hover:bg-gray-50"
                    }`}
                >
                  <span className="font-bold text-[#FF9900] w-5 text-center text-[15px] shrink-0">{l.label}</span>
                  <span className="text-gray-700">{l.name}</span>
                  {lang === l.code && <span className="ml-auto text-[#FF9900] font-bold text-sm">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account & Lists — sm+ */}
        <div>

        <button className="hidden relative hidden sm:block text-sm text-left sm:flex flex-col items-start text-white border-2 border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0 cursor-pointer" onMouseEnter={()=> setShowMenu(true)}
        >
          <span  className="text-[11px] text-gray-300 whitespace-nowrap">{t.hello}</span>
          <span className="text-[13px] font-bold flex items-center gap-0.5 whitespace-nowrap">
            {t.accountLists} <IoMdArrowDropdown size={13} />
          </span>
        </button>
        </div>

        {showMenu && (
          <div onMouseEnter={()=> setShowMenu(true)}
        onMouseLeave={()=> setShowMenu(false)}  className="absolute z-20 bg-white text-black w-[600px] top-18 right-30 shadow-lg p-4 border border-gray-200 rounded-md">
 <MdArrowDropUp size={48} className="absolute -top-7 right-9  text-white" />

 <div className="text-center">
   <div className="text-center px-6 pt-5 pb-3 border-b border-gray-100">
            <Link to="/login" onClick={() => setShowMenu(false)}>
              <button className="bg-[#FFD814] hover:bg-[#F7CA00] transition-colors text-sm font-medium py-1.5 px-14 rounded-full shadow">
                Sign in
              </button>
            </Link>
            <p className="text-xs mt-2 text-gray-600">
              New customer?{" "}
              <Link
                to="/register"
                onClick={() => setShowMenu(false)}
                className="text-[#0066c0] hover:text-[#c45500] hover:underline"
              >
                Start here.
              </Link>
            </p>
          </div>
    <div className="flex gap-0 px-6 py-4">

   {/* Your Lists */}
            <div className="flex-1 text-start pr-5">
              <h2 className="font-bold text-lg text-gray-900 mb-2">Your Lists</h2>
              <ul className="space-y-1">
                {YOUR_LISTS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className="text-[13px] text-gray-700 hover:text-[#c45500] hover:underline transition-colors block py-0.5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
      {/* Divider */}
            <div className="w-px bg-gray-200 shrink-0" />
 
            {/* Your Account */}
            <div className="flex-1 pl-5 text-start">
              <h2 className="font-bold text-lg text-gray-900 mb-2">Your Account</h2>
              <ul className="space-y-1">
                {YOUR_ACCOUNT.filter(
    (item) =>
      item.label !== "Admin Account" ||
      user?.role === "admin"
  ).map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className="text-[13px] text-gray-700 hover:text-[#c45500] hover:underline transition-colors block py-0.5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
    </div>
 </div>
          </div>
        )}
        

        {/* Returns & Orders — lg+ */}
        <button className="hidden lg:flex flex-col items-start text-white border-2 border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0 cursor-pointer">
          <span className="text-[11px] text-gray-300 whitespace-nowrap">{t.returns}</span>
          <span className="text-[13px] font-bold whitespace-nowrap">{t.orders}</span>
        </button>

        {/* Cart */}
        <button className="flex items-end gap-1 text-white border-2 border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0 cursor-pointer">
          <div className="relative">
            <FaShoppingCart size={28} />
            <span className="absolute -top-1.5 -right-1 bg-[#FF9900] text-[#111] text-[11px] font-bold rounded-full w-[17px] h-[17px] flex items-center justify-center leading-none">
              0
            </span>
          </div>
          <span className="text-[13px] font-bold mb-0.5 hidden sm:block">{t.cart}</span>
        </button>
      </div>

      {/* ── Bottom Strip ── */}
    
  <AllSideBar />

    </nav>
  );
}