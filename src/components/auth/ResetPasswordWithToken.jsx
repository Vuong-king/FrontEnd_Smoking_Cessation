import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, message } from "antd";
import api from "../../api";

const ResetPasswordWithToken = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu không khớp");
      return;
    }
    try {
      setLoading(true);
      await api.post(`/auth/resset-password/${token}`, { newPassword });
      message.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Đặt lại mật khẩu</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <Input.Password
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input.Password
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Đặt lại mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordWithToken; 