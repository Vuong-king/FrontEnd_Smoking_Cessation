import React from "react";
import { Bell, UserCircle } from "lucide-react";

export function HeaderAdmin() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-800 to-cyan-800 text-white rounded-t-lg">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        </button>
        <div className="flex items-center space-x-2">
          <UserCircle className="w-8 h-8" />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
