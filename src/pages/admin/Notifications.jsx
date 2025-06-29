import React from "react";
import { Plus, Trash, Pencil } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useNotifications from "../../hook/useNotifications";

const Notifications = () => {
  const {
    notifications,
    progresses,
    loading,
    error,
    selectedNotification,
    setSelectedNotification,
    editedNotification,
    setEditedNotification,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    notificationToDelete,
    setNotificationToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
  } = useNotifications();

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-xl bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-100 relative text-gray-800">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Quản Lý Thông Báo
          </span>
        </h2>
        <p className="text-gray-800">
          Quản lý và lên lịch thông báo cho người dùng
        </p>
      </div>

      {/* Add New Button */}
      {/* <div className="max-w-4xl mx-auto mb-4 text-right">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Thêm Thông Báo
        </button>
      </div> */}

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl p-6 shadow-lg ring-1 ring-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-600 border-b border-gray-200">
              <th className="py-3 px-4">Thông Điệp</th>
              <th className="py-3 px-4">Loại</th>
              <th className="py-3 px-4">Thời Gian Gửi</th>
              <th className="py-3 px-4">Tiến Độ</th>
              <th className="py-3 px-4">Trạng Thái</th>
              {/* <th className="py-3 px-4 text-right">Hành Động</th> */}
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification._id}
                className="hover:bg-gray-50 transition duration-200 border-b border-gray-200"
              >
                <td className="py-3 px-4 text-gray-700">{notification.message}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    notification.type === 'daily' 
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
                  }`}>
                    {notification.type === 'daily' ? 'Hàng ngày' : 
                     notification.type === 'weekly' ? 'Hàng tuần' : 
                     'Động lực'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{notification.schedule}</td>
                <td className="py-3 px-4 text-gray-700">
                  {progresses.find(p => p._id === notification.progress_id)?.stage_id || notification.progress_id}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    notification.is_sent 
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}>
                    {notification.is_sent ? "Đã gửi" : "Chưa gửi"}
                  </span>
                </td>
                {/* <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(notification)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-cyan-500 hover:text-white text-gray-700 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      setNotificationToDelete(notification._id);
                      setShowConfirm(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-red-100 hover:bg-red-500 text-red-700 hover:text-white transition"
                  >
                    <Trash className="w-4 h-4" />
                    Xóa
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              {isNew ? "Thêm Thông Báo Mới" : "Chỉnh Sửa Thông Báo"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <select
                  value={editedNotification.progress_id}
                  onChange={(e) => setEditedNotification({ ...editedNotification, progress_id: e.target.value })}
                  className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.progress_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Chọn tiến độ</option>
                  {progresses.map(progress => (
                    <option key={progress._id} value={progress._id}>
                      Giai đoạn {progress.stage_id} - {new Date(progress.date).toLocaleDateString('vi-VN')}
                    </option>
                  ))}
                </select>
                {errors.progress_id && <p className="text-red-500 text-sm mt-1">{errors.progress_id}</p>}
              </div>

              <div>
                <textarea
                  value={editedNotification.message}
                  onChange={(e) => setEditedNotification({ ...editedNotification, message: e.target.value })}
                  placeholder="Thông điệp thông báo"
                  className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.message ? 'border-red-500' : ''}`}
                  rows="3"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <div>
                <select
                  value={editedNotification.type}
                  onChange={(e) => setEditedNotification({ ...editedNotification, type: e.target.value })}
                  className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.type ? 'border-red-500' : ''}`}
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="motivation">Động lực</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <input
                  type="datetime-local"
                  value={editedNotification.schedule}
                  onChange={(e) => setEditedNotification({ ...editedNotification, schedule: e.target.value })}
                  className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.schedule ? 'border-red-500' : ''}`}
                />
                {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={editedNotification.is_sent}
                    onChange={(e) => setEditedNotification({ ...editedNotification, is_sent: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                  />
                  Đánh dấu đã gửi
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedNotification(null);
                  setIsNew(false);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Bạn có chắc chắn muốn xóa thông báo này không?"
          onCancel={() => {
            setShowConfirm(false);
            setNotificationToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(notificationToDelete);
            setShowConfirm(false);
            setNotificationToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Notifications;