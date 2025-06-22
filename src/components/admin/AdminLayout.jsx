import React from "react";
import { Link, Outlet } from "react-router-dom";
import  SidebarAdmin  from "./SidebarAdmin";


const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full ">

      <SidebarAdmin />
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
