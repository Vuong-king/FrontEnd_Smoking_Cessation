// services/userService.js
import api from "../api";

// Lấy thông tin người dùng theo ID
export const fetchUserByIdAPI = (userId) => api.get(`/user/${userId}`);

// Cập nhật hồ sơ
export const updateUserProfileAPI = (userId, profileData) =>
  api.put(`/user/edit-profile/${userId}`, profileData);

// Đổi mật khẩu
export const changePasswordAPI = (oldPassword, newPassword) =>
  api.post(`/user/change-password`, { oldPassword, newPassword });

// Xóa tài khoản
export const deleteUserAPI = (userId) => api.delete(`/user/${userId}`);
