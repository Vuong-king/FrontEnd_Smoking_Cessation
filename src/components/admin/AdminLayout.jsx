import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      <aside className="w-64 bg-gradient-to-b from-purple-800 to-cyan-800 p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="/admin" className="block hover:text-purple-300">Dashboard</Link>
          <Link to="/admin/users" className="block hover:text-purple-300">Users</Link>
          <Link to="/admin/subscriptions" className="block hover:text-purple-300">Subscriptions</Link>
          <Link to="/admin/badges" className="block hover:text-purple-300">Badges</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-black to-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
