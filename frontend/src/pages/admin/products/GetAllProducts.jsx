import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../../apiData/api/productApi";
import {
  MdSearch, MdFilterList, MdEdit, MdDelete, MdCheckCircle,
  MdCancel, MdVisibility, MdAdd, MdRefresh, MdClose,
} from "react-icons/md";


// const STATUS_STYLE

const GetAllProducts = () => {
  return (
    <div className='text-white'>All</div>
  )
}

export default GetAllProducts