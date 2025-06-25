import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const QuitPlans = () => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [dateError, setDateError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user: "",
    reason: "",
    name: "",
    start_date: "",
    target_quit_date: "",
  });

  const [errors, setErrors] = useState({
    user: "",
    reason: "",
    name: "",
    start_date: "",
    target_quit_date: "",
  });

  useEffect(() => {
    fetchPlans();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      setError(err.response?.data?.message || "Không thể lấy danh sách người dùng");
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/quitPlan');
      setPlans(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách kế hoạch:", err);
      setError(err.response?.data?.message || "Không thể lấy danh sách kế hoạch cai thuốc");
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (start, end) => {
    if (!start || !end) return true;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < endDate;
  };

  const handleDateChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (field === 'start_date' || field === 'target_quit_date') {
      const start = field === 'start_date' ? value : formData.start_date;
      const end = field === 'target_quit_date' ? value : formData.target_quit_date;
      
      if (!validateDates(start, end)) {
        setDateError("Ngày mục tiêu phải sau ngày bắt đầu");
      } else {
        setDateError("");
      }
    }
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingPlan({});
    setFormData({
      user: "",
      reason: "",
      name: "",
      start_date: "",
      target_quit_date: "",
    });
    setDateError("");
  };

  const handleEdit = (plan) => {
    setIsNew(false);
    setEditingPlan(plan);
    const user = users.find(u => u.id === plan.user_id);
    setSelectedUser(user);
    setFormData({
      user: plan.user_id,
      reason: plan.reason,
      name: plan.name,
      start_date: plan.start_date.split('T')[0],
      target_quit_date: plan.target_quit_date.split('T')[0],
    });
    setDateError("");
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setFormData({ ...formData, user: userId });
  };

  const handleSave = async () => {
    const newErrors = {
      user: !formData.user ? "Vui lòng chọn người dùng" : "",
      reason: !formData.reason ? "Vui lòng nhập lý do" : "",
      name: !formData.name ? "Vui lòng nhập tên kế hoạch" : "",
      start_date: !formData.start_date ? "Vui lòng chọn ngày bắt đầu" : "",
      target_quit_date: !formData.target_quit_date ? "Vui lòng chọn ngày mục tiêu" : "",
    };

    if (!validateDates(formData.start_date, formData.target_quit_date)) {
      newErrors.target_quit_date = "Ngày mục tiêu phải sau ngày bắt đầu";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        user_id: formData.user,
        start_date: new Date(formData.start_date).toISOString(),
        target_quit_date: new Date(formData.target_quit_date).toISOString(),
      };

      if (isNew) {
        await api.post('/quitPlan', dataToSend);
      } else {
        await api.put(`/quitPlan/${editingPlan._id}`, dataToSend);
      }
      await fetchPlans();
      setEditingPlan(null);
      setIsNew(false);
    } catch (err) {
      console.error("Lỗi khi lưu kế hoạch:", err);
      setError(err.response?.data?.message || "Không thể lưu kế hoạch cai thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/quitPlan/${id}`);
      await fetchPlans();
    } catch (err) {
      console.error("Lỗi khi xóa kế hoạch:", err);
      setError(err.response?.data?.message || "Không thể xóa kế hoạch cai thuốc");
    } finally {
      setLoading(false);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-100 min-h-screen text-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2 text-indigo-600">
            Kế Hoạch Cai Thuốc
          </h2>
          <p className="text-gray-500">Quản lý các kế hoạch cai thuốc của người dùng.</p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm Kế Hoạch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm font-semibold">
                <th className="py-3 px-4 text-left">Tên Kế Hoạch</th>
                <th className="py-3 px-4 text-left">Lý Do</th>
                <th className="py-3 px-4 text-left">Ngày Bắt Đầu</th>
                <th className="py-3 px-4 text-left">Ngày Mục Tiêu</th>
                <th className="py-3 px-4 text-left">ID Người Dùng</th>
                <th className="py-3 px-4 text-left">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                  onClick={() => navigate(`/admin/quit-plans/${plan._id}`, { state: { plan } })}
                >
                  <td className="py-3 px-4 text-sm text-gray-800">{plan.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{plan.reason}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(plan.start_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(plan.target_quit_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{plan.user_id._id}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                      >
                        <Pencil className="w-4 h-4" /> Sửa
                      </button>
                      <button
                        onClick={() => {
                          setPlanToDelete(plan._id);
                          setShowConfirm(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        <Trash className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                {isNew ? "Thêm Kế Hoạch Cai Thuốc Mới" : "Chỉnh Sửa Kế Hoạch Cai Thuốc"}
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <select
                    value={formData.user || ""}
                    onChange={handleUserChange}
                    className={`w-full p-3 rounded-lg border ${errors.user ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Chọn người dùng</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.responses?.name || user.name} ({user.responses?.email || user.email})
                      </option>
                    ))}
                  </select>
                  {errors.user && <p className="text-red-500 text-sm mt-1">{errors.user}</p>}
                  {selectedUser && (
                    <div className="mt-2 text-sm text-gray-500">
                      Đã chọn: {selectedUser.responses?.name || selectedUser.name} ({selectedUser.responses?.email || selectedUser.email})
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tên kế hoạch"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Lý do"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg border ${errors.reason ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>

                <div>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleDateChange('start_date', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                </div>

                <div>
                  <input
                    type="date"
                    value={formData.target_quit_date}
                    onChange={(e) => handleDateChange('target_quit_date', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${errors.target_quit_date ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.target_quit_date && <p className="text-red-500 text-sm mt-1">{errors.target_quit_date}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditingPlan(null);
                    setIsNew(false);
                    setDateError("");
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || dateError}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <ConfirmModal
            message="Bạn có chắc chắn muốn xóa kế hoạch cai thuốc này không?"
            onCancel={() => {
              setShowConfirm(false);
              setPlanToDelete(null);
            }}
            onConfirm={() => {
              handleDelete(planToDelete);
              setShowConfirm(false);
              setPlanToDelete(null);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default QuitPlans;