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
    { key: "1", label: "Tài khoản", disabled: true },
    { type: "divider" },
    {
      key: "2",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined />,
      onClick: () => {
        window.location.href = `/coach/profile/${user.id}`;
      },
    },
    {
      key: "3",
      label: "Đăng xuất",
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
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Collapse Button & Logo */}
      <div
        className={`${
          !collapsed
            ? "flex justify-between items-center border-b border-gray-200"
            : "flex items-center justify-center"
        }`}>
        {!collapsed && (
          <Link to='/coach'>
            <div className='text-xl font-bold text-blue-600 px-4 py-3'>
              COACH PANEL
            </div>
          </Link>
        )}
        <div className='p-2'>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className='text-gray-700'
          />
        </div>
      </div>

      {/* Profile Section */}
      <div
        className={`${
          collapsed
            ? "px-4 py-3 border-b border-gray-200 flex flex-col items-center gap-2 hover:bg-gray-100"
            : "px-4 py-3 border-b border-gray-200 flex items-center gap-3 hover:bg-gray-100"
        } cursor-pointer transition-colors duration-200`}>
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
                  <div className='text-sm font-semibold text-gray-800'>
                    {user.name || "Coach Name"}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {user.role || "Coach"}
                  </div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Menu Items */}
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
                  ? "bg-blue-100 text-blue-700 rounded-2xl"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-2xl"
              }`}
              style={{
                minHeight: collapsed ? 48 : undefined,
              }}>
              <span className='text-lg'>{item.icon}</span>
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
