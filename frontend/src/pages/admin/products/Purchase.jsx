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
 
   

  return (
    <div>Purchase</div>
  )
}

export default Purchase