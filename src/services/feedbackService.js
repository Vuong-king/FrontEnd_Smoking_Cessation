import api from "../api";

const FEEDBACKS_KEY = "feedbacks";

const FeedbackService = {
  getAllFeedbacks: () => {
    const saved = localStorage.getItem(FEEDBACKS_KEY);
    return saved ? JSON.parse(saved) : [];
  },
  deleteFeedback: (id) => {
    const feedbacks = FeedbackService.getAllFeedbacks();
    const updated = feedbacks.filter((f) => f.id !== id);
    localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(updated));
    return updated;
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post("/feedback", feedbackData);
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);

      // Cải thiện error handling
      if (error.response?.status === 401) {
        throw new Error("Bạn cần đăng nhập để thực hiện chức năng này");
      } else if (error.response?.status === 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },
    getUserFeedback: async (userId = "me") => {
    try {
      const response = await api.get(`/feedback/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      throw error;
    }
  },
};

export default FeedbackService;
