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
 


const Shipping = () => {
  return (
    <div>Shipping</div>
  )
}

export default Shipping