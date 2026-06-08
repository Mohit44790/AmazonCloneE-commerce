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
const APPROVAL_STYLE = {
  true : "bg-emerald-400/10 text-emerald-400",
  false :"bg-orange-400/10 text-orange-400",
}

const GetAllProducts = () => {
  const navigate = useNavigate();
  const [products , setProducts] = useState([]);
  const [pagination , setPagination] = useState({});
  const [loading , setLoading] = useState(true);
  const [selected , setSelected] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [approveModal , setApproveModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    search :"", status:"",adminApproved:"",
    category:"", page:1, limit:15 , sort:"-createdAt",
  });

  const showToast = (msg ,type ="success") => {
    setToast({msg ,type});
    setTimeout(() => setToast(null) , 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k,v]) => {if (v !=="") params[k] = v;});
      const {data} = await productApi.getAll(params);
      setProducts(res.data.products);
      setPagination(res.pagination);
    }catch{
      showToast("Failed to load products", "error");
    }finally{setLoading(false);}
  },[filters]);

  useEffect(() => {fetchProducts();},[fetchProducts]);

  const setFilter  = (k,v) => setFilter(f => ({...f, [k]:v, page:1}));

  // select all 
  const toggleAll = () => setSelected(selected.length === products.length ? [] : products.map(p => p._id));
  const toggleOne =(id) => setSelected(p =>p.includes(id) ? p.filter(x => x !== id) : [...p,id]);

  // Delete 
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await productApi.delete(deleteModal);
      showToast("Product deleted");
      setDeleteModal(null);
      fetchProducts();
    } catch  {
      showToast("Delete failed" , "error");
      
    }finally{setActionLoading(false);}
  }

  // Approve /Reject 
  const handleApprove = async (approved) =>{
    setActionLoading(true);
    try {
      await productApi.approve(approveModal,{approved});
      showToast(approved ? "Product approved" :"Product rejected");
      setApproveModal(null);
      fetchProducts();
    } catch {
      showToast("Action failed" ,"error");
    } finally{setActionLoading(false);}
  };

  const inputCls = "bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring[#FF990]/40";


  return (
    <div className="text-white space-y-5">
      {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>

 {toast.type === "success" ? <MdCheckCircle size={18}/> : <MdCancel size={18}/>}
          {toast.msg}
          </div>
        )}

         {/* Header */}
         <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">All Products</h1>
            <p className="text-gray-400 text-sm">{pagination.total || 0} total products</p>

          </div>
          <div className="flex gap-2">
            <button onClick={fetchProducts} className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm trasition-colors">
              <MdRefresh size={16}/> Refresh
            </button>
            <Link to="/admin/create-product">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#FF9900] hover:bg-[#f0a500] text-black font-bold rounded-lg text-sm transition-colors">
              <MdAdd size={16}/> Add Product
              </button></Link>
          </div>

         </div>

         {/* Filters */}
         <div className="bg-[#131720] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3">
         <div className="flex items-center gap-2 bg-[#0f1117]border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
         <MdSearch size={16} className="text-gray-400 shrink-0"/>
        <input value={filters.search} onChange={e => setFilter("search", e.target.value)}
            placeholder="Search products…" className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500"/>


         </div>
         <select value={filters.status} onChange={e => setFilter("status",e.target.value)} className={inputCls}>
          <option value="">All Status</option>
          {["active","draft","inactive","out_of_stock","discontinued"].map(s =>
             <option key={s} value={s}>{s.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>
          )}
         </select>
         <select value={filters.adminApproved} onChange={e => setFilter("adminApproved" , e.target.value)} className={inputCls}>
          <option value="">All Approval</option>
          <option value="true">Approved</option>
          <option value="">Pending</option>
         </select>
         <select value={filters.sort} onChange={e => setFilter("sort",e.target.value)} className={inputCls}>
          <option value="-createAt">Newest First</option>
          <option value="createAt">Oldest First</option>
          <option value="-price">Price High→Low</option>
          <option value="price">Price Low→High</option>
          <option value="-salesCount">Best Selling</option>
         </select>
          {(filters.search || filters.status || filters.adminApproved) && (
            <button onClick={() => setFilters(f => ({...f,search:"",status:"",adminApproved:"",page:1}))} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm px-2">
              <MdClose size={14}/>clear

            </button>
          )}

         </div>
          {/* Table */}
          <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>

          

        </div>
      ): products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MdFilterList size={40} className="mx-auto mb-3 opacity-30"/>
          <p>No products found</p>

        </div>

      ):(
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr>
                <th>
                  <input type="text" />
                </th>
              </tr>
            </thead>

          </table>

        </div>
      )}
      
          </div>
    </div>
  )
}

export default GetAllProducts