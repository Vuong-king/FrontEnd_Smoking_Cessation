import api from "../api";


const ProgressService = {
  getAllProgress: async () => {
    const response = await api.get("/progress");
    return response.data;
  },
  createProgress: async (data) => {
    const response = await api.post("/progress", data);
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
  // Lấy progress theo ID
  getProgressByIdAPI: async (id) => {
    const response = await api.get(`/progress/${id}`);
    return response.data;
  },
  // Lấy progress theo stage (tất cả users trong stage đó)
  getProgressByStageAPI: async (stageId) => {
    const response = await api.get(`/progress/stage/${stageId}`);
    return response.data;
  },

  // Lấy tổng quan progress của user (qua nhiều plan)
  getUserOverallProgressAPI: async (userId) => {
    const response = await api.get(`/progress/user/${userId}`);
    return response.data;
  },

  // Lấy progress của 1 plan cụ thể
  getSinglePlanProgressAPI: async (planId) => {
    const response = await api.get(`/progress/plan/${planId}`);
    return response.data;
  },

  // Lấy progress của 1 stage cụ thể cho user hiện tại
  getSingleStageProgressAPI: async (stageId) => {
    const response = await api.get(`/progress/stage/${stageId}/user`);
    return response.data;
  },

  // Lấy số ngày không hút thuốc liên tục
  getUserConsecutiveNoSmokeAPI: async (userId) => {
    const response = await api.get(`/progress/consecutive-no-smoke/${userId}`);
    return response.data;
  },

  // Lấy tổng tiền tiết kiệm và điếu không hút từ tất cả stages trong plan
  getTotalMoneySavedInPlanAPI: async (planId) => {
    const response = await api.get(`/progress/plan/${planId}/money-saved`);
    return response.data;
  },
  // Lấy thống kê hút thuốc của kế hoạch (điếu đã hút, điếu đã giảm)
  getPlanSmokingStatsAPI: async (planId) => {
    const response = await api.get(`/progress/plan/${planId}/smoking-stats`);
    return response.data;
  },
};

export default ProgressService;
