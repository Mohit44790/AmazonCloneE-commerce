
// pages/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi } from "../../apiData/api/orderApi";
import {
  MdLocalShipping, MdCheckCircle, MdCancel, MdClose,
  MdArrowBack, MdStar, MdReceipt,
} from "react-icons/md";

const STATUS_META = {
  pending:    { cls:"bg-yellow-100 text-yellow-700",  icon:"🕐", label:"Order Placed"  },
  confirmed:  { cls:"bg-blue-100 text-blue-700",      icon:"✅", label:"Confirmed"     },
  processing: { cls:"bg-purple-100 text-purple-700",  icon:"📦", label:"Processing"    },
  shipped:    { cls:"bg-cyan-100 text-cyan-700",      icon:"🚚", label:"Shipped"       },
  delivered:  { cls:"bg-green-100 text-green-700",    icon:"🎉", label:"Delivered"     },
  cancelled:  { cls:"bg-red-100 text-red-700",        icon:"❌", label:"Cancelled"     },
  returned:   { cls:"bg-gray-100 text-gray-700",      icon:"↩️", label:"Returned"      },
};

const STEPS = ["pending","confirmed","processing","shipped","delivered"];

function TrackProgress({ status }) {
  const current = STEPS.indexOf(status);
  if (current === -1) return null;
  return (
    <div className="flex items-center gap-0 my-4 overflow-x-auto pb-2">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center min-w-[60px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
              ${i<current?"bg-green-500 text-white":i===current?"bg-[#FF9900] text-black ring-4 ring-[#FF9900]/20":"bg-gray-100 text-gray-400"}`}>
              {i<current?"✓":STATUS_META[s]?.icon}
            </div>
            <p className={`text-[10px] mt-1 text-center leading-tight whitespace-nowrap px-1
              ${i<=current?"text-gray-800 font-medium":"text-gray-400"}`}>
              {STATUS_META[s].label}
            </p>
          </div>
          {i<STEPS.length-1 && (
            <div className={`h-0.5 flex-1 min-w-[20px] mb-5 transition-all ${i<current?"bg-green-500":"bg-gray-200"}`}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail,  setDetail]  = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data);
      } catch { setOrders([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    try {
      await orderApi.cancel(orderId);
      setOrders(p => p.map(o => o._id===orderId ? { ...o, status:"cancelled" } : o));
      if (detail?._id===orderId) setDetail(p => ({ ...p, status:"cancelled" }));
    } catch { alert("Cancellation failed."); }
    finally { setCancelling(null); }
  };

  const FILTERS = [
    { v:"all",       l:"All Orders" },
    { v:"pending",   l:"Pending"    },
    { v:"shipped",   l:"Shipped"    },
    { v:"delivered", l:"Delivered"  },
    { v:"cancelled", l:"Cancelled"  },
  ];

  const filtered = filter==="all" ? orders : orders.filter(o => o.status===filter);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-8 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={()=>navigate(-1)} className="text-gray-500 hover:text-gray-700 p-1"><MdArrowBack size={22}/></button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 text-sm">{orders.length} order{orders.length!==1?"s":""} placed</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-5">
          {FILTERS.map(f => (
            <button key={f.v} onClick={()=>setFilter(f.v)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0
                ${filter===f.v ? "bg-[#FF9900] text-black" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
              {f.l}
            </button>
          ))}
        </div>

        {/* Empty */}
        {filtered.length===0 && (
          <div className="text-center py-20 text-gray-400">
            <MdReceipt size={48} className="mx-auto mb-3 opacity-20"/>
            <p className="text-lg font-semibold text-gray-700">No orders found</p>
            <p className="text-sm mt-1">Your order history is empty</p>
            <Link to="/products">
              <button className="mt-4 px-6 py-2.5 bg-[#FFD814] text-gray-900 font-bold rounded-full text-sm">
                Start Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Order Cards */}
        <div className="space-y-4">
          {filtered.map(order => {
            const meta = STATUS_META[order.status] || STATUS_META.pending;
            const canCancel = ["pending","confirmed"].includes(order.status);
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">

                {/* Order Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-500">Order ID:</span>
                    <span className="text-xs font-mono font-bold text-gray-800">#{order._id?.slice(-10).toUpperCase()}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${meta.cls}`}>
                    {meta.icon} {meta.label}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-4">
                  {order.items?.slice(0,2).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 mb-3 last:mb-0">
                      <img src={item.image||"/placeholder.png"} alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {item.size  && <span className="text-xs text-gray-500">Size: {item.size}</span>}
                          {item.color && <span className="text-xs text-gray-500">Color: {item.color}</span>}
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-xs text-blue-600 mt-2">+{order.items.length-2} more item{order.items.length-2!==1?"s":""}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Order Total: </span>
                    <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                    {order.isPaid && <span className="text-xs text-green-600 ml-2 font-medium">Paid</span>}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Rate product — only if delivered */}
                    {order.status==="delivered" && (
                      <button className="flex items-center gap-1 text-xs text-[#FF9900] border border-[#FF9900] px-3 py-1.5 rounded-full font-medium hover:bg-[#FFF3E0] transition-colors">
                        <MdStar size={14}/> Rate & Review
                      </button>
                    )}

                    {/* Cancel */}
                    {canCancel && (
                      <button onClick={()=>handleCancel(order._id)} disabled={cancelling===order._id}
                        className="flex items-center gap-1 text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                        <MdCancel size={14}/>
                        {cancelling===order._id ? "Cancelling…" : "Cancel Order"}
                      </button>
                    )}

                    {/* Track */}
                    {["shipped","processing","confirmed"].includes(order.status) && (
                      <button onClick={()=>setDetail(order)}
                        className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full font-medium hover:bg-blue-50 transition-colors">
                        <MdLocalShipping size={14}/> Track Order
                      </button>
                    )}

                    <button onClick={()=>setDetail(order)}
                      className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full font-medium hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Order Detail Modal ── */}
      {detail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-2xl overflow-y-auto rounded-t-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-gray-900">Order Details</h3>
                <p className="text-xs text-gray-500 font-mono">#{detail._id?.slice(-10).toUpperCase()}</p>
              </div>
              <button onClick={()=>setDetail(null)} className="text-gray-400 hover:text-gray-700 p-1">
                <MdClose size={22}/>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Track Progress */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">Order Status</p>
                <TrackProgress status={detail.status}/>
                {detail.status==="cancelled" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
                    <MdCancel size={18}/> This order was cancelled.
                  </div>
                )}
                {detail.status==="delivered" && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-xl px-4 py-3">
                    <MdCheckCircle size={18}/>
                    Delivered on {new Date(detail.updatedAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
                  </div>
                )}
              </div>

              {/* Address */}
              {detail.shippingAddress && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Delivery Address</p>
                  <p className="font-semibold text-gray-800">{detail.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{detail.shippingAddress.street}</p>
                  <p className="text-sm text-gray-600">{detail.shippingAddress.city}, {detail.shippingAddress.state} — {detail.shippingAddress.pincode}</p>
                  <p className="text-sm text-gray-500 mt-0.5">📞 {detail.shippingAddress.phone}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {detail.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.image||"/placeholder.png"} className="w-12 h-12 rounded-lg object-cover"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {item.size  && <span className="text-xs text-gray-500">Size: {item.size}</span>}
                          {item.color && <span className="text-xs text-gray-500">Color: {item.color}</span>}
                        </div>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 shrink-0">₹{(item.price*item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Price Details</p>
                {[
                  ["Subtotal",         `₹${detail.subtotal?.toLocaleString()}`],
                  ["Delivery",         detail.shippingCost===0?"FREE":`₹${detail.shippingCost?.toLocaleString()}`],
                  ...(detail.discount ? [["Discount", `-₹${detail.discount?.toLocaleString()}`]] : []),
                ].map(([l,v])=>(
                  <div key={l} className="flex justify-between text-sm text-gray-600"><span>{l}</span><span>{v}</span></div>
                ))}
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span><span>₹{detail.totalAmount?.toLocaleString()}</span>
                </div>
                <p className={`text-xs font-medium mt-1 ${detail.isPaid?"text-green-600":"text-orange-500"}`}>
                  {detail.isPaid ? "✓ Payment Complete" : "⏳ Payment Pending"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {["pending","confirmed"].includes(detail.status) && (
                  <button onClick={()=>handleCancel(detail._id)} disabled={cancelling===detail._id}
                    className="flex-1 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                    {cancelling===detail._id && <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/>}
                    Cancel Order
                  </button>
                )}
                {detail.status==="delivered" && (
                  <button className="flex-1 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5">
                    <MdStar size={16}/> Rate & Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}