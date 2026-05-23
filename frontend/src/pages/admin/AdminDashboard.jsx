import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  MdTrendingUp, MdShoppingBag, MdPeople, MdInventory,
  MdArrowUpward, MdArrowDownward, MdLocalShipping
} from 'react-icons/md'
 
/* ── DATA ── */
const revenueData = [
  { month: "Jan", revenue: 42000, orders: 320, returns: 18 },
  { month: "Feb", revenue: 55000, orders: 410, returns: 24 },
  { month: "Mar", revenue: 48000, orders: 380, returns: 21 },
  { month: "Apr", revenue: 61000, orders: 490, returns: 30 },
  { month: "May", revenue: 72000, orders: 560, returns: 28 },
  { month: "Jun", revenue: 68000, orders: 530, returns: 35 },
  { month: "Jul", revenue: 85000, orders: 640, returns: 40 },
  { month: "Aug", revenue: 91000, orders: 710, returns: 38 },
  { month: "Sep", revenue: 78000, orders: 600, returns: 32 },
  { month: "Oct", revenue: 95000, orders: 750, returns: 44 },
  { month: "Nov", revenue: 110000, orders: 880, returns: 52 },
  { month: "Dec", revenue: 130000, orders: 1020, returns: 60 },
]
 
const categoryData = [
  { name: "Electronics",   value: 38, color: "#FF9900" },
  { name: "Fashion",       value: 24, color: "#3B82F6" },
  { name: "Home",          value: 18, color: "#10B981" },
  { name: "Books",         value: 10, color: "#8B5CF6" },
  { name: "Others",        value: 10, color: "#F43F5E" },
]
 
const weeklyOrders = [
  { day: "Mon", delivered: 48, pending: 12, cancelled: 4 },
  { day: "Tue", delivered: 62, pending: 18, cancelled: 6 },
  { day: "Wed", delivered: 55, pending: 15, cancelled: 3 },
  { day: "Thu", delivered: 73, pending: 22, cancelled: 8 },
  { day: "Fri", delivered: 89, pending: 30, cancelled: 11 },
  { day: "Sat", delivered: 101, pending: 25, cancelled: 7 },
  { day: "Sun", delivered: 67, pending: 19, cancelled: 5 },
]
 
const recentOrders = [
  { id: "#ORD-8821", customer: "Rahul Sharma", product: "iPhone 15 Pro", amount: "₹1,29,999", status: "Delivered",  date: "23 May" },
  { id: "#ORD-8820", customer: "Priya Singh",  product: "Samsung TV 55\"", amount: "₹62,990",  status: "Shipped",    date: "23 May" },
  { id: "#ORD-8819", customer: "Amit Kumar",   product: "Nike Air Max",    amount: "₹8,495",   status: "Processing", date: "22 May" },
  { id: "#ORD-8818", customer: "Neha Joshi",   product: "Kindle Paperwhite", amount: "₹13,999", status: "Pending",   date: "22 May" },
  { id: "#ORD-8817", customer: "Vikram Patel", product: "Levi's Jeans",    amount: "₹2,999",   status: "Cancelled",  date: "21 May" },
]
 
const STATUS_STYLE = {
  Delivered:  "bg-emerald-400/10 text-emerald-400",
  Shipped:    "bg-blue-400/10 text-blue-400",
  Processing: "bg-yellow-400/10 text-yellow-400",
  Pending:    "bg-orange-400/10 text-orange-400",
  Cancelled:  "bg-red-400/10 text-red-400",
}
 
const STAT_CARDS = [
  { label: "Total Revenue",  value: "₹8,74,000", change: "+18.2%", up: true,  icon: MdTrendingUp,     color: "from-[#FF9900]/20 to-[#FF9900]/5",  accent: "#FF9900" },
  { label: "Total Orders",   value: "7,290",      change: "+12.5%", up: true,  icon: MdShoppingBag,    color: "from-[#3B82F6]/20 to-[#3B82F6]/5",  accent: "#3B82F6" },
  { label: "Customers",      value: "4,821",       change: "+8.1%",  up: true,  icon: MdPeople,         color: "from-[#10B981]/20 to-[#10B981]/5",  accent: "#10B981" },
  { label: "Products",       value: "1,204",       change: "-2.4%",  up: false, icon: MdInventory,      color: "from-[#8B5CF6]/20 to-[#8B5CF6]/5",  accent: "#8B5CF6" },
  { label: "Avg Order Value",value: "₹1,199",      change: "+5.3%",  up: true,  icon: MdTrendingUp,     color: "from-[#F43F5E]/20 to-[#F43F5E]/5",  accent: "#F43F5E" },
  { label: "Shipping Today", value: "142",         change: "+21%",   up: true,  icon: MdLocalShipping,  color: "from-[#06B6D4]/20 to-[#06B6D4]/5",  accent: "#06B6D4" },
]
 
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e2535] border border-white/10 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue') ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  )
}

const AdminDashboard = () => {
    const [range ,setRange] = useState("12M")

  return (
     <div className="space-y-6 text-white">
 
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back, Admin · Sat 23 May 2026</p>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {["7D","1M","3M","12M"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${range === r ? "bg-[#FF9900] text-black" : "text-gray-400 hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
 
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {STAT_CARDS.map(({ label, value, change, up, icon: Icon, color, accent }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border border-white/5 rounded-2xl p-4 relative overflow-hidden`}>
            <div className="flex items-start justify-between mb-3">
              <div style={{ color: accent }} className="p-2 rounded-xl bg-white/5">
                <Icon size={18} />
              </div>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}>
                {up ? <MdArrowUpward size={12} /> : <MdArrowDownward size={12} />}{change}
              </span>
            </div>
            <p className="text-[13px] font-bold text-white leading-tight">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
 
      {/* ── Revenue + Pie Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
 
        {/* Area Chart — Revenue */}
        <div className="lg:col-span-2 bg-[#131720] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold">Revenue Overview</h2>
              <p className="text-gray-400 text-xs mt-0.5">Monthly revenue & orders</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF9900" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#FF9900" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="orders"  name="Orders"  stroke="#3B82F6" strokeWidth={2} fill="url(#ordGrad)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
 
        {/* Pie Chart — Category */}
        <div className="bg-[#131720] border border-white/5 rounded-2xl p-5">
          <h2 className="text-[15px] font-bold mb-1">Sales by Category</h2>
          <p className="text-gray-400 text-xs mb-3">Distribution this year</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "#1e2535", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-gray-300">{name}</span>
                </div>
                <span className="font-bold text-white">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Bar Chart + Line Chart Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
        {/* Bar Chart — Weekly Orders */}
        <div className="bg-[#131720] border border-white/5 rounded-2xl p-5">
          <h2 className="text-[15px] font-bold mb-1">Weekly Orders</h2>
          <p className="text-gray-400 text-xs mb-4">Delivered / Pending / Cancelled</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyOrders} barSize={10} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af", paddingTop: 8 }} />
              <Bar dataKey="delivered" name="Delivered" fill="#10B981" radius={[4,4,0,0]} />
              <Bar dataKey="pending"   name="Pending"   fill="#FF9900" radius={[4,4,0,0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#F43F5E" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
        {/* Line Chart — Returns vs Revenue */}
        <div className="bg-[#131720] border border-white/5 rounded-2xl p-5">
          <h2 className="text-[15px] font-bold mb-1">Returns Trend</h2>
          <p className="text-gray-400 text-xs mb-4">Monthly returns vs revenue</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af", paddingTop: 8 }} />
              <Line type="monotone" dataKey="returns" name="Returns" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3, fill: "#F43F5E" }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="orders"  name="Orders"  stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: "#8B5CF6" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      {/* ── Recent Orders Table ── */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-bold">Recent Orders</h2>
            <p className="text-gray-400 text-xs mt-0.5">Latest 5 transactions</p>
          </div>
          <button className="text-[#FF9900] text-xs hover:underline font-medium">View All →</button>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-white/5">
                {["Order ID","Customer","Product","Amount","Status","Date"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-[#FF9900] font-mono text-xs font-semibold">{o.id}</td>
                  <td className="py-3 pr-4 text-gray-200 text-xs">{o.customer}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{o.product}</td>
                  <td className="py-3 pr-4 text-white font-semibold text-xs">{o.amount}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLE[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
    </div>
  )
}

export default AdminDashboard