import api from '../api';

const SubscriptionService = {
  getAllSubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },
  createSubscription: async (data) => {
    const response = await api.post(`/subscriptions`, data);
    return response.data;
  },
  updateSubscription: async (id, data) => {
    const response = await api.put(`/subscriptions/${id}`, data);
    return response.data;
  },
  deleteSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
  
  getMyActiveSubscription: async () => {
    try {
      const response = await api.get("/subscriptions/my-active-subscription");
      return response.data;
    } catch (error) {
      console.error("Error fetching user's active subscription:", error);
      throw error;
    }
  },
};

export default SubscriptionService; 