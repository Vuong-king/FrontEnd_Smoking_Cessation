import api from "../api";

const ChatService = {
  // Tạo một đoạn chat mới
  createChat: async (data) => {
    const response = await api.post('/chat', data);
    return response.data;
  },

  // Gửi tin nhắn vào đoạn chat
  sendMessage: async (chatId, message) => {
    const response = await api.post(`/chat/${chatId}/message`, message);
    return response.data;
  },

  // Lấy tất cả tin nhắn trong đoạn chat
  getMessages: async (chatId) => {
    const response = await api.get(`/chat/${chatId}`);
    return response.data;
  },

  // Lấy danh sách các đoạn chat (sessions) theo userId
  getChatSessions: async (userId) => {
    const response = await api.get(`/chat/sessions/${userId}`);
    return response.data;
  },
  relapse: async (message) => {
    const response = await api.post(`/relapse-events`, message);
    return response.data;
  },
};

export default ChatService;
