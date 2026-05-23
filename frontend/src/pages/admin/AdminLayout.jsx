import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  MdDashboard, MdAddBox, MdInventory, MdCategory,
  MdShoppingCart, MdLocalShipping, MdPeople, MdSettings,
  MdLogout, MdMenu, MdClose, MdNotifications, MdSearch,
  MdChevronRight
} from 'react-icons/md'

const NAV_ITEMS = [
  { label: "Dashboard",      icon: MdDashboard,      to: "/admin" },
  { label: "Create Product", icon: MdAddBox,         to: "/admin/create-product" },
  { label: "All Products",   icon: MdInventory,      to: "/admin/products" },
  { label: "Category",       icon: MdCategory,       to: "/admin/category" },
  { label: "Purchase",       icon: MdShoppingCart,   to: "/admin/purchase" },
  { label: "Shipping",       icon: MdLocalShipping,  to: "/admin/shipping" },
  { label: "Customers",      icon: MdPeople,         to: "/admin/customers" },
  { label: "Settings",       icon: MdSettings,       to: "/admin/settings" },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#0f1117] font-sans overflow-hidden">

      {/* ── Mobile Backdrop ── */}
      {mobileSidebar && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* ══════════════════════════
          SIDEBAR
      ══════════════════════════ */}
      <aside className={`
        fixed md:relative z-50 md:z-auto h-full flex flex-col
        bg-[#131720] border-r border-white/5
        transition-all duration-300 ease-in-out shrink-0
        ${sidebarOpen ? "w-60" : "w-16"}
        ${mobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 h-16 shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF9900] flex items-center justify-center">
                <span className="text-black font-black text-sm">A</span>
              </div>
              <span className="text-white font-bold text-[15px] tracking-wide">Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5 ml-auto"
          >
            {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                ${isActive
                  ? "bg-[#FF9900]/15 text-[#FF9900]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FF9900] rounded-r-full" />}
                  <Icon size={20} className="shrink-0" />
                  {sidebarOpen && (
                    <span className="text-[13px] font-medium whitespace-nowrap">{label}</span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-14 bg-[#232f3e] text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50 shadow-lg">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-white/5 pt-3">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <MdLogout size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-[13px] font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════
          MAIN CONTENT
      ══════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-16 bg-[#131720] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebar(true)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <MdMenu size={24} />
            </button>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 w-48 sm:w-64 border border-white/5">
              <MdSearch size={16} className="text-gray-400 shrink-0" />
              <input
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-500 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
              <MdNotifications size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF9900] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9900] to-[#FF6B00] flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0f1117] p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}