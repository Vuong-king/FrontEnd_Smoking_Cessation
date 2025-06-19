import React from "react";
import { Link, Outlet } from "react-router-dom";
import  SidebarAdmin  from "./SidebarAdmin";


const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full text-white">

      <SidebarAdmin />
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-black to-gray-900">
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
