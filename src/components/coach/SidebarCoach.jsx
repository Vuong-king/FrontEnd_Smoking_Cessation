import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
  MessageOutlined,
  TrophyOutlined,
  LogoutOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function SidebarCoach({ user = {} }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("coach-sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("coach-sidebar-collapsed", collapsed);
  }, [collapsed]);

  const menu = [
    {
      label: "Kế hoạch của tôi",
      icon: <DashboardOutlined />,
      path: "/coach/my-quit-plans",
    },
    {
      label: "Duyệt Yêu Cầu",
      icon: <CheckCircleOutlined />,
      path: "/coach/quit-plans-request",
    },
    {
      label: "Giai Đoạn",
      icon: <BarChartOutlined />,
      path: "/coach/stages",
    },

    {
      label: "Tiến trình",
      icon: <FieldTimeOutlined />,
      path: "/coach/progress",
    },
    {
      label: "Thông báo học viên",
      icon: <NotificationOutlined />,
      path: "/coach/notifications",
    },
    {
      label: "Yêu cầu tư vấn ",
      icon: <MessageOutlined />,
      path: "/coach/meet-session",
    },
  ];

  const dropdownItems = [
    { key: "1", label: "My Account", disabled: true },
    { type: "divider" },
    {
      key: "2",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => {
        window.location.href = `/coach/profile/${user.id}`;
      },
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 overflow-y-auto sidebar-scroll ${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-[#1a1333] via-[#2b2256] to-[#1a2a3a] flex flex-col transition-all duration-300`}>
      {/* Collapse Button & Logo */}
      <div
        className={`${
          !collapsed
            ? "flex justify-between items-center border-b border-[#1f1f1f]"
            : "flex items-center justify-center"
        }`}>
        {!collapsed && (
          <Link to='/coach'>
            <div className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-3'>
              COACH PANEL
            </div>
          </Link>
        )}
        <div className='p-2'>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className='text-white'
          />
        </div>
      </div>

      {/* Profile */}
      <div
        className={`${
          collapsed
            ? "px-4 py-3 border-b border-[#1f1f1f] flex flex-col items-center gap-2 hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200"
            : "px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3 hover:bg-[#232042] hover:cursor-pointer transition-colors duration-200"
        }`}>
        <Dropdown menu={{ items: dropdownItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space direction={collapsed ? "vertical" : "horizontal"}>
              <Avatar
                size={collapsed ? 32 : 40}
                src={user.avatar || null}
                icon={!user.avatar && <UserOutlined />}
              />
              {!collapsed && (
                <div>
                  <div className='text-sm font-semibold'>
                    {user.name || "Coach Name"}
                  </div>
                  <div className='text-xs text-gray-400'>
                    {user.role || "Coach"}
                  </div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Menu */}
      <nav className='flex-1 mt-4 flex flex-col items-center'>
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center transition-all duration-200 mt-1 ${
                collapsed ? "justify-center w-12 h-12" : "px-6 py-2 w-11/12"
              } ${
                isActive
                  ? "bg-gray-200 text-[#232042] rounded-2xl"
                  : "text-white hover:bg-[#232042] hover:text-[#1ecbe1] rounded-2xl"
              }`}
              style={{
                minHeight: collapsed ? 48 : undefined,
              }}>
              <span className={`text-lg ${isActive ? "text-[#232042]" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className='font-medium ml-3'>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SidebarCoach;
