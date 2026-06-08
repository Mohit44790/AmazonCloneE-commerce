import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../../apiData/api/productApi";
import {
  MdSearch, MdFilterList, MdEdit, MdDelete, MdCheckCircle,
  MdCancel, MdVisibility, MdAdd, MdRefresh, MdClose,
} from "react-icons/md";
 
const STATUS_STYLE = {
  active:       "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  draft:        "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  inactive:     "bg-gray-400/10 text-gray-400 border border-gray-400/20",
  out_of_stock: "bg-red-400/10 text-red-400 border border-red-400/20",
  discontinued: "bg-purple-400/10 text-purple-400 border border-purple-400/20",
};
 
const APPROVAL_STYLE = {
  true:  "bg-emerald-400/10 text-emerald-400",
  false: "bg-orange-400/10 text-orange-400",
};

const GetAllProducts = () => {
  const navigate = useNavigate();
 
  const [products, setProducts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
 
  const [filters, setFilters] = useState({
    search: "", status: "", adminApproved: "",
    category: "", page: 1, limit: 15, sort: "-createdAt",
  });
 
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
 
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== "") params[k] = v; });
      const res = await productApi.getAll(params);
      setProducts(res.data.products);
      setPagination(res.pagination);
    } catch { showToast("Failed to load products", "error"); }
    finally { setLoading(false); }
  }, [filters]);
 
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
 
  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));
 
  /* ── Select all ── */
  const toggleAll = () =>
    setSelected(selected.length === products.length ? [] : products.map(p => p._id));
  const toggleOne = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
 
  /* ── Delete ── */
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await productApi.delete(deleteModal);
      showToast("Product deleted");
      setDeleteModal(null);
      fetchProducts();
    } catch { showToast("Delete failed", "error"); }
    finally { setActionLoading(false); }
  };
 
  /* ── Approve / Reject ── */
  const handleApprove = async (approved) => {
    setActionLoading(true);
    try {
      await productApi.approve(approveModal, { approved });
      showToast(approved ? "Product approved" : "Product rejected");
      setApproveModal(null);
      fetchProducts();
    } catch { showToast("Action failed", "error"); }
    finally { setActionLoading(false); }
  };
 
  const inputCls = "bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF9900]/40";


  return (
   <div className="text-white space-y-5">
 
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2
          ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
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
          <button onClick={fetchProducts}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-gray-400
              hover:text-white rounded-lg text-sm transition-colors">
            <MdRefresh size={16}/> Refresh
          </button>
          <Link to="/admin/create-product">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#FF9900] hover:bg-[#f0a500]
              text-black font-bold rounded-lg text-sm transition-colors">
              <MdAdd size={16}/> Add Product
            </button>
          </Link>
        </div>
      </div>
 
      {/* Filters */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <MdSearch size={16} className="text-gray-400 shrink-0"/>
          <input value={filters.search} onChange={e => setFilter("search", e.target.value)}
            placeholder="Search products…" className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500"/>
        </div>
        <select value={filters.status} onChange={e => setFilter("status", e.target.value)} className={inputCls}>
          <option value="">All Status</option>
          {["active","draft","inactive","out_of_stock","discontinued"].map(s =>
            <option key={s} value={s}>{s.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>
          )}
        </select>
        <select value={filters.adminApproved} onChange={e => setFilter("adminApproved", e.target.value)} className={inputCls}>
          <option value="">All Approval</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
        <select value={filters.sort} onChange={e => setFilter("sort", e.target.value)} className={inputCls}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-price">Price High→Low</option>
          <option value="price">Price Low→High</option>
          <option value="-salesCount">Best Selling</option>
        </select>
        {(filters.search || filters.status || filters.adminApproved) && (
          <button onClick={() => setFilters(f => ({ ...f, search: "", status: "", adminApproved: "", page: 1 }))}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-sm px-2">
            <MdClose size={14}/> Clear
          </button>
        )}
      </div>
 
      {/* Table */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MdFilterList size={40} className="mx-auto mb-3 opacity-30"/>
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" checked={selected.length === products.length}
                      onChange={toggleAll} className="accent-[#FF9900]"/>
                  </th>
                  {["Product","Price","Stock","Status","Approval","Sales","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {products.map(p => (
                  <tr key={p._id} className={`hover:bg-white/[0.02] transition-colors ${selected.includes(p._id) ? "bg-[#FF9900]/5" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(p._id)}
                        onChange={() => toggleOne(p._id)} className="accent-[#FF9900]"/>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url || "/placeholder.png"} alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"/>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-xs truncate max-w-[180px]">{p.name}</p>
                          <p className="text-gray-500 text-[11px]">{p.brand}</p>
                          <p className="text-gray-600 text-[10px] font-mono">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold">₹{p.price?.toLocaleString()}</p>
                      {p.comparePrice && <p className="text-gray-500 text-xs line-through">₹{p.comparePrice?.toLocaleString()}</p>}
                      {p.discount > 0 && <p className="text-green-400 text-[11px]">{p.discount}% off</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm font-semibold ${p.stock === 0 ? "text-red-400" : p.stock < 10 ? "text-yellow-400" : "text-white"}`}>
                        {p.stock}
                      </p>
                      {p.stock < 10 && p.stock > 0 && <p className="text-yellow-500 text-[10px]">Low stock</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLE[p.status] || ""}`}>
                        {p.status?.replace("_"," ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${APPROVAL_STYLE[p.adminApproved]}`}>
                        {p.adminApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.salesCount || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/products/${p.slug}`)} title="View"
                          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                          <MdVisibility size={15}/>
                        </button>
                        <button onClick={() => navigate(`/admin/update-product/${p._id}`)} title="Edit"
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-colors">
                          <MdEdit size={15}/>
                        </button>
                        {!p.adminApproved && (
                          <button onClick={() => setApproveModal(p._id)} title="Approve"
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 transition-colors">
                            <MdCheckCircle size={15}/>
                          </button>
                        )}
                        <button onClick={() => setDeleteModal(p._id)} title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                          <MdDelete size={15}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.pages} · {pagination.total} results
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(pg => (
                <button key={pg} onClick={() => setFilters(f => ({ ...f, page: pg }))}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                    ${filters.page === pg ? "bg-[#FF9900] text-black" : "text-gray-400 hover:bg-white/5"}`}>
                  {pg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
 
      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2030] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently delete the product and all its images. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} disabled={actionLoading}
                className="flex-1 py-2 border border-white/10 text-gray-400 rounded-xl text-sm hover:text-white">Cancel</button>
              <button onClick={handleDelete} disabled={actionLoading}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                {actionLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2030] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Approve Product?</h3>
            <p className="text-gray-400 text-sm mb-6">Approve or reject this product listing.</p>
            <div className="flex gap-3">
              <button onClick={() => setApproveModal(null)} disabled={actionLoading}
                className="flex-1 py-2 border border-white/10 text-gray-400 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handleApprove(false)} disabled={actionLoading}
                className="flex-1 py-2 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl text-sm">Reject</button>
              <button onClick={() => handleApprove(true)} disabled={actionLoading}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                {actionLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GetAllProducts