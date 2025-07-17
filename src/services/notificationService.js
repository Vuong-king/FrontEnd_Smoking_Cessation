import api from '../api';

const NotificationService = {
  getAllNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  createNotification: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
  updateNotification: async (id, data) => {
    const response = await api.put(`/notifications/${id}`, data);
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
  getUserNotifications: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },
};

export default NotificationService; 