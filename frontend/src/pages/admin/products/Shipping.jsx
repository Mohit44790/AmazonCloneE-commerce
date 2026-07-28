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
  
  return (
    <div>Shipping</div>
  )
}

export default Shipping