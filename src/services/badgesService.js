import api from '../api';

const BadgesService = {
  getAllBadges: async () => {
    const response = await api.get('/badges');
    return response.data;
  },
  createBadge: async (data) => {
    const response = await api.post('/badges/create', data);
    return response.data;
  },
  updateBadge: async (id, data) => {
    const response = await api.put(`/badges/${id}`, data);
    return response.data;
  },
  deleteBadge: async (id) => {
    const response = await api.delete(`/badges/${id}`);
    return response.data;
  },
};

export default BadgesService; 