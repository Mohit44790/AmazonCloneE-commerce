import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../../apiData/api/productApi";
import {
  MdSearch, MdFilterList, MdEdit, MdDelete, MdCheckCircle,
  MdCancel, MdVisibility, MdAdd, MdRefresh, MdClose,
} from "react-icons/md";


const STATUS_STYLE ={
  active : "bg-emerald-400/10 text-emerald-400 border border-emarald-400/20",
  draft  : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  inactive : "bg-gray-400/10 text-gray-400 border border-gray-400/20",
  out_of_stock :"bg-red-400/10 text-red-400 border border-red-400/20",
  discontinued : "bg-purple-400/10 text-purple-400 border border-purple-400/20",
}

const GetAllProducts = () => {
  return (
    <div className='text-white'>All</div>
  )
}

export default GetAllProducts