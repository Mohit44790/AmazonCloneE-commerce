import React, { useState, useRef, useEffect } from 'react'
import { IoMdArrowDropup } from 'react-icons/io'
import { MdLanguage } from 'react-icons/md'
import amazon from "../assets/amazonLogo.png"

const FOOTER_LINKS = [
  {
    heading: "Get to Know Us",
    links: [
      { label: "About Amazon",    href: "/about" },
      { label: "Careers",         href: "/careers" },
      { label: "Press Releases",  href: "/press" },
      { label: "Amazon Science",  href: "/science" },
    ],
  },
  {
    heading: "Connect with Us",
    links: [
      { label: "Facebook",  href: "https://facebook.com/amazon" },
      { label: "Twitter",   href: "https://twitter.com/amazon" },
      { label: "Instagram", href: "https://instagram.com/amazon" },
      { label: "YouTube",   href: "https://youtube.com/amazon" },
    ],
  },
  {
    heading: "Make Money with Us",
    links: [
      { label: "Sell on Amazon",                    href: "/sell" },
      { label: "Sell under Amazon Accelerator",     href: "/accelerator" },
      { label: "Protect and Build Your Brand",      href: "/brand" },
      { label: "Amazon Global Selling",             href: "/global-selling" },
      { label: "Supply to Amazon",                  href: "/supply" },
      { label: "Become an Affiliate",               href: "/affiliate" },
      { label: "Fulfilment by Amazon",              href: "/fba" },
      { label: "Advertise Your Products",           href: "/advertise" },
      { label: "Amazon Pay on Merchants",           href: "/amazonpay" },
    ],
  },
  {
    heading: "Let Us Help You",
    links: [
      { label: "Your Account",                    href: "/account" },
      { label: "Return Centre",                   href: "/returns" },
      { label: "Recalls and Product Safety Alerts", href: "/recalls" },
      { label: "100% Purchase Protection",        href: "/protection" },
      { label: "Amazon App Download",             href: "/app" },
      { label: "Help",                            href: "/help" },
    ],
  },
]

const BOTTOM_LINKS = [
  {
    heading: "AbeBooks",
    sub: "Books, art & collectibles",
    href: "https://abebooks.com",
  },
  {
    heading: "Amazon Web Services",
    sub: "Scalable Cloud Computing Services",
    href: "https://aws.amazon.com",
  },
  {
    heading: "Audible",
    sub: "Download Audio Books",
    href: "https://audible.in",
  },
  {
    heading: "Shopbop",
    sub: "Designer Fashion Brands",
    href: "https://shopbop.com",
  },
  {
    heading: "Amazon Business",
    sub: "Everything For Your Business",
    href: "/business",
  },
  {
    heading: "Amazon Prime",
    sub: "100 million songs, ad-free",
    href: "/prime",
  },
]

const LANGUAGES = [
  { code: "en", label: "English - EN" },
  { code: "hi", label: "हिन्दी - HI" },
  { code: "ta", label: "தமிழ் - TA" },
  { code: "te", label: "తెలుగు - TE" },
  { code: "kn", label: "ಕನ್ನಡ - KN" },
  { code: "ml", label: "മലയാളം - ML" },
  { code: "bn", label: "বাংলা - BN" },
  { code: "mr", label: "मराठी - MR" },
]

export default function Footer() {
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState("en")
  const langRef = useRef(null)

  useEffect(() => {
    const h = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === selectedLang)

  return (
    <footer className="font-sans">

      {/* ── Sign In Banner ── */}
      <div className="text-center my-4 border-t border-b border-gray-300 py-6 px-4 bg-white">
        <p className="text-sm font-medium text-gray-800 mb-2">See personalised recommendations</p>
        <button className="bg-[#FFD814] hover:bg-[#F7CA00] transition-colors text-sm font-medium px-10 py-1.5 rounded-full shadow">
          Sign in
        </button>
        <p className="text-xs mt-2 text-gray-600">
          New customer?{" "}
          <a href="/register" className="text-[#0066c0] hover:text-[#c45500] hover:underline">
            Start here.
          </a>
        </p>
      </div>

      {/* ── Back to Top ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#37475A] hover:bg-[#485769] transition-colors text-white text-sm py-2.5 flex items-center justify-center gap-1"
      >
        <IoMdArrowDropup size={18} />
        Back to top
      </button>

      {/* ── Main Link Grid ── */}
      <div className="bg-[#232f3e] py-10 px-6">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white font-bold text-[14px] mb-3">{col.heading}</h3>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-gray-300 text-[13px] hover:text-white hover:underline transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="bg-[#232f3e] border-t border-[#3a4553] px-6 pb-6">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-6">
          {BOTTOM_LINKS.map((item) => (
            <a
              key={item.heading}
              href={item.href}
              className="text-center hover:underline group"
            >
              <p className="text-white text-[13px] font-semibold group-hover:text-[#FF9900] transition-colors">
                {item.heading}
              </p>
              <p className="text-gray-400 text-[12px] leading-tight mt-0.5">{item.sub}</p>
            </a>
          ))}
        </div>
      </div>

      {/* ── Language / Country Bar ── */}
      <div className="bg-[#131A22] border-t border-[#3a4553] py-5 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 relative">

          {/* Logo */}
          <a href="/" className="flex items-center mb-2 sm:mb-0">
           <img src={amazon} alt="logo" className='w-24 mt-3' />
          </a>

          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 border border-gray-500 hover:border-white text-white text-[13px] px-4 py-1.5 rounded transition-colors cursor-pointer"
            >
              <MdLanguage size={16} />
              <span>{currentLang.label.split(" - ")[0]}</span>
              <span className="text-gray-400 text-[12px]">▲▼</span>
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 bg-white border border-gray-300 rounded-lg shadow-2xl z-[999] min-w-[220px] overflow-hidden">
                <div className="px-4 py-2.5 text-[13px] font-bold text-gray-700 border-b border-gray-200 bg-gray-50">
                  Change Language
                </div>
                {LANGUAGES.map((l) => (
                  <label
                    key={l.code}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => { setSelectedLang(l.code); setLangOpen(false) }}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                      ${selectedLang === l.code ? "border-[#FF9900]" : "border-gray-400"}`}
                    >
                      {selectedLang === l.code && (
                        <span className="w-2 h-2 rounded-full bg-[#FF9900] block" />
                      )}
                    </span>
                    <span className={`text-[14px] ${selectedLang === l.code ? "text-[#c45500] font-semibold" : "text-gray-800"}`}>
                      {l.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Country Button */}
          <button className="flex items-center gap-2 border border-gray-500 hover:border-white text-white text-[13px] px-4 py-1.5 rounded transition-colors cursor-pointer">
            <span>🇮🇳</span>
            <span>India</span>
          </button>
        </div>
      </div>

      {/* ── Legal Bottom ── */}
      <div className="bg-[#131A22] pb-8 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] text-gray-400 text-center">
          {["Conditions of Use & Sale", "Privacy Notice", "Interest-Based Ads"].map((l) => (
            <a key={l} href="#" className="hover:text-white hover:underline">{l}</a>
          ))}
        </div>
        <p className="text-center text-[12px] text-gray-500 mt-2">
          © 2026–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </p>
      </div>

    </footer>
  )
}