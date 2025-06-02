import React from "react";
import { Link } from "react-router-dom";

export function SidebarAdmin() {
  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/subscriptions", label: "Subscriptions" },
    { to: "/admin/badges", label: "Badges" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-800 to-cyan-800 text-white p-6 space-y-4 rounded-l-lg">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Menu</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
