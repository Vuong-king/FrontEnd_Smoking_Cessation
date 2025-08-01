import {
  AuditOutlined,
  CarryOutOutlined,
  FieldTimeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space } from "antd";
import { Cigarette, MessageCircleHeart, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ColourfulText from "../../components/ui/ColourfulText";
import { useAuth } from "../../context/AuthContext";

const menu = [
  {
    label: "Tình trạng hút thuốc",
    icon: <Cigarette />,
    path: "/user/smoking-status",
  },
  { label: "Bài Viết", icon: <AuditOutlined />, path: "/user/blog" },
  { label: "Kế Hoạch", icon: <CarryOutOutlined />, path: "/user/quitplan" },
  { label: "Tiến triển", icon: <FieldTimeOutlined />, path: "/user/progress" },
  { label: "Thành tựu ", icon: <Trophy />, path: "/user/achievements" },
  {
    label: "Tư vấn ",
    icon: <MessageCircleHeart />,
    path: "/user/meet-session",
  },
  {
    label: "Kế hoạch của tôi",
    icon: <FileTextOutlined />,
    path: "/user/my-quit-plans",
  },
  {
    label: "Mục tiêu tiết kiệm",
    icon: <MoneyCollectOutlined />,
    path: "/user/savings-goals",
  },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  const { logout, user } = useAuth();

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const items = [
    {
      key: "1",
      label: user?.name || "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      icon: <FaUser className='text-purple-400' />,
      onClick: () => navigate(`/user/profile/${user.id}`),
    },
    {
      key: "4",
      label: "Logout",
      icon: <MdLogout className='text-blue-400' />,
      onClick: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 ${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Collapse button */}
      <div
        className={`${
          !collapsed
            ? "flex justify-between items-center border-b border-gray-200 p-2"
            : "flex items-center justify-center p-2"
        }`}>
        {!collapsed && (
          <Link to='/'>
            <div className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500'>
              <ColourfulText text='EXHELA' />
            </div>
          </Link>
        )}
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className='text-gray-700'
        />
      </div>

      {/* Profile */}
      <div
        className={`${
          !collapsed
            ? "px-4 py-3 border-b border-gray-200 flex items-center gap-3"
            : "px-4 py-3 border-b border-gray-200 flex flex-col items-center gap-3"
        } hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200`}>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar
                size={collapsed ? 32 : 40}
                src={
                  user?.avatar_url ||
                  "https://cdn-media.sforum.vn/storage/app/media/ve-capybara-2.jpg"
                }
              />
              {!collapsed && (
                <div>
                  <div className='text-sm font-semibold text-gray-800'>
                    {user?.name || "Guest"}
                  </div>
                  <div className='text-xs text-gray-500'>{user?.email}</div>
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

export default Sidebar;
