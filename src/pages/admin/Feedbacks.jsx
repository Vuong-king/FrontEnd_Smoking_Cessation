import React from "react";
import { Trash, Pencil, Plus, Star, User, MessageCircle, Filter, Search, EyeOff, ClockIcon } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useFeedbacks from "../../hook/useFeedbacks";

const Feedbacks = () => {
  const {
    feedbacks,
    loading,
    error,
    editingFeedback,
    setEditingFeedback,
    newData,
    setNewData,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    feedbackToDelete,
    setFeedbackToDelete,
    filterType,
    setFilterType,
    searchTerm,
    setSearchTerm,
    filteredFeedbacks,
    handleEdit,
    handleNew,
    handleSave,
    handleDelete,
    handleStatusUpdate,
  } = useFeedbacks();

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

  if (loading && feedbacks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-400 text-xl font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50 min-h-screen text-gray-800 relative">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Quản lý Phản hồi
          </span>
        </h1>
        <p className="text-gray-600 text-lg">Xem xét và quản lý phản hồi từ người dùng nền tảng</p>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phản hồi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="user_to_coach">Phản hồi Huấn luyện viên</option>
                  <option value="user_to_plan">Phản hồi Kế hoạch</option>
                  <option value="user_to_system">Phản hồi Hệ thống</option>
                </select>
              </div>
            </div>

            {/* Add Button */}
            {/* <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-white font-semibold"
            >
              <Plus className="w-5 h-5" />
              Thêm Phản hồi
            </button> */}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Tổng số phản hồi</p>
                <p className="text-2xl font-bold text-gray-800">{feedbacks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Đã duyệt</p>
                <p className="text-2xl font-bold text-gray-800">{feedbacks.filter(f => f.status === 'approved').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-200 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-800">{feedbacks.filter(f => f.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-200 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Đã ẩn</p>
                <p className="text-2xl font-bold text-gray-800">{feedbacks.filter(f => f.status === 'hidden').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-xl font-medium">Không tìm thấy phản hồi nào</p>
            <p className="text-gray-400 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-600">
                  <th className="py-4 px-6">Loại phản hồi</th>
                  <th className="py-4 px-6">Ngày</th>
                  <th className="py-4 px-6">Đánh giá</th>
                  <th className="py-4 px-6">Nội dung</th>
                  <th className="py-4 px-6">Người gửi</th>
                  <th className="py-4 px-6">Huấn luyện viên</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback) => (
                  <tr
                    key={feedback._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getFeedbackTypeIcon(feedback.feedback_type)}
                        <span className="text-sm text-gray-700">{getFeedbackTypeLabel(feedback.feedback_type)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(feedback.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (feedback.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({feedback.rating || 0}/5)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 max-w-xs truncate">
                      {feedback.content}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {feedback.user_id?.name || feedback.user_id?.email || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {feedback.coach_id?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={feedback.status || "pending"}
                        onChange={(e) => handleStatusUpdate(feedback._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(feedback.status)} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="hidden">Đã ẩn</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(feedback)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => {
                            setFeedbackToDelete(feedback._id);
                            setShowConfirm(true);
                          }}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isNew ? "Thêm Phản hồi Mới" : "Chỉnh sửa Phản hồi"}
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Đánh giá</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newData.rating}
                  onChange={(e) => setNewData({ ...newData, rating: parseInt(e.target.value) })}
                  className={`p-3 rounded-xl bg-gray-50 border text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.rating ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Nội dung</label>
                <textarea
                  placeholder="Nhập nội dung phản hồi..."
                  value={newData.content}
                  onChange={(e) => setNewData({ ...newData, content: e.target.value })}
                  rows="4"
                  className={`p-3 rounded-xl bg-gray-50 border text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Loại phản hồi</label>
                <select
                  value={newData.feedback_type}
                  onChange={(e) => setNewData({ ...newData, feedback_type: e.target.value })}
                  className={`p-3 rounded-xl bg-gray-50 border text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.feedback_type ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="user_to_system">Phản hồi Hệ thống</option>
                  <option value="user_to_coach">Phản hồi Huấn luyện viên</option>
                  <option value="user_to_plan">Phản hồi Kế hoạch</option>
                </select>
                {errors.feedback_type && <p className="text-red-500 text-sm mt-1">{errors.feedback_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Trạng thái</label>
                <select
                  value={newData.status}
                  onChange={(e) => setNewData({ ...newData, status: e.target.value })}
                  className={`p-3 rounded-xl bg-gray-50 border text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.status ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="hidden">Đã ẩn</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingFeedback(null);
                  setIsNew(false);
                }}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium"
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