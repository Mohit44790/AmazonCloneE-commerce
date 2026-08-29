// pages/Cart.jsx
// ⚠️  Keep the import path IDENTICAL to the one used in ProductDetail.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCartStore,
  selectItems, selectRemoveItem, selectUpdateQty, selectClearCart,
} from "../../apiData/store/cartStore";
import { orderApi }     from "../../apiData/api/orderApi";
import { useAuthStore } from "../../apiData/store/authStore";
import {
  MdDelete, MdAdd, MdRemove, MdSecurity,
  MdLocalShipping, MdArrowBack, MdCheckCircle,
} from "react-icons/md";

const STEPS = ["Cart", "Address", "Payment", "Review"];

/* ────────────────── Address Form ────────────────── */
const AddressForm = ({ address, setAddress }) => {
  const set = k => e => setAddress(a => ({ ...a, [k]: e.target.value }));
  const cls = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20";
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <input value={address.fullName} onChange={set("fullName")} placeholder="Full Name *" className={cls}/>
        </div>
        <input value={address.phone}   onChange={set("phone")}   placeholder="Mobile Number *" className={cls}/>
        <input value={address.pincode} onChange={set("pincode")} placeholder="Pincode *" maxLength={6} className={cls}/>
        <div className="sm:col-span-2">
          <input value={address.street} onChange={set("street")} placeholder="House No., Building, Street, Area *" className={cls}/>
        </div>
        <input value={address.city}  onChange={set("city")}  placeholder="City *"  className={cls}/>
        <input value={address.state} onChange={set("state")} placeholder="State *" className={cls}/>
        <div className="sm:col-span-2">
          <select value={address.addressType} onChange={set("addressType")} className={cls}>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

/* ────────────────── Payment Form ────────────────── */
const PaymentForm = ({ method, setMethod }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
    {[
      { id:"cod",     label:"Cash on Delivery",   icon:"💵" },
      { id:"upi",     label:"UPI / QR Code",       icon:"📲" },
      { id:"card",    label:"Credit / Debit Card", icon:"💳" },
      { id:"netbank", label:"Net Banking",         icon:"🏦" },
    ].map(({ id, label, icon }) => (
      <label key={id}
        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
          ${method === id ? "border-[#FF9900] bg-[#FFF3E0]" : "border-gray-200 hover:border-gray-300"}`}>
        <input type="radio" name="payment" value={id}
          checked={method === id} onChange={() => setMethod(id)} className="accent-[#FF9900]"/>
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {id === "cod" && (
          <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
            Available
          </span>
        )}
      </label>
    ))}
    {method === "card" && (
      <div className="p-4 bg-gray-50 rounded-xl space-y-3">
        <input placeholder="Card Number" maxLength={19}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900]"/>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="MM / YY"
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900]"/>
          <input placeholder="CVV" maxLength={4}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900]"/>
        </div>
        <input placeholder="Name on Card"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900]"/>
      </div>
    )}
    {method === "upi" && (
      <div className="p-4 bg-gray-50 rounded-xl">
        <input placeholder="Enter UPI ID (e.g. name@upi)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900]"/>
      </div>
    )}
  </div>
);

/* ═══════════════════════ CART PAGE ═══════════════════════ */
export default function Cart() {
  const navigate = useNavigate();

  /* ✅ Each selector is its own subscription — no re-render bugs */
  const items      = useCartStore(selectItems);
  const removeItem = useCartStore(selectRemoveItem);
  const updateQty  = useCartStore(selectUpdateQty);
  const clearCart  = useCartStore(selectClearCart);
  const user       = useAuthStore(s => s.user);

  const [step,    setStep]    = useState(0);
  const [address, setAddress] = useState({
    fullName:"", phone:"", pincode:"",
    street:"", city:"", state:"", addressType:"home",
  });
  const [payment,       setPayment]       = useState("cod");
  const [placing,       setPlacing]       = useState(false);
  const [orderId,       setOrderId]       = useState(null);
  const [coupon,        setCoupon]        = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  /* Derived totals */
  const subtotal  = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping  = subtotal >= 499 ? 0 : 40;
  const discount  = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total     = subtotal + shipping - discount;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const validateAddress = () => {
    const { fullName, phone, pincode, street, city, state } = address;
    return fullName && phone && pincode.length === 6 && street && city && state;
  };

  const handlePlaceOrder = async () => {
    if (!user) { navigate("/login"); return; }
    setPlacing(true);
    try {
      const order = await orderApi.create({
        items: items.map(i => ({
          product:  i.product._id,
          name:     i.product.name,
          image:    i.product.images?.[0]?.url,
          price:    i.product.price,
          quantity: i.quantity,
          size:     i.options?.size,
          color:    i.options?.color,
        })),
        shippingAddress: address,
        paymentMethod:   payment,
        subtotal, shippingCost: shipping, discount, totalAmount: total,
        couponCode: couponApplied ? coupon : undefined,
      });
      setOrderId(order._id);
      clearCart();
      setStep(4);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed. Try again.");
    } finally { setPlacing(false); }
  };

  /* ── Empty cart screen ── */
  if (items.length === 0 && step !== 4) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <img
        src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB424694257_.svg"
        alt="Empty cart" className="w-48 mb-6 opacity-60"/>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your Amazon Cart is empty</h2>
      <p className="text-gray-500 text-sm mb-6">Add items to get started</p>
      <Link to="/products">
        <button className="px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-full text-sm">
          Shop Now
        </button>
      </Link>
    </div>
  );

  /* ── Order success screen ── */
  if (step === 4) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <MdCheckCircle size={72} className="text-green-500 mb-4"/>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-2">Thank you for your order 🎉</p>
      {orderId && (
        <p className="text-sm text-gray-500 mb-6 font-mono">
          Order ID: #{orderId.slice(-10).toUpperCase()}
        </p>
      )}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link to="/my-orders">
          <button className="px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-full text-sm">
            Track Order
          </button>
        </Link>
        <Link to="/">
          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:border-gray-500 rounded-full text-sm">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-6">

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${i < step ? "bg-[#FF9900] text-black"
                    : i === step ? "bg-[#FF9900] text-black ring-4 ring-[#FF9900]/20"
                    : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-xs mt-1 ${i <= step ? "text-[#FF9900] font-semibold" : "text-gray-400"}`}>{s}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-20 mb-5 ${i < step ? "bg-[#FF9900]" : "bg-gray-200"}`}/>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Step 0 — Items */}
            {step === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Shopping Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </h2>
                  <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-xs font-medium">
                    Remove all
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map(item => (
                    <div key={item.key} className="flex gap-4 py-4">
                      <img
                        src={item.product.images?.[0]?.url || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.slug}`}
                          className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2 leading-snug">
                          {item.product.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.options?.size  && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Size: {item.options.size}</span>}
                          {item.options?.color && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Color: {item.options.color}</span>}
                        </div>
                        {item.product.shipping?.freeShipping
                          ? <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><MdLocalShipping size={12}/> FREE Delivery</p>
                          : <p className="text-gray-500 text-xs mt-1">Delivery: ₹40</p>}

                        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQty(item.key, item.quantity - 1)}
                              className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600"><MdRemove size={14}/></button>
                            <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200">{item.quantity}</span>
                            <button onClick={() => updateQty(item.key, item.quantity + 1)}
                              className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600"><MdAdd size={14}/></button>
                          </div>
                          <button onClick={() => removeItem(item.key)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
                            <MdDelete size={14}/> Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">₹{item.product.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setStep(1)}
                  className="w-full mt-4 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-full text-sm transition-colors">
                  Proceed to Buy ({itemCount} item{itemCount !== 1 ? "s" : ""})
                </button>
              </div>
            )}

            {/* Step 1 — Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <AddressForm address={address} setAddress={setAddress}/>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm">
                    <MdArrowBack size={16}/> Back
                  </button>
                  <button
                    onClick={() => { if (validateAddress()) setStep(2); else alert("Please fill all required fields."); }}
                    className="flex-1 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-full text-sm">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <PaymentForm method={payment} setMethod={setPayment}/>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm">
                    <MdArrowBack size={16}/> Back
                  </button>
                  <button onClick={() => setStep(3)}
                    className="flex-1 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold rounded-full text-sm">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>

                <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-800">{address.fullName}</p>
                    <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} — {address.pincode}</p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-blue-600 text-xs hover:underline shrink-0">Change</button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">{payment==="cod"?"💵":payment==="upi"?"📲":payment==="card"?"💳":"🏦"}</span>
                  <p className="font-semibold text-gray-800 text-sm">
                    {payment==="cod"?"Cash on Delivery":payment==="upi"?"UPI":payment==="card"?"Card":"Net Banking"}
                  </p>
                  <button onClick={() => setStep(2)} className="ml-auto text-blue-600 text-xs hover:underline">Change</button>
                </div>

                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.key} className="flex items-center gap-3">
                      <img src={item.product.images?.[0]?.url || "/placeholder.png"}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"/>
                      <p className="flex-1 text-sm text-gray-700 line-clamp-1">{item.product.name} × {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm">
                    <MdArrowBack size={16}/> Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={placing}
                    className="flex-1 py-2.5 bg-[#FF9900] hover:bg-[#f0a500] text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                    {placing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: Summary ── */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Order Summary</h3>

              {step === 0 && (
                <div className="flex gap-2">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FF9900]"/>
                  <button onClick={() => { if (coupon) setCouponApplied(true); }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                    Apply
                  </button>
                </div>
              )}
              {couponApplied && <p className="text-green-600 text-xs">✓ Coupon applied! 10% off</p>}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({itemCount})</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span><span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Order Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {discount === 0 && subtotal > 0 && subtotal < 499 && (
                <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  Add ₹{499 - subtotal} more for FREE delivery
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1 border-t border-gray-100">
                <MdSecurity size={14}/><span>Safe and Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}