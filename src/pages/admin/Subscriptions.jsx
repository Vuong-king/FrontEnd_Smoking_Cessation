import React from "react";
import { BadgeCheck, XCircle, Pencil, Plus, Trash } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useSubscriptions from "../../hook/useSubscriptions";

const Subscriptions = () => {
  const {
    subscriptions,
    plans,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
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
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg ring-1 ring-gray-700 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-300 border-b border-gray-600">
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
                className="hover:bg-gray-700 transition duration-200 border-b border-gray-600"
              >
                <td className="py-3 px-4 text-gray-200">{sub.name}</td>
                <td className="py-3 px-4 text-gray-200">{sub.price}</td>
                <td className="py-3 px-4 text-gray-200">
                  {new Date(sub.start_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 text-gray-200">
                  {new Date(sub.end_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 text-gray-200">
                  {plans.find((p) => p._id === sub.plan_id)?.name || sub.plan_id}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      sub.is_active
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {sub.is_active ? "Kích hoạt" : "Không kích hoạt"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-cyan-500 text-white text-xs font-medium transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setSubToDelete(sub._id);
                      setShowConfirm(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-cyan-300">
              {isNew ? "Thêm đăng ký mới" : "Chỉnh sửa đăng ký"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Gói
                </label>
                <select
                  value={editedSub.plan_id}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, plan_id: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${
                    errors.plan_id ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="">Chọn một gói</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                {errors.plan_id && (
                  <p className="text-red-400 text-xs mt-1">{errors.plan_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tên đăng ký
                </label>
                <input
                  type="text"
                  value={editedSub.name}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, name: e.target.value })
                  }
                  placeholder="Nhập tên đăng ký"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Giá
                </label>
                <input
                  type="text"
                  value={editedSub.price}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, price: e.target.value })
                  }
                  placeholder="Nhập giá"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${
                    errors.price ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={editedSub.start_date}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, start_date: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${
                    errors.start_date ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.start_date && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.start_date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={editedSub.end_date}
                  onChange={(e) =>
                    setEditedSub({ ...editedSub, end_date: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${
                    errors.end_date ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.end_date && (
                  <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Trạng thái:</span>
                <button
                  onClick={() =>
                    setEditedSub({
                      ...editedSub,
                      is_active: !editedSub.is_active,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    editedSub.is_active
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {editedSub.is_active ? "Hủy kích hoạt" : "Kích hoạt"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedSub(null);
                  setIsNew(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 transition"
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
