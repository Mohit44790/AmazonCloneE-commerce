import React, { useState, useEffect, useCallback } from "react";
import { orderApi } from "../../../apiData/api/orderApi";
import {
  MdLocalShipping, MdSearch, MdRefresh, MdCheckCircle,
  MdError, MdClose, MdVisibility,
} from "react-icons/md";
 
const SHIP_STATUSES = ["confirmed","processing","shipped","delivered"];
 
const STATUS_META = {
  confirmed:  { cls:"bg-blue-400/10 text-blue-400 border border-blue-400/20",     label:"Confirmed",   step:0 },
  processing: { cls:"bg-purple-400/10 text-purple-400 border border-purple-400/20",label:"Processing",  step:1 },
  shipped:    { cls:"bg-cyan-400/10 text-cyan-400 border border-cyan-400/20",      label:"Shipped",     step:2 },
  delivered:  { cls:"bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",label:"Delivered",step:3 },
};
 
function ShipmentProgress ({status}){
  const currentStep = STATUS_META[status]?.step ?? -1;
  return (
    <div className="flex items-center gap-0">
      {SHIP_STATUSES.map((s,i)=> (
        <div key={s}>
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i <= currentStep ? "bg-[#FF9900} text-black":"bg-white/10 text-gray-600"}`}>
      {i < currentStep ? "✓" : i + 1}

            </div>
 <p className={`text-[9px] mt-0.5 whitespace-nowrap ${i<=currentStep?"text-[#FF9900]":"text-gray-600"}`}>
              {STATUS_META[s].label}
            </p>
          </div>
{i < SHIP_STATUSES.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 mb-3 transition-all ${i < currentStep ? "bg-[#FF9900]" : "bg-white/10"}`}/>
          )}
        </div>
      ))}

    </div>
  );
}



const Shipping = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [detail, setDetails] = useState(null);
  const [toast, setToast] = useState(null);
  const [updating,setUpdating] = useState(null);
  const [trackig, setTracking] = useState({});

  const[filters,setFilters] = useState({
    status:"confirmed", search:"", page: 1, limit:15, sort:"-createdAt"
  });

  const showToast =(msg, type = "success") => {
    setToast({msg,type}); setTimeout(() => setToast(null),3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {...filters};
      if(!params.status) delete params.status;
      const res = await orderApi.getAll(params);
      setOrders(res.data?.orders || []);
      setPagination(res.pagination || {});
    } catch { showToast("Failed to load shipments","error");
      
    } finally{
      setLoading(false);
    }
  },[filters]);

  useEffect(() => {fetchOrders();},[fetchOrders]);

  const setFilter = (k,v) => setFilters(f =>({...f, [k]: v, page:1}));

  const handleStatusUpdate = async (orderId, newStatus) =>{
    setUpdating(orderId);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      showToast(`Marked as ${newStatus}`);
      fetchOrders();
    } catch { showToast("Update Failed","error");
      
    }finally{
      setUpdating(null);
    }
  }

  const NEXT_STATUS = {
    confirmed:"processing" ,processing:"shipped",shipped:"delivered",
  }

  const inputCls = "bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring [#FF9900]/40";

  return (
    <div className="text-white space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2 ${toast.type==="success"?"bg-emerald-500":"bg-red-500"} text-white`}>
          {toast.type==="success"?<MdCheckCircle size={18}/>:<MdError size={18}/>}{toast.msg}

        </div>
      )}
      {/* Header */}

      <div className="flex items-center justify-between flex-wrap gap-3">
         <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Shipping</h1>
          <p className="text-gray-400 text-sm">Manage and track shipments</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm">
          <MdRefresh size={16}/> Refresh
        </button>
      </div>

      {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 flex-wrap">
        {[{v:"",l:"All"},
          ...SHIP_STATUSES.map(s=>({v:s,l:STATUS_META[s].label})),
          {v:"cancelled",l:"Cancelled"}
        ].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter("status", v)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-w-[70px]
              ${filters.status===v ? "bg-[#FF9900] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {l}
          </button>
        ))}
      </div>
{/* Search */}
<div className="bg-[#131720] border border-white/5 rounded-xl p-3">
  <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2">
  <MdSearch size={16} className="text-gray-400 shrink-0"/>
  <input value={filters.search} onChange={e => setFilter("search",e.target.value)} placeholder="Search orders..." className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500" />

  </div>
</div>
  {/* Cards Grid */}
  {loading ? (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#FF9900} border-t-transparent rounded-full animate-spin">

      </div>
         
    </div>
  ):orders.length === 0 ? (
    <div className="text-center py-20 text-gray-500">
      <MdLocalShipping size={48} className="mx-auto mb-3 opacity-20"/>
      <p>No shipments found</p>

    </div>
  ):(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {
        orders.map(o => (
          <div key={o._id} className="bg-[#131720] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/10 transition-colors ">
           {/* Order ID + Date */}
           <div className="flex items-start justify-between">
              <div>
                  <p className="text-[#FF9900] font-mono text-xs font-bold">#{o._id?.slice(-8).toUpperCase()}</p>
                  <p className="text-gray-500 text-[11px]">{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                </div>
 <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${STATUS_META[o.status]?.cls || "bg-gray-400/10 text-gray-400"}`}>
                  {STATUS_META[o.status]?.label || o.status}
                </span>
           </div>
               {/* Customer */}

               <div className="bg-white/[0.03] rounded-xl px-3 py-2">
          <p className="text-white text-sm font-medium">{o.user?.name || "Guest"}</p>
           {o.shippingAddress && (
              <p className="text-gray-400 text-[11px] leading-tight mt-0.5">
                    {o.shippingAddress.city}, {o.shippingAddress.state} — {o.shippingAddress.pincode}
                  </p>
           )}
               </div>

                {/* Progress Bar */}
                {STATUS_META[o.status] && (
                  <div className="overflow-x-auto">
                    <ShipmentProgress status={o.status}/>

                  </div>
                )}

                {/* Items summary */}
                <div className="flex items-center gap-2 ">
                 <div className="flex -space-x-2">
                  {o.items?.slice(0,3).map((items,i) => (
                    <img key={i} src={items.image || "/placeholder.png"} className="w-8 h-8 rounded-lg object-cover border-2 border-[#131720]" />
                  ))}
                  {o.items?.length > 3 && (
                    <div className="w-8 h-8 rounded-lg bg-white/5 border-2 border-[#131720] flex items-center justify-center text-[10px] text-gray-400">
                      +{o.items.length-3}

                    </div>
                  )}
                  </div>

                  <div className="flex-1">
                    <p>{o.items?.length} item{o.items.length!==1?"s":""}</p>


                  </div>

                </div>
                {/* Tracking Number Input */}
                {(o.status==="processing" || o.status==="shipped") && (
                  <div className="flex gap-2">
                    <input value={trackig[o._id] ||o.trackingNumber||""}
                    onChange={e => setTracking(p=>({...p,[o._id]:e.target.value}))}
                    placeholder="Tracking Number"
                    className="flex-1 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#FF9900]/40" />

                  </div>
                )}

                

          </div>
        ))
      }
    </div>
  )}

      </div>
    </div>
  )
  return (
    <div>Shipping</div>
  )
}

export default Shipping