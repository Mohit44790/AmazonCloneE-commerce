import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdSearch, MdRefresh, MdClose, MdPerson,
  MdCheckCircle, MdError, MdBlock, MdVerified,
} from "react-icons/md";

const ROLE_META = {
  customer:   { cls: "bg-blue-400/10 text-blue-400 border border-blue-400/20",     label: "Customer"   },
  seller:     { cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20", label: "Seller"     },
  admin:      { cls: "bg-orange-400/10 text-orange-400 border border-orange-400/20", label: "Admin"      },
  superadmin: { cls: "bg-red-400/10 text-red-400 border border-red-400/20",          label: "Super Admin" },
};

const STATUS_META = {
  active:   { cls: "bg-emerald-400/10 text-emerald-400", label: "Active"   },
  inactive: { cls: "bg-gray-400/10 text-gray-400",       label: "Inactive" },
  banned:   { cls: "bg-red-400/10 text-red-400",         label: "Banned"   },
};

const Customers = () => {
  const [users,      setUsers]      = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [toast,      setToast]      = useState(null);
  const [updating,   setUpdating]   = useState(null);

  const [filters, setFilters] = useState({
    role: "", status: "", search: "", page: 1, limit: 15, sort: "-createdAt",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== "") params[k] = v; });
      const { data } = await api.get("/users", { params });
      setUsers(data.data?.users || []);
      setPagination(data.pagination || {});
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  const handleBan = async (userId, ban) => {
    setUpdating(userId);
    try {
      await api.patch(`/users/${userId}/${ban ? "ban" : "unban"}`);
      showToast(ban ? "User banned" : "User unbanned");
      fetchUsers();
      if (selected?._id === userId)
        setSelected(p => ({ ...p, isBanned: ban }));
    } catch (err) {
      showToast(err?.response?.data?.message || "Action failed", "error");
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setUpdating(userId);
    try {
      await api.patch(`/users/${userId}/role`, { role });
      showToast("Role updated");
      fetchUsers();
      if (selected?._id === userId) setSelected(p => ({ ...p, role }));
    } catch (err) {
      showToast(err?.response?.data?.message || "Update failed", "error");
    } finally {
      setUpdating(null);
    }
  };

  const getUserStatus = (u) =>
    u.isBanned ? "banned" : u.isActive ? "active" : "inactive";

  const inputCls =
    "bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF9900]/40";

  const stats = [
    { label: "Total",    val: pagination.totalCount || 0,                                    cls: "text-white"         },
    { label: "Customer", val: users.filter(u => u.role === "customer").length,               cls: "text-blue-400"      },
    { label: "Seller",   val: users.filter(u => u.role === "seller").length,                 cls: "text-purple-400"    },
    { label: "Admin",    val: users.filter(u => ["admin","superadmin"].includes(u.role)).length, cls: "text-orange-400" },
    { label: "Banned",   val: users.filter(u => u.isBanned).length,                         cls: "text-red-400"       },
  ];

  return (
    <div className="text-white space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2
          ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"} text-white`}>
          {toast.type === "success" ? <MdCheckCircle size={18} /> : <MdError size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Customers & Users</h1>
          <p className="text-gray-400 text-sm">{pagination.totalCount || 0} total users</p>
        </div>
        <button onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm">
          <MdRefresh size={16} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-[#131720] border border-white/5 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <MdSearch size={16} className="text-gray-400 shrink-0" />
          <input
            value={filters.search}
            onChange={e => setFilter("search", e.target.value)}
            placeholder="Search by name or email…"
            className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500"
          />
        </div>

        <select value={filters.role} onChange={e => setFilter("role", e.target.value)} className={inputCls}>
          <option value="">All Roles</option>
          {Object.entries(ROLE_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select value={filters.sort} onChange={e => setFilter("sort", e.target.value)} className={inputCls}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name A→Z</option>
          <option value="-name">Name Z→A</option>
          <option value="-totalOrders">Most Orders</option>
          <option value="-totalSpent">Most Spent</option>
        </select>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 flex-wrap">
        {[{ v: "", l: "All" }, ...Object.entries(ROLE_META).map(([k, v]) => ({ v: k, l: v.label }))].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter("role", v)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all min-w-[60px]
              ${filters.role === v ? "bg-[#FF9900] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MdPerson size={48} className="mx-auto mb-3 opacity-20" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-white/5">
                  {["User", "Role", "Status", "Orders", "Spent", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map(u => {
                  const status = getUserStatus(u);
                  return (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FF9900]/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {u.avatar?.url
                              ? <img src={u.avatar.url} alt={u.name} className="w-full h-full object-cover" />
                              : <span className="text-[#FF9900] font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
                            }
                          </div>
                          <div>
                            <p className="text-white text-xs font-medium flex items-center gap-1">
                              {u.name}
                              {u.isEmailVerified && <MdVerified size={12} className="text-blue-400" />}
                            </p>
                            <p className="text-gray-500 text-[11px]">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold
                          ${ROLE_META[u.role]?.cls || "bg-gray-400/10 text-gray-400"}`}>
                          {ROLE_META[u.role]?.label || u.role}
                        </span>
                        {u.role === "seller" && u.sellerProfile?.isVerified && (
                          <span className="ml-1 text-[10px] text-emerald-400">✓ Verified</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold
                          ${STATUS_META[status]?.cls}`}>
                          {STATUS_META[status]?.label}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.totalOrders || 0}</td>

                      {/* Spent */}
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        ₹{(u.totalSpent || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(u)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            title="View Details">
                            <MdPerson size={15} />
                          </button>
                          <button
                            onClick={() => handleBan(u._id, !u.isBanned)}
                            disabled={updating === u._id}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50
                              ${u.isBanned
                                ? "hover:bg-emerald-400/10 text-red-400 hover:text-emerald-400"
                                : "hover:bg-red-400/10 text-gray-400 hover:text-red-400"}`}
                            title={u.isBanned ? "Unban User" : "Ban User"}>
                            <MdBlock size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(pg => (
                <button key={pg}
                  onClick={() => setFilters(f => ({ ...f, page: pg }))}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                    ${filters.page === pg ? "bg-[#FF9900] text-black" : "text-gray-400 hover:bg-white/5"}`}>
                  {pg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2030] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#1a2030]">
              <h3 className="text-white font-bold">User Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FF9900]/20 flex items-center justify-center overflow-hidden shrink-0">
                  {selected.avatar?.url
                    ? <img src={selected.avatar.url} alt={selected.name} className="w-full h-full object-cover" />
                    : <span className="text-[#FF9900] font-bold text-2xl">{selected.name?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div>
                  <p className="text-white font-bold text-lg flex items-center gap-1">
                    {selected.name}
                    {selected.isEmailVerified && <MdVerified size={16} className="text-blue-400" />}
                  </p>
                  <p className="text-gray-400 text-sm">{selected.email}</p>
                  {selected.phone && <p className="text-gray-400 text-sm">📞 {selected.phone}</p>}
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ROLE_META[selected.role]?.cls}`}>
                  {ROLE_META[selected.role]?.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_META[getUserStatus(selected)]?.cls}`}>
                  {STATUS_META[getUserStatus(selected)]?.label}
                </span>
                {selected.isEmailVerified && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-400/10 text-blue-400">
                    Email Verified
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Orders",   val: selected.totalOrders || 0 },
                  { label: "Spent",    val: `₹${(selected.totalSpent || 0).toLocaleString("en-IN")}` },
                  { label: "Joined",   val: new Date(selected.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) },
                ].map(s => (
                  <div key={s.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                    <p className="text-white font-bold text-sm">{s.val}</p>
                    <p className="text-gray-500 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Seller Profile */}
              {selected.role === "seller" && selected.sellerProfile && (
                <div className="bg-white/[0.03] rounded-xl p-4 space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Seller Profile</p>
                  <p className="text-white font-semibold">{selected.sellerProfile.shopName || "—"}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Verified: </span>
                      <span className={selected.sellerProfile.isVerified ? "text-emerald-400" : "text-red-400"}>
                        {selected.sellerProfile.isVerified ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating: </span>
                      <span className="text-yellow-400">⭐ {selected.sellerProfile.rating || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Sales: </span>
                      <span className="text-white">{selected.sellerProfile.totalSales || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Change Role */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Change Role</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ROLE_META).map(([k, v]) => (
                    <button key={k}
                      disabled={selected.role === k || updating === selected._id}
                      onClick={() => handleRoleChange(selected._id, k)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed
                        ${selected.role === k ? v.cls : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ban / Unban */}
              <button
                disabled={updating === selected._id}
                onClick={() => handleBan(selected._id, !selected.isBanned)}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50
                  ${selected.isBanned
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30"}`}>
                {updating === selected._id
                  ? "Processing…"
                  : selected.isBanned
                  ? "✓ Unban This User"
                  : "⊘ Ban This User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;