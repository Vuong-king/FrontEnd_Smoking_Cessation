import React from "react";
import { BadgeCheck, XCircle, Pencil, Plus, Trash } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useSubscriptions from "../../hook/useSubscriptions";

const Subscriptions = () => {
  const {
    subscriptions,
    packages,
    loading,
    error,
    selectedSub,
    setSelectedSub,
    editedSub,
    setEditedSub,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    subToDelete,
    setSubToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
  } = useSubscriptions();

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 min-h-screen text-gray-800">
        <div className="flex items-center gap-2 text-white text-lg">
          <svg
            className="animate-spin h-5 w-5 text-cyan-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            />
          </svg>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-lg bg-red-900/30 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-100 min-h-screen text-gray-800">
      {/* Title */}
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Quản lý đăng ký
        </h2>
        <p className="text-black-300 text-lg">
          Quản lý và xem xét tất cả các đăng ký hiện tại và đã qua.
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl text-black"
        >
          <Plus className="w-5 h-5" />
          Thêm đăng ký
        </button>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 ring-1 ring-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-600 border-b border-gray-200">
              <th className="py-3 px-4">Tên</th>
              <th className="py-3 px-4">Giá</th>
              <th className="py-3 px-4">Ngày bắt đầu</th>
              <th className="py-3 px-4">Ngày kết thúc</th>
              <th className="py-3 px-4">Gói</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-gray-50 transition duration-200 border-b border-gray-200"
              >
                <td className="py-3 px-4 text-gray-700">{sub.name}</td>
                <td className="py-3 px-4 text-gray-700">{sub.price}</td>
                <td className="py-3 px-4 text-gray-700">
                  {new Date(sub.start_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {new Date(sub.end_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {packages.find((p) => p._id === sub.package_id)?.name || sub.package_id}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      sub.status === 'active'
                        ? "bg-green-100 text-green-700"
                        : sub.status === 'pending'
                        ? "bg-yellow-100 text-yellow-700"
                        : sub.status === 'cancelled'
                        ? "bg-red-100 text-red-700"
                        : sub.status === 'expired'
                        ? "bg-gray-100 text-gray-700"
                        : sub.status === 'grace_period'
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {sub.status === 'active' ? "Đang hoạt động" 
                     : sub.status === 'pending' ? "Chờ xử lý"
                     : sub.status === 'cancelled' ? "Đã hủy"
                     : sub.status === 'expired' ? "Hết hạn"
                     : sub.status === 'grace_period' ? "Gia hạn"
                     : sub.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-cyan-500 hover:text-white text-gray-700 text-xs font-medium transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setSubToDelete(sub._id);
                      setShowConfirm(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-500 text-red-700 hover:text-white text-xs font-medium transition"
                  >
                    <Trash className="w-4 h-4" />
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isNew ? "Thêm đăng ký mới" : "Chỉnh sửa đăng ký"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gói
                </label>
                <select
                  value={editedSub.package_id}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, package_id: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${
                    errors.package_id ? "border-red-500" : "border-gray-300"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="">Chọn một gói</option>
                  {packages.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.package_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.package_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng ký
                </label>
                <input
                  type="text"
                  value={editedSub.name}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, name: e.target.value })
                  }
                  placeholder="Nhập tên đăng ký"
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá
                </label>
                <input
                  type="text"
                  value={editedSub.price}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, price: e.target.value })
                  }
                  placeholder="Nhập giá"
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={editedSub.start_date}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, start_date: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${
                    errors.start_date ? "border-red-500" : "border-gray-300"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.start_date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={editedSub.end_date}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, end_date: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${
                    errors.end_date ? "border-red-500" : "border-gray-300"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={editedSub.status}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, status: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-50 text-gray-800 border ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="expired">Hết hạn</option>
                  <option value="grace_period">Gia hạn</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedSub(null);
                  setIsNew(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
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
          message="Bạn có chắc chắn muốn xóa đăng ký này không?"
          onCancel={() => {
            setShowConfirm(false);
            setSubToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(subToDelete);
            setShowConfirm(false);
            setSubToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Subscriptions;
