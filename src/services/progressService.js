import api from '../api';

const ProgressService = {
  getAllProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },
  createProgress: async (data) => {
    const response = await api.post('/progress', data);
    return response.data;
  },
  updateProgress: async (id, data) => {
    const response = await api.put(`/progress/${id}`, data);
    return response.data;
  },
  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },
};

export default ProgressService; 