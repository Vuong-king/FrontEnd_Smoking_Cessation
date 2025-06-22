import React, { useEffect, useState } from "react";
import { Trash, Pencil, Plus, Star, User, MessageCircle, Filter, Search, EyeOff, ClockIcon } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [newData, setNewData] = useState({
    rating: 5,
    content: "",
    feedback_type: "user_to_system",
    status: "pending"
  });
  const [errors, setErrors] = useState({
    rating: "",
    content: "",
    feedback_type: "",
    status: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, [filterType]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/feedback?type=${filterType}`);
      setFeedbacks(response.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackTypeIcon = (type) => {
    switch (type) {
      case 'user_to_coach':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'user_to_plan':
        return <MessageCircle className="w-5 h-5 text-green-400" />;
      default:
        return <MessageCircle className="w-5 h-5 text-purple-400" />;
    }
  };

  const getFeedbackTypeLabel = (type) => {
    switch (type) {
      case 'user_to_coach':
        return 'Phản hồi Huấn luyện viên';
      case 'user_to_plan':
        return 'Phản hồi Kế hoạch';
      case 'user_to_system':
        return 'Phản hồi Hệ thống';
      default:
        return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'hidden':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'hidden':
        return 'Đã ẩn';
      case 'pending':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setNewData({
      rating: feedback.rating || 5,
      content: feedback.content || "",
      feedback_type: feedback.feedback_type || "user_to_system",
      status: feedback.status || "pending"
    });
    setIsNew(false);
  };

  const handleSave = async () => {
    const newErrors = {
      rating: !newData.rating ? "Vui lòng nhập đánh giá" : 
              newData.rating < 1 || newData.rating > 5 ? "Đánh giá phải từ 1 đến 5" : "",
      content: !newData.content ? "Vui lòng nhập nội dung phản hồi" : "",
      feedback_type: !newData.feedback_type ? "Vui lòng chọn loại phản hồi" : "",
      status: !newData.status ? "Vui lòng chọn trạng thái" : ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.post('/feedback', newData);
      } else {
        await api.put(`/feedback/${editingFeedback._id}`, newData);
      }
      await fetchFeedbacks();
      setEditingFeedback(null);
      setIsNew(false);
    } catch (err) {
      console.error("Error saving feedback:", err);
      setError(err.response?.data?.message || "Không thể lưu phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/feedback/${id}`);
      await fetchFeedbacks();
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setError(err.response?.data?.message || "Không thể xóa phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setNewData({
      rating: 5,
      content: "",
      feedback_type: "user_to_system",
      status: "pending"
    });
    setErrors({
      rating: "",
      content: "",
      feedback_type: "",
      status: ""
    });
    setEditingFeedback({});
    setIsNew(true);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await api.put(`/feedback/status/${id}`, { status });
      await fetchFeedbacks();
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && feedbacks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-xl font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white relative">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Quản lý Phản hồi
          </span>
        </h1>
        <p className="text-white/70 text-lg">Xem xét và quản lý phản hồi từ người dùng nền tảng</p>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phản hồi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="user_to_coach">Phản hồi Huấn luyện viên</option>
                  <option value="user_to_plan">Phản hồi Kế hoạch</option>
                  <option value="user_to_system">Phản hồi Hệ thống</option>
                </select>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-white font-semibold"
            >
              <Plus className="w-5 h-5" />
              Thêm Phản hồi
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Tổng số phản hồi</p>
                <p className="text-2xl font-bold text-white">{feedbacks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Đã duyệt</p>
                <p className="text-2xl font-bold text-white">{feedbacks.filter(f => f.status === 'approved').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Chờ duyệt</p>
                <p className="text-2xl font-bold text-white">{feedbacks.filter(f => f.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Đã ẩn</p>
                <p className="text-2xl font-bold text-white">{feedbacks.filter(f => f.status === 'hidden').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-white/60 text-xl font-medium">Không tìm thấy phản hồi nào</p>
            <p className="text-white/40 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-xl">
                        {getFeedbackTypeIcon(feedback.feedback_type)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white">
                          {getFeedbackTypeLabel(feedback.feedback_type)}
                        </span>
                        <p className="text-xs text-white/50">
                          {new Date(feedback.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(feedback.status)}`}>
                      {getStatusLabel(feedback.status)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (feedback.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white/70 font-medium">({feedback.rating || 0}/5)</span>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-sm text-white/90 leading-relaxed line-clamp-4">
                      {feedback.content}
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2 mb-4">
                    {feedback.user_id && (
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <User className="w-3 h-3" />
                        <span>Từ: {feedback.user_id.name || feedback.user_id.email}</span>
                      </div>
                    )}

                    {feedback.coach_id && (
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <MessageCircle className="w-3 h-3" />
                        <span>Huấn luyện viên: {feedback.coach_id.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(feedback)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium"
                      >
                        <Pencil className="w-3 h-3" /> Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          setFeedbackToDelete(feedback._id);
                          setShowConfirm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors text-xs font-medium"
                      >
                        <Trash className="w-3 h-3" /> Xóa
                      </button>
                    </div>

                    <select
                      value={feedback.status || "pending"}
                      onChange={(e) => handleStatusUpdate(feedback._id, e.target.value)}
                      className="text-xs px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="hidden">Đã ẩn</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isNew ? "Thêm Phản hồi Mới" : "Chỉnh sửa Phản hồi"}
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Đánh giá</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newData.rating}
                  onChange={(e) => setNewData({ ...newData, rating: parseInt(e.target.value) })}
                  className={`p-3 rounded-xl bg-white/10 border text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.rating ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Nội dung</label>
                <textarea
                  placeholder="Nhập nội dung phản hồi..."
                  value={newData.content}
                  onChange={(e) => setNewData({ ...newData, content: e.target.value })}
                  rows="4"
                  className={`p-3 rounded-xl bg-white/10 border text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                    errors.content ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Loại phản hồi</label>
                <select
                  value={newData.feedback_type}
                  onChange={(e) => setNewData({ ...newData, feedback_type: e.target.value })}
                  className={`p-3 rounded-xl bg-white/10 border text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.feedback_type ? 'border-red-500' : 'border-white/20'
                  }`}
                >
                  <option value="user_to_system">Phản hồi Hệ thống</option>
                  <option value="user_to_coach">Phản hồi Huấn luyện viên</option>
                  <option value="user_to_plan">Phản hồi Kế hoạch</option>
                </select>
                {errors.feedback_type && <p className="text-red-400 text-sm mt-1">{errors.feedback_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Trạng thái</label>
                <select
                  value={newData.status}
                  onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                  className={`p-3 rounded-xl bg-white/10 border text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.status ? 'border-red-500' : 'border-white/20'
                  }`}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="hidden">Đã ẩn</option>
                </select>
                {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingFeedback(null);
                  setIsNew(false);
                }}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          message="Bạn có chắc chắn muốn xóa phản hồi này không?"
          onCancel={() => {
            setShowConfirm(false);
            setFeedbackToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(feedbackToDelete);
            setShowConfirm(false);
            setFeedbackToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Feedbacks;
