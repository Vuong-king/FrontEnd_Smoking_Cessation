import { useState, useCallback } from "react";
import ChatService from "../services/chatService";

export function useChat() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper để lấy message lỗi
  const extractErrorMessage = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.message) return err.message;
    return String(err);
  };

  //  Tạo đoạn chat mới
  const createChat = useCallback(async (chatInfo) => {
    setLoading(true);
    setError(null);
    try {
      const chat = await ChatService.createChat(chatInfo);
      setChatId(chat._id);
      return chat;
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Lỗi khi tạo chat:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  //  Gửi tin nhắn
  const sendMessage = useCallback(async (messageData) => {
    if (!chatId) {
      setError("Chưa có chatId");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await ChatService.sendMessage(chatId, messageData);
      // Nếu API trả về cả message user và aiMessage
      if (result.aiMessage) {
        setMessages((prev) => [...prev, result, result.aiMessage]);
      } else {
        setMessages((prev) => [...prev, result]);
      }
      return result;
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Lỗi khi gửi tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Lấy tin nhắn theo chatId
  const fetchMessages = useCallback(async (id = chatId) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ChatService.getMessages(id);
      console.log("API trả về tin nhắn:", data); // Thêm log để debug
      setMessages(Array.isArray(data) ? data : data.messages || data.data || []);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Lỗi khi lấy tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  //  Lấy tất cả session chat theo userId
  const fetchChatSessions = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ChatService.getChatSessions(userId);
      setSessions(data || []);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Lỗi khi lấy session:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    chatId,
    setChatId,
    messages,
    setMessages,
    sessions,
    loading,
    error,
    createChat,
    sendMessage,
    fetchMessages,
    fetchChatSessions,
  };
}
