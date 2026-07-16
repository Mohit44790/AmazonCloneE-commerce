import React, { useState, useEffect, useCallback } from "react";
import { orderApi } from "../../../apiData/api/orderApi";
import {
  MdSearch, MdRefresh, MdVisibility, MdClose,
  MdCheckCircle, MdError, MdLocalShipping,
} from "react-icons/md";


const STATUS_META = {
  pending:    { cls: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",  label: "Pending"    },
  confirmed:  { cls: "bg-blue-400/10   text-blue-400   border border-blue-400/20",    label: "Confirmed"  },
  processing: { cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20",  label: "Processing" },
  shipped:    { cls: "bg-cyan-400/10   text-cyan-400   border border-cyan-400/20",    label: "Shipped"    },
  delivered:  { cls: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",label:"Delivered"  },
  cancelled:  { cls: "bg-red-400/10   text-red-400   border border-red-400/20",       label: "Cancelled"  },
  returned:   { cls: "bg-gray-400/10  text-gray-400  border border-gray-400/20",      label: "Returned"   },
};
 
const ORDER_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled","returned"];

const Purchase = () => {
  const [orders,     setOrders]     = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null); // order for detail modal
  const [toast,      setToast]      = useState(null);
  const [updating,   setUpdating]   = useState(null); // orderId being updated
 
  const [filters, setFilters] = useState({
    search:"", status:"", page:1, limit:15, sort:"-createdAt",
  });
 
  const showToast = (msg, type="success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };
 
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k,v]) => { if(v!=="") params[k]=v; });
      const res = await orderApi.getAll(params);
      setOrders(res.data?.orders || []);
      setPagination(res.pagination || {});
    } catch { showToast("Failed to load orders","error"); }
    finally { setLoading(false); }
  }, [filters]);
 
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
 
  const setFilter = (k,v) => setFilters(f => ({ ...f, [k]:v, page:1 }));
 
  /* ── Update Status ── */
  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await orderApi.updateStatus(orderId, status);
      showToast("Order status updated");
      fetchOrders();
    } catch { showToast("Update failed","error"); }
    finally { setUpdating(null); }
  };
 
  const inputCls = "bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF9900]/40";

  return (
   <div className="text-white space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2
          ${toast.type==="success"?"bg-emerald-500":"bg-red-500"} text-white`}>
          {toast.type==="success"?<MdCheckCircle size={18}/>:<MdError size={18}/>} {toast.msg}
        </div>
      )}
 
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Orders / Purchase</h1>
          <p className="text-gray-400 text-sm">{pagination.total||0} total orders</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm">
          <MdRefresh size={16}/> Refresh
        </button>
      </div>
 
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {ORDER_STATUSES.map(s => (
          <button key={s} onClick={() => setFilter("status", filters.status===s?"":s)}
            className={`p-3 rounded-xl border text-center transition-all
              ${filters.status===s ? STATUS_META[s].cls+" ring-1 ring-white/20" : "bg-[#131720] border-white/5 hover:border-white/10"}`}>
            <p className={`text-lg font-bold ${filters.status===s?"":"text-white"}`}>—</p>
            <p className={`text-[11px] ${filters.status===s?"":"text-gray-400"}`}>{STATUS_META[s].label}</p>
          </button>
        ))}
      </div>
 
      {/* Filters */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <MdSearch size={16} className="text-gray-400 shrink-0"/>
          <input value={filters.search} onChange={e => setFilter("search",e.target.value)}
            placeholder="Search by order ID or customer…"
            className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500"/>
        </div>
        <select value={filters.status} onChange={e => setFilter("status",e.target.value)} className={inputCls}>
          <option value="">All Status</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
        <select value={filters.sort} onChange={e => setFilter("sort",e.target.value)} className={inputCls}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-totalAmount">Amount High→Low</option>
          <option value="totalAmount">Amount Low→High</option>
        </select>
      </div>
 
      {/* Table */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MdLocalShipping size={40} className="mx-auto mb-3 opacity-30"/>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5">
                  {["Order ID","Customer","Items","Amount","Payment","Status","Date","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#FF9900] font-mono text-xs font-semibold">{o._id?.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{o.user?.name || "Guest"}</p>
                      <p className="text-gray-500 text-[11px]">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{o.items?.length || 0} items</td>
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold text-xs">₹{o.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold
                        ${o.isPaid ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                        {o.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                        disabled={updating===o._id || o.status==="delivered" || o.status==="cancelled"}
                        className={`text-[11px] font-semibold rounded-full px-2 py-0.5 border outline-none cursor-pointer
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${STATUS_META[o.status]?.cls || "bg-gray-400/10 text-gray-400"}`}
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(o)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                        <MdVisibility size={15}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-gray-500">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-1">
              {Array.from({length:Math.min(pagination.pages,7)},(_,i)=>i+1).map(pg => (
                <button key={pg} onClick={() => setFilters(f=>({...f,page:pg}))}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                    ${filters.page===pg?"bg-[#FF9900] text-black":"text-gray-400 hover:bg-white/5"}`}>
                  {pg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
 
      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2030] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#1a2030]">
              <div>
                <h3 className="text-white font-bold">Order #{selected._id?.slice(-8).toUpperCase()}</h3>
                <p className="text-gray-400 text-xs">{new Date(selected.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white"><MdClose size={20}/></button>
            </div>
 
            <div className="p-6 space-y-5">
              {/* Status + Payment */}
              <div className="flex gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_META[selected.status]?.cls}`}>
                  {STATUS_META[selected.status]?.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${selected.isPaid?"bg-emerald-400/10 text-emerald-400":"bg-yellow-400/10 text-yellow-400"}`}>
                  {selected.isPaid?"Paid":"Payment Pending"}
                </span>
              </div>
 
              {/* Customer */}
              <div className="bg-white/[0.03] rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                <p className="text-white font-semibold">{selected.user?.name}</p>
                <p className="text-gray-400 text-sm">{selected.user?.email}</p>
              </div>
 
              {/* Shipping Address */}
              {selected.shippingAddress && (
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Shipping Address</p>
                  <p className="text-white text-sm">{selected.shippingAddress.fullName}</p>
                  <p className="text-gray-400 text-sm">
                    {selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-400 text-sm">{selected.shippingAddress.phone}</p>
                </div>
              )}
 
              {/* Items */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3">
                      <img src={item.image||"/placeholder.png"} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <p className="text-white font-semibold text-sm shrink-0">₹{(item.quantity*item.price)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Totals */}
              <div className="bg-white/[0.03] rounded-xl p-4 space-y-2">
                {[
                  ["Subtotal",      `₹${selected.subtotal?.toLocaleString()}`],
                  ["Shipping",      selected.shippingCost===0 ? "FREE" : `₹${selected.shippingCost?.toLocaleString()}`],
                  ["Discount",      selected.discount ? `-₹${selected.discount?.toLocaleString()}` : "—"],
                  ["Total",         `₹${selected.totalAmount?.toLocaleString()}`],
                ].map(([label, val]) => (
                  <div key={label} className={`flex justify-between text-sm ${label==="Total"?"font-bold text-white border-t border-white/5 pt-2":""}`}>
                    <span className={label==="Total"?"text-white":"text-gray-400"}>{label}</span>
                    <span className={label==="Discount"?"text-green-400":"text-white"}>{val}</span>
                  </div>
                ))}
              </div>
 
              {/* Update Status */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.filter(s => s!==selected.status && s!=="pending").map(s => (
                    <button key={s} onClick={() => { handleStatusChange(selected._id,s); setSelected(p=>({...p,status:s})); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80 ${STATUS_META[s].cls}`}>
                      → {STATUS_META[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Purchase