import React, { useState, useEffect } from "react";
import { Pencil, Plus, Trash, Calendar, DollarSign, Activity } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [stages, setStages] = useState([]);
  const [users, setUsers] = useState([]);
  const [editedProgress, setEditedProgress] = useState({
    stage_id: "",
    date: "",
    cigarettes_smoked: "",
    money_saved: "",
    user_id: "",
    health_stat: ""
  });
  const [errors, setErrors] = useState({
    stage_id: "",
    date: "",
    cigarettes_smoked: "",
    money_saved: "",
    user_id: "",
    health_stat: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [progressToDelete, setProgressToDelete] = useState(null);

  useEffect(() => {
    fetchProgress();
    fetchStages();
    fetchUsers();
  }, []);

  const fetchStages = async () => {
    try {
      const response = await api.get('/stages');
      setStages(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách giai đoạn:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách giai đoạn");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
    }
  };

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/progress');
      setProgress(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tiến trình:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách tiến trình");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (progress) => {
    setSelectedProgress(progress);
    setIsNew(false);
    setEditedProgress({
      stage_id: progress.stage_id,
      date: progress.date ? new Date(progress.date).toISOString().split('T')[0] : "",
      cigarettes_smoked: progress.cigarettes_smoked,
      money_saved: progress.money_saved,
      user_id: progress.user_id,
      health_stat: progress.health_stat || ""
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedProgress({
      stage_id: "",
      date: "",
      cigarettes_smoked: "",
      money_saved: "",
      user_id: "",
      health_stat: ""
    });
    setSelectedProgress({});
  };

  const handleSaveChanges = async () => {
    const newErrors = {
      stage_id: !editedProgress.stage_id ? "Vui lòng chọn một giai đoạn" : "",
      date: !editedProgress.date ? "Vui lòng chọn ngày" : "",
      cigarettes_smoked: !editedProgress.cigarettes_smoked ? "Vui lòng nhập số điếu thuốc đã hút" : "",
      money_saved: !editedProgress.money_saved ? "Vui lòng nhập số tiền tiết kiệm" : "",
      user_id: !editedProgress.user_id ? "Vui lòng chọn người dùng" : "",
      health_stat: !editedProgress.health_stat ? "Vui lòng nhập trạng thái hút thuốc ban đầu" : ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.post('/progress', editedProgress);
      } else {
        await api.put(`/progress/${selectedProgress._id}`, editedProgress);
      }
      await fetchProgress();
      setSelectedProgress(null);
      setIsNew(false);
    } catch (err) {
      console.error("Lỗi khi lưu tiến trình:", err);
      setError(err.response?.data?.message || "Không thể lưu tiến trình");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/progress/${id}`);
      await fetchProgress();
    } catch (err) {
      console.error("Lỗi khi xóa tiến trình:", err);
      setError(err.response?.data?.message || "Không thể xóa tiến trình");
    } finally {
      setLoading(false);
    }
  };

  if (loading && progress.length === 0) {
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
          Theo dõi tiến trình
        </h2>
        <p className="text-gray-300 text-lg">
          Theo dõi và quản lý tiến trình của người dùng trong hành trình cai thuốc lá
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-end">
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Thêm bản ghi tiến trình
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg ring-1 ring-gray-700 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-300 border-b border-gray-600">
              <th className="py-3 px-4">Ngày</th>
              <th className="py-3 px-4">Số điếu thuốc đã hút</th>
              <th className="py-3 px-4">Số tiền tiết kiệm</th>
              <th className="py-3 px-4">Giai đoạn</th>
              <th className="py-3 px-4">Người dùng</th>
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-gray-700 transition duration-200 border-b border-gray-600"
              >
                <td className="py-3 px-4 text-gray-200">{new Date(p.date).toLocaleDateString('vi-VN')}</td>
                <td className="py-3 px-4 text-gray-200">{p.cigarettes_smoked}</td>
                <td className="py-3 px-4 text-gray-200">{p.money_saved} VND</td>
                <td className="py-3 px-4 text-gray-200">
                  {stages.find(s => s._id === p.stage_id)?.title || p.stage_id}
                </td>
                <td className="py-3 px-4 text-gray-200">
                  {users.find(u => u.id === p.user_id)?.name || p.user_id}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-cyan-500 text-white text-xs font-medium transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setProgressToDelete(p._id);
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
            {progress.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  Không tìm thấy bản ghi tiến trình nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {selectedProgress && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-cyan-300">
              {isNew ? "Thêm tiến trình mới" : "Chỉnh sửa tiến trình"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Giai đoạn</label>
                <select
                  value={editedProgress.stage_id}
                  onChange={(e) => setEditedProgress({ ...editedProgress, stage_id: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.stage_id ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="">Chọn một giai đoạn</option>
                  {stages.map(stage => (
                    <option key={stage._id} value={stage._id}>
                      {stage.title} - Giai đoạn {stage.stage_number}
                    </option>
                  ))}
                </select>
                {errors.stage_id && <p className="text-red-400 text-xs mt-1">{errors.stage_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Người dùng</label>
                <select
                  value={editedProgress.user_id}
                  onChange={(e) => setEditedProgress({ ...editedProgress, user_id: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.user_id ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                >
                  <option value="">Chọn một người dùng</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.user_id && <p className="text-red-400 text-xs mt-1">{errors.user_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ngày</label>
                <input
                  type="date"
                  value={editedProgress.date}
                  onChange={(e) => setEditedProgress({ ...editedProgress, date: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.date ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-300 mb-1">Trạng thái hút thuốc ban đầu</label>
  <input
    type="text"
    value={editedProgress.health_stat || ""}
    onChange={(e) => setEditedProgress({ ...editedProgress, health_stat: e.target.value })}
    placeholder="Nhập trạng thái hút thuốc ban đầu"
    className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.health_stat ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
  />
  {errors.health_stat && <p className="text-red-400 text-xs mt-1">{errors.health_stat}</p>}
</div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Số điếu thuốc đã hút</label>
                <input
                  type="number"
                  value={editedProgress.cigarettes_smoked}
                  onChange={(e) => setEditedProgress({ ...editedProgress, cigarettes_smoked: e.target.value })}
                  placeholder="Nhập số điếu thuốc đã hút"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.cigarettes_smoked ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.cigarettes_smoked && <p className="text-red-400 text-xs mt-1">{errors.cigarettes_smoked}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Số tiền tiết kiệm (VND)</label>
                <input
                  type="number"
                  value={editedProgress.money_saved}
                  onChange={(e) => setEditedProgress({ ...editedProgress, money_saved: e.target.value })}
                  placeholder="Nhập số tiền tiết kiệm (VND)"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.money_saved ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.money_saved && <p className="text-red-400 text-xs mt-1">{errors.money_saved}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedProgress(null);
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
          message="Bạn có chắc chắn muốn xóa bản ghi tiến trình này không?"
          onCancel={() => {
            setShowConfirm(false);
            setProgressToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(progressToDelete);
            setShowConfirm(false);
            setProgressToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Progress;