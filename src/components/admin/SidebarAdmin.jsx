import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function SidebarAdmin() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { to: "/admin/subscriptions", label: "Subscriptions", icon: <CreditCard className="w-5 h-5" /> },
    { to: "/admin/badges", label: "Badges", icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-purple-800 to-cyan-800 text-white p-4 space-y-6 shadow-2xl transition-all duration-300`}
    >
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold">Admin</h2>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white hover:opacity-80">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const linkClasses = `flex items-center ${
            collapsed ? "justify-center" : "gap-3 px-4"
          } py-2 rounded-md font-medium text-sm transition-all duration-200 ease-in-out transform
          ${
            isActive
              ? "bg-white/20 border-l-4 border-white text-white shadow-inner"
              : "hover:bg-white/10 hover:scale-[1.02] text-white/80"
          }`;

          return collapsed ? (
            <Tooltip.Provider delayDuration={200} key={link.to}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link to={link.to} className={linkClasses}>
                    {link.icon}
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-white text-black px-3 py-1 text-sm rounded shadow-lg z-50"
                    side="right"
                    align="center"
                    sideOffset={8}
                  >
                    {link.label}
                    <Tooltip.Arrow className="fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <Link key={link.to} to={link.to} className={linkClasses}>
              {link.icon}
              <span className="tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
