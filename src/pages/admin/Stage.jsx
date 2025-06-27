import React from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useStages from "../../hook/useStages";

const Stage = () => {
  const {
    stages,
    plans,
    loading,
    error,
    selectedStage,
    setSelectedStage,
    editedStage,
    setEditedStage,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    stageToDelete,
    setStageToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
  } = useStages();

  if (loading && stages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center gap-2 text-white text-lg">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-lg bg-red-900/30 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
  <section className="py-16 bg-gray-100 min-h-screen text-gray-800">
    {/* Title */}
    <div className="text-center mb-10 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        Quản lý giai đoạn
      </h2>
      <p className="text-black-300 text-lg">
        Quản lý và tổ chức các giai đoạn cho các kế hoạch cai thuốc lá
      </p>
    </div>

    {/* Add New Button */}
    <div className="max-w-6xl mx-auto mb-8 flex justify-end">
      <button
        onClick={openNewModal}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5" />
        Thêm giai đoạn
      </button>
    </div>

    {/* Table */}
    <div className="max-w-10xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg ring-1 ring-gray-700 overflow-x-auto">
      <div className="min-w-[1000px]">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300 border-b border-gray-600">
              <th className="py-3 px-4">Giai đoạn #</th>
              <th className="py-3 px-4">Tiêu đề</th>
              <th className="py-3 px-4">Mô tả</th>
              <th className="py-3 px-4">Kế hoạch</th>
              <th className="py-3 px-4">Ngày bắt đầu</th>
              <th className="py-3 px-4">Ngày kết thúc</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr
                key={stage._id}
                className="hover:bg-gray-700 transition duration-200 border-b border-gray-600"
              >
                <td className="py-3 px-4 text-gray-200">{stage.stage_number}</td>
                <td className="py-3 px-4 text-gray-200 truncate">{stage.title}</td>
                <td className="py-3 px-4 text-gray-200 truncate">{stage.description}</td>
                <td className="py-3 px-4 text-gray-200 truncate">
                  {plans.find(p => p._id === stage.plan_id)?.name || stage.plan_id}
                </td>
                <td className="py-3 px-4 text-gray-200">{new Date(stage.start_date).toLocaleDateString('vi-VN')}</td>
                <td className="py-3 px-4 text-gray-200">{new Date(stage.end_date).toLocaleDateString('vi-VN')}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-4 py-2 text-sm rounded-full font-semibold min-w-[120px] text-center ${
                      stage.is_completed
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    {stage.is_completed ? "Hoàn thành" : "Đang thực hiện"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(stage)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-cyan-500 text-white text-xs font-medium transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setStageToDelete(stage._id);
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
            {stages.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  Không tìm thấy giai đoạn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Modal for Add/Edit */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-cyan-300">
              {isNew ? "Thêm giai đoạn mới" : "Chỉnh sửa giai đoạn"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kế hoạch</label>
                <select
                  value={editedStage.plan_id}
                  onChange={(e) => setEditedStage({ ...editedStage, plan_id: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.plan_id ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="">Chọn một kế hoạch</option>
                  {plans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                {errors.plan_id && <p className="text-red-400 text-xs mt-1">{errors.plan_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tiêu đề giai đoạn</label>
                <input
                  type="text"
                  value={editedStage.title}
                  onChange={(e) => setEditedStage({ ...editedStage, title: e.target.value })}
                  placeholder="Nhập tiêu đề giai đoạn"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.title ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Mô tả giai đoạn</label>
                <textarea
                  value={editedStage.description}
                  onChange={(e) => setEditedStage({ ...editedStage, description: e.target.value })}
                  placeholder="Nhập mô tả giai đoạn"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.description ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                  rows="4"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Số thứ tự giai đoạn</label>
                <input
                  type="number"
                  value={editedStage.stage_number}
                  onChange={(e) => setEditedStage({ ...editedStage, stage_number: e.target.value })}
                  placeholder="Nhập số thứ tự giai đoạn"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.stage_number ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.stage_number && <p className="text-red-400 text-xs mt-1">{errors.stage_number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={editedStage.start_date}
                  onChange={(e) => setEditedStage({ ...editedStage, start_date: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.start_date ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.start_date && <p className="text-red-400 text-xs mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  value={editedStage.end_date}
                  onChange={(e) => setEditedStage({ ...editedStage, end_date: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.end_date ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Trạng thái:</span>
                <button
                  onClick={() =>
                    setEditedStage({
                      ...editedStage,
                      is_completed: !editedStage.is_completed,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    editedStage.is_completed
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                  }`}
                >
                  {editedStage.is_completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedStage(null);
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
          message="Bạn có chắc chắn muốn xóa giai đoạn này không?"
          onCancel={() => {
            setShowConfirm(false);
            setStageToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(stageToDelete);
            setShowConfirm(false);
            setStageToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Stage;