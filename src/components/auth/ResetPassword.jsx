import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleReset = async () => {
    if (!email) {
      message.error('Vui lòng nhập email');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      message.success('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!');
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-1/2 p-10 rounded-l-lg">
          <h2 className="text-3xl font-bold mb-4">Forgot your password?</h2>
          <p className="text-center max-w-xs">
            Đừng lo! Hãy nhập email của bạn và chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.
          </p>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Reset Password</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReset();
            }}
            className="space-y-4"
          >
            <label className="block">
              <span className="text-gray-700">Email</span>
              <Input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </label>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
            </Button>

            <div className="text-center">
              <Button type="link" onClick={() => navigate('/login')}>
                Quay về đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
