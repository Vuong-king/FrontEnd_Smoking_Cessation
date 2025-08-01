import {
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  UserOutlined,
  FieldTimeOutlined,
  MessageOutlined,
  TrophyOutlined,
  FileTextOutlined,
  BellOutlined,
  TeamOutlined,
  SafetyOutlined,
  BarChartOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function SidebarAdmin() {
  const { user } = useAuth();

  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    return saved === "true";
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", collapsed);
  }, [collapsed]);

  const menu = [
    { label: "Bảng điều khiển", icon: <DashboardOutlined />, path: "/admin" },
    { label: "Người dùng", icon: <UserOutlined />, path: "/admin/users" },
    { label: "Đăng ký", icon: <CreditCardOutlined />, path: "/admin/subscriptions" },
    { label: "Huy hiệu", icon: <StarOutlined />, path: "/admin/badges" },
    // { label: "Giai đoạn", icon: <BarChartOutlined />, path: "/admin/stages" },
    // { label: "Reports", icon: <BarChartOutlined />, path: "/admin/reports" },
    { label: "Phản hồi", icon: <MessageOutlined />, path: "/admin/feedbacks" },
    { label: "Kế hoạch bỏ thuốc", icon: <CheckCircleOutlined />, path: "/admin/quit-plans" },
    { label: "Tiến độ", icon: <FieldTimeOutlined />, path: "/admin/progress" },
    { label: "Bài viết blog", icon: <FileTextOutlined />, path: "/admin/blogs" },
    { label: "Gói dịch vụ", icon: <CreditCardOutlined />, path: "/admin/packages" },
    { label: "Yêu cầu", icon: <SettingOutlined />, path: "/admin/coach-requests" },
    // { label: "Leaderboard", icon: <TrophyOutlined />, path: "/admin/leaderboard" },
    { label: "Thông báo", icon: <BellOutlined />, path: "/admin/notifications" },
    // { label: "Coaches", icon: <TeamOutlined />, path: "/admin/coaches" },
    // { label: "Permissions", icon: <SafetyOutlined />, path: "/admin/roles" },
    // { label: "Settings", icon: <SettingOutlined />, path: "/admin/settings" },
    // { label: "Request", icon: <SettingOutlined />, path: "/admin/request" },
  ];

  const dropdownItems = [
    { key: "1", label: "Tài khoản của tôi", disabled: true },
    { type: "divider" },
    { key: "2", label: "Hồ sơ", icon: <UserOutlined />, onClick: () => navigate(`/admin/profile/${user?.id}`),},
    { key: "3", label: "Cài đặt", icon: <SettingOutlined /> },
    {
      key: "4",
      label: "Đăng xuất",
      icon: <SettingOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 ${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      {/* Collapse Button & Logo */}
      <div
        className={`${
          !collapsed
            ? "flex justify-between items-center border-b border-gray-200 p-2"
            : "flex items-center justify-center p-2"
        }`}
      >
        {!collapsed && (
          <Link to="/">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              EXHELA
            </div>
          </Link>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-700"
        />
      </div>

      {/* Profile */}
      <div
        className={`${
          !collapsed
            ? "px-4 py-3 border-b border-gray-200 flex items-center gap-3"
            : "px-4 py-3 border-b border-gray-200 flex flex-col items-center gap-3"
        } hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200`}
      >
        <Dropdown menu={{ items: dropdownItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar
                size={collapsed ? 32 : 40}
                src={user.avatar}
                icon={<UserOutlined />}
              />
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {user.name || "Admin"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role || "Administrator"}
                  </div>
                </div>
              )}
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 flex flex-col items-center">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center transition-all duration-200 mt-1
                ${collapsed ? "justify-center w-12 h-12" : "px-6 py-2 w-11/12"}
                ${
                  isActive
                    ? "bg-gray-200 text-[#232042] rounded-2xl"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#1ecbe1] rounded-2xl"
                }
              `}
              style={{
                minHeight: collapsed ? 48 : undefined,
              }}
            >
              <span className={`text-lg ${isActive ? "text-[#232042]" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="font-medium ml-3">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SidebarAdmin;
