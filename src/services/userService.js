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

const UserService = {
  getAllUsers: async () => {
    const response = await api.get('/user');
    return response.data;
  },
  createUser: async (data) => {
    const response = await api.post('/user', data);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
  adminDashboard: async () => {
    const response = await api.get('/dashboard/statistics');
    return response.data;
  },
};

export default UserService;
