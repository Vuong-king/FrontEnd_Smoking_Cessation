import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiRefreshCw, FiClock, FiUser } from 'react-icons/fi';
import { useChat } from '../../hook/useChat';
import { useAuth } from '../../context/AuthContext';

const ChatboxAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.userId;

  const {
    chatId,
    setChatId,
    messages,
    sessions,
    loading,
    error,
    createChat,
    sendMessage,
    fetchMessages,
    fetchChatSessions,
  } = useChat();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen) {
      if (!chatId && userId) {
        createChat({ userId });
      } else if (chatId) {
        fetchMessages();
      }
    }
    // eslint-disable-next-line
  }, [isOpen, userId, chatId]);

  useEffect(() => {
    if (showHistory && userId) {
      fetchChatSessions(userId);
    }
    // eslint-disable-next-line
  }, [showHistory, userId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;
    await sendMessage({ content: inputMessage });
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    setChatId(null);
    setInputMessage('');
    if (userId) {
      await createChat({ userId });
    }
  };

  const handleSelectSession = async (session) => {
    setShowHistory(false);
    setChatId(session._id);
    await fetchMessages(session._id);
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setShowHistory(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          title="Mở chat với AI"
        >
          <FiMessageCircle size={24} />
        </button>
      </div>
    );
  }

  if (isOpen && !userId) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-40 flex flex-col items-center justify-center">
          <p className="text-center text-gray-700 p-4">Vui lòng đăng nhập để sử dụng chat AI.</p>
          <button
            onClick={closeChat}
            className="mt-2 text-blue-600 hover:underline"
          >Đóng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isMinimized && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FiMessageCircle size={16} />
              </div>
              <div>
                <h3 className="font-semibold">AI Trợ Lý</h3>
                <p className="text-xs text-blue-100">Cai thuốc lá thông minh</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className={`text-white hover:text-blue-200 transition-colors ${showHistory ? 'bg-blue-800 rounded-full' : ''}`}
                title="Lịch sử chat"
              >
                <FiClock size={16} />
              </button>
              <button
                onClick={handleNewChat}
                className="text-white hover:text-blue-200 transition-colors"
                title="Tạo chat mới"
                disabled={loading}
              >
                <FiRefreshCw size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white hover:text-blue-200 transition-colors"
                title="Thu nhỏ"
              >
                <FiMinimize2 size={16} />
              </button>
              <button
                onClick={closeChat}
                className="text-white hover:text-blue-200 transition-colors"
                title="Đóng"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Lịch sử chat - UI overlay hiện đại */}
          {showHistory && (
            <>
              {/* Overlay mờ */}
              <div className="fixed inset-0 z-50 bg-black bg-opacity-30 transition-opacity animate-fade-in" onClick={() => setShowHistory(false)} />
              {/* Panel nổi */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90%] max-w-xl h-[90%] flex flex-col animate-slide-up relative">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 text-2xl focus:outline-none"
                    title="Đóng"
                  >
                    <FiX />
                  </button>
                  <div className="flex items-center gap-2 px-6 pt-6 pb-2 border-b">
                    <FiClock className="text-blue-600" />
                    <span className="font-semibold text-lg text-gray-700">Lịch sử chat</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
                    {loading && <div className="text-center text-xs text-blue-500 py-4">Đang tải...</div>}
                    {(!loading && sessions.length === 0) && <div className="text-center text-xs text-gray-400 py-4">Không có đoạn chat nào.</div>}
                    <ul className="space-y-2">
                      {sessions.map((session) => (
                        <li
                          key={session._id}
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border border-transparent hover:border-blue-400 hover:bg-blue-50 ${chatId === session._id ? 'bg-blue-100 border-blue-400' : ''}`}
                          onClick={() => handleSelectSession(session)}
                        >
                          {/* Avatar user hoặc icon */}
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                            {user?.avatar ? (
                              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <FiUser />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800 truncate">{session.title || 'Chat không tiêu đề'}</span>
                              <span className="text-xs text-gray-500">{session.createdAt ? new Date(session.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}</span>
                            </div>
                            {session.lastMessage && (
                              <div className="text-xs text-gray-600 mt-1 truncate">{session.lastMessage.content || session.lastMessage.text}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Messages */}
          {!showHistory && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && (
                  <div className="text-center text-xs text-blue-500">Đang tải...</div>
                )}
                {error && (
                  <div className="text-center text-xs text-red-500">{error}</div>
                )}
                {(!loading && messages.length === 0) && (
                  <div className="text-center text-xs text-gray-400">Chưa có tin nhắn nào.</div>
                )}
                {messages.map((message) => (
                  <div
                    key={message._id || message.id}
                    className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender_type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content || message.text}</p>
                      {message.createdAt && (
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    disabled={loading || !chatId}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || loading || !chatId}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {isMinimized && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-96">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <FiMessageCircle size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">AI Trợ Lý</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Mở rộng"
              >
                <FiMessageCircle size={14} />
              </button>
              <button
                onClick={closeChat}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Đóng"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatboxAI; 