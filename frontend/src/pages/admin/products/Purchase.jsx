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
          <p className="text-gray-400 text-sm">{pagination.total || 0} total orders</p>
        </div>
     <button onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm">
          <MdRefresh size={16}/> Refresh
        </button>

       </div>
{/* Summary Cards */}
     <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {ORDER_STATUSES.map(s => (
        <button key={s} onClick={() => setFilter("status", filters.status===s?"":s)} className={`p-3 rounded-xl border text-center transition-all ${filters.status===s ? STATUS_META[s].cls+" ring-1 ring-white/20" :"bg-[#131720] border-white/5 hover:border-white/10"}`}>
       <p className={`text-lg font-bold ${filters.status===s?"":"text-white"}`}>—</p>
            <p className={`text-[11px] ${filters.status===s?"":"text-gray-400"}`}>{STATUS_META[s].label}</p>
          </button>
        ))}

     </div>

        {/* Filters */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3">

      <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
      <MdSearch size={16} className="text-gray-400 shrink-0"/>
      <input value={filters.search} onChange={e => setFilter("search",e.target.value)} placeholder="Search by order ID or customer..." className="bg-transparent text-sm text-sm text-white outline-none w-full placeholder:text-gray-500"/>
      </div>
      <select></select>
      </div>

      </div>
  )
}

export default Purchase