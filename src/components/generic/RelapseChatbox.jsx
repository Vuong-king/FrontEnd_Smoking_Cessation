import React, { useState } from 'react';
import { FiMessageCircle, FiX, FiMinimize2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';

const activityOptions = [
  { value: 'drinking_coffee', label: 'Uống cà phê' },
  { value: 'after_meal', label: 'Sau bữa ăn' },
  { value: 'stressful_work', label: 'Công việc căng thẳng' },
  { value: 'socializing', label: 'Giao tiếp xã hội' },
  { value: 'bored', label: 'Chán nản' },
  { value: 'driving', label: 'Lái xe' },
  { value: 'other', label: 'Khác' },
];
const emotionOptions = [
  { value: 'stressed', label: 'Căng thẳng' },
  { value: 'bored', label: 'Chán nản' },
  { value: 'happy', label: 'Vui vẻ' },
  { value: 'sad', label: 'Buồn' },
  { value: 'anxious', label: 'Lo lắng' },
  { value: 'other', label: 'Khác' },
];

const RelapseChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [form, setForm] = useState({
    cigarettes_smoked: 1,
    activity: '',
    emotion: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.userId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await chatService.relapse({
        user_id: userId,
        ...form,
        cigarettes_smoked: Number(form.cigarettes_smoked),
      });
      setSuccess('Gửi sự kiện tái nghiện thành công!');
      setForm({ cigarettes_smoked: 1, activity: '', emotion: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Gửi thất bại.');
    } finally {
      setLoading(false);
    }
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
    setSuccess(null);
    setError(null);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-28 z-50">
        <button
          onClick={toggleChat}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          title="Báo cáo tái nghiện"
        >
          <FiMessageCircle size={24} />
        </button>
      </div>
    );
  }

  if (isOpen && !userId) {
    return (
      <div className="fixed bottom-6 right-28 z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-40 flex flex-col items-center justify-center">
          <p className="text-center text-gray-700 p-4">Vui lòng đăng nhập để báo cáo tái nghiện.</p>
          <button
            onClick={closeChat}
            className="mt-2 text-red-600 hover:underline"
          >Đóng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-28 z-50">
      {!isMinimized && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FiMessageCircle size={16} />
              </div>
              <div>
                <h3 className="font-semibold">Báo cáo tái nghiện</h3>
                <p className="text-xs text-red-100">Gửi thông tin lần hút lại</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white hover:text-red-200 transition-colors"
                title="Thu nhỏ"
              >
                <FiMinimize2 size={16} />
              </button>
              <button
                onClick={closeChat}
                className="text-white hover:text-red-200 transition-colors"
                title="Đóng"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center px-8 py-6 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Số điếu thuốc đã hút</label>
              <input
                type="number"
                name="cigarettes_smoked"
                min={1}
                value={form.cigarettes_smoked}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Hoạt động khi hút lại</label>
              <select
                name="activity"
                value={form.activity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
                required
              >
                <option value="">-- Chọn hoạt động --</option>
                {activityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Cảm xúc khi hút lại</label>
              <select
                name="emotion"
                value={form.emotion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
                required
              >
                <option value="">-- Chọn cảm xúc --</option>
                {emotionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
            {success && <div className="text-green-600 text-center font-medium">{success}</div>}
            {error && <div className="text-red-600 text-center font-medium">{error}</div>}
          </form>
        </div>
      )}
      {isMinimized && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-96">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <FiMessageCircle size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Báo cáo tái nghiện</span>
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

export default RelapseChatbox; 