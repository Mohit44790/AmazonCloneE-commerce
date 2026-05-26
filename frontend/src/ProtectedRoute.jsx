import React from 'react'
import { useAuthStore } from './apiData/store/authStore'
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({adminOnly = false}) => {
    const {user ,loading} = useAuthStore();

    if(loading){
        return(
               <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
        )
    }
     if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
    return <Outlet />;
}

export default ProtectedRoute