import api from "../api";

const coachRequestService = {
  getAllRequests: async () => {
    const res = await api.get("/coach-requests");
    return res.data;
  },
  sendInvite: async (userId) => {
    const res = await api.post(`/coach-requests/invite/${userId}`);
    return res.data;
  },
  respondInvite: async (requestId, action) => {
    const res = await api.post(`/coach-requests/respond/${requestId}`, { action });
    return res.data;
  },
};

export default coachRequestService;
