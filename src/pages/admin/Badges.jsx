import React from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Shield,
  Trophy,
  Gem,
} from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useBadges from "../../hook/useBadges";

const Badges = () => {
  const {
    badges,
    loading,
    error,
    editingBadge,
    setEditingBadge,
    newData,
    setNewData,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    badgeToDelete,
    setBadgeToDelete,
    handleEdit,
    handleNew,
    handleSave,
    handleDelete,
  } = useBadges();

  const iconByLevel = {
    Bronze: <Shield className="w-6 h-6 text-amber-600" />,
    Silver: <Trophy className="w-6 h-6 text-slate-300" />,
    Gold: <Gem className="w-6 h-6 text-yellow-400" />,
  };

  if (loading && badges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-700 text-lg">
          <svg className="animate-spin h-5 w-5 text-cyan-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Quản lý huy hiệu
        </h2>
        <p className="text-gray-600 text-lg">
          Xem danh sách các thành tích và yêu cầu của chúng.
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Thêm huy hiệu
        </button>
      </div>

      {/* Badge List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {badges.map((badge) => (
          <div
            key={badge._id}
            className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center justify-center mb-4">
                {badge.url_image ? (
                  <img 
                    src={badge.url_image} 
                    alt={badge.name}
                    className="w-16 h-16 object-contain rounded-full"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=Badge')}
                  />
                ) : (
                  iconByLevel[badge.tier]
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">{badge.name}</h3>
              <p className="text-sm text-gray-600 mb-3 text-center">{badge.condition}</p>
              <p className="text-xs text-gray-500 text-center mb-2">
                Cấp bậc: {badge.tier === "Bronze" ? "Đồng" : badge.tier === "Silver" ? "Bạc" : "Vàng"}
              </p>
              <p className="text-xs text-gray-500 text-center mb-4">Điểm: {badge.point_value}</p>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(badge)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-cyan-500 hover:text-white text-gray-700 text-xs font-medium transition"
                >
                  <Pencil className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    setBadgeToDelete(badge._id);
                    setShowConfirm(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-500 text-red-700 hover:text-white text-xs font-medium transition"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingBadge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isNew ? "Thêm huy hiệu mới" : "Chỉnh sửa huy hiệu"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                  type="text"
                  placeholder="Nhập tên huy hiệu"
                  value={newData.name}
                  onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điều kiện</label>
                <input
                  type="text"
                  placeholder="Nhập điều kiện"
                  value={newData.condition}
                  onChange={(e) => setNewData({ ...newData, condition: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${errors.condition ? 'border-red-500' : 'border-gray-300'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị điểm</label>
                <input
                  type="number"
                  placeholder="Nhập giá trị điểm"
                  value={newData.point_value}
                  onChange={(e) => setNewData({ ...newData, point_value: parseInt(e.target.value) })}
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${errors.point_value ? 'border-red-500' : 'border-gray-300'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.point_value && <p className="text-red-500 text-xs mt-1">{errors.point_value}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
                <input
                  type="text"
                  placeholder="Nhập URL hình ảnh"
                  value={newData.url_image}
                  onChange={(e) => setNewData({ ...newData, url_image: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${errors.url_image ? 'border-red-500' : 'border-gray-300'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.url_image && <p className="text-red-500 text-xs mt-1">{errors.url_image}</p>}
                {newData.url_image && (
                  <img
                    src={newData.url_image}
                    alt="Badge Preview"
                    className="mt-3 w-full h-24 object-contain rounded-lg shadow-sm border border-gray-200"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found')}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc</label>
                <select
                  value={newData.tier}
                  onChange={(e) => setNewData({ ...newData, tier: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${errors.tier ? 'border-red-500' : 'border-gray-300'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="Bronze">Đồng</option>
                  <option value="Silver">Bạc</option>
                  <option value="Gold">Vàng</option>
                </select>
                {errors.tier && <p className="text-red-500 text-xs mt-1">{errors.tier}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingBadge(null);
                  setIsNew(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Bạn có chắc chắn muốn xóa huy hiệu này không?"
          onCancel={() => {
            setShowConfirm(false);
            setBadgeToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(badgeToDelete);
            setShowConfirm(false);
            setBadgeToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Badges;