import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const UserHeader = () => {
  const { user, logout } = useAuth();

  const getUserMenuItems = (role) => {
    const baseItems = [
      {
        key: 'profile',
        label: <span className="text-gray-700">Profile</span>
      },
      {
        key: 'logout',
        label: (
          <span className="text-red-500" onClick={logout}>
            Logout
          </span>
        )
      }
    ];

    if (role === 'admin') {
      return [
        {
          key: 'dashboard',
          label: <Link to="/admin/dashboard">Admin Dashboard</Link>
        },
        ...baseItems
      ];
    }

    return [
      {
        key: 'dashboard',
        label: <Link to="/user/dashboard">Dashboard</Link>
      },
      ...baseItems
    ];
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              EXHELA
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-purple-400">
              Home
            </Link>
            <Link to="/blog" className="text-white hover:text-purple-400">
              Blog
            </Link>
            <Link to="/community" className="text-white hover:text-purple-400">
              Community
            </Link>
            <Link to="/ranking" className="text-white hover:text-purple-400">
              Ranking
            </Link>
            <Link to="/premium" className="text-white hover:text-purple-400">
              Premium
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Dropdown 
              menu={{ items: getUserMenuItems(user?.role) }} 
              placement="bottomRight"
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="text-white">{user?.name || 'User'}</span>
                <Avatar 
                  src={user?.avatar} 
                  icon={<UserOutlined />}
                  className="border-2 border-purple-500"
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;