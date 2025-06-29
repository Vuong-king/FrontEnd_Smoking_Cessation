import React from "react";
import { Link, Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex w-screen h-screen overflow-hidden text-white bg-transparent">
      <SidebarAdmin />
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
