import React, { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, User, PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const Users = () => {
  const [role, setRole] = useState("admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "", avatar_url: "" });
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    role: "",
    avatar_url: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/user');
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => u.role === role);

  const handleAddOrUpdate = async () => {
    const newErrors = {
      email: !newUser.email ? "Vui lòng nhập email" : 
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email) ? "Vui lòng nhập email hợp lệ" : "",
      name: !newUser.name ? "Vui lòng nhập tên" : "",
      role: editingId && !newUser.role ? "Vui lòng chọn vai trò" : "",
      avatar_url: ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/user/${editingId}`, {
          ...newUser
        });
      } else {
        await api.post('/user', {
          ...newUser,
          role: role,
          avatar_url: newUser.avatar_url || "https://example.com/default-avatar.png"
        });
      }
      await fetchUsers();
      setNewUser({ email: "", name: "", role: "", avatar_url: "" });
      setErrors({ email: "", name: "", role: "", avatar_url: "" });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      console.error("Lỗi khi lưu người dùng:", err);
      setError(err.response?.data?.message || "Không thể lưu người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setNewUser({ 
      email: u.email, 
      name: u.name,
      role: u.role,
      avatar_url: u.avatar_url
    });
    setErrors({ email: "", name: "", role: "", avatar_url: "" });
    setEditingId(u.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/user/${id}`);
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      setError(err.response?.data?.message || "Không thể xóa người dùng");
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = () => {
    if (role === "Admin")
      return <ShieldCheck className="inline w-5 h-5 text-purple-400 ml-2" />;
    if (role === "Coach")
      return <UserCheck className="inline w-5 h-5 text-cyan-400 ml-2" />;
    return <User className="inline w-5 h-5 text-green-400 ml-2" />;
  };

  const roleTranslations = {
    Admin: "Quản trị viên",
    Coach: "Huấn luyện viên",
    User: "Người dùng"
  };

  if (loading && users.length === 0) {
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
    <section className="py-16 bg-gray-900 min-h-screen text-white">
      {/* Title */}
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Quản lý {roleTranslations[role.charAt(0).toUpperCase() + role.slice(1)]} <RoleIcon />
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          {["Admin", "Coach", "User"].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r.toLowerCase());
                setNewUser({ email: "", name: "", role: "", avatar_url: "" });
                setEditingId(null);
                setShowModal(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition duration-300 transform ${
                role === r.toLowerCase()
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-md"
                  : "bg-gray-700 text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:scale-105"
              }`}
            >
              {roleTranslations[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg ring-1 ring-gray-700 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-300 border-b border-gray-600">
              <th className="py-3 px-4">Ảnh đại diện</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Tên</th>
              <th className="py-3 px-4">Vai trò</th>
              {(role === "coach" || role === "user") && <th className="py-3 px-4 text-right">Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr
                key={u.id}
                className={`border-b border-gray-600 hover:bg-gray-700 transition duration-200 ${
                  index === 0 ? "rounded-t-lg" : ""
                }`}
              >
                <td className="py-3 px-4">
                  <img 
                    src={u.avatar_url || "https://example.com/default-avatar.png"} 
                    alt={`Ảnh đại diện của ${u.name}`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=Avatar')}
                  />
                </td>
                <td className="py-3 px-4 text-gray-200">{u.email}</td>
                <td className="py-3 px-4 text-gray-200">{u.name}</td>
                <td className="py-3 px-4 text-gray-200">{roleTranslations[u.role.charAt(0).toUpperCase() + u.role.slice(1)]}</td>
                {(role === "coach" || role === "user") && (
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-cyan-500 text-white text-xs font-medium transition"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(u.id);
                        setShowConfirm(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={role === "admin" ? 4 : 5} className="text-center py-4 text-gray-400">
                  Không tìm thấy {roleTranslations[role.charAt(0).toUpperCase() + role.slice(1)]}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Button */}
      {(role === "coach" || role === "user") && (
        <button
          onClick={() => {
            setShowModal(true);
            setNewUser({ email: "", name: "", role: "", avatar_url: "" });
            setEditingId(null);
          }}
          className="fixed bottom-10 right-10 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">
            Thêm {roleTranslations[role.charAt(0).toUpperCase() + role.slice(1)]} mới
          </span>
        </button>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (role === "coach" || role === "user") && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-cyan-300">
              {editingId ? `Chỉnh sửa ${roleTranslations[role.charAt(0).toUpperCase() + role.slice(1)]}` : `Thêm ${roleTranslations[role.charAt(0).toUpperCase() + role.slice(1)]} mới`}
            </h3>
            <div className="space-y-4">
              {editingId && (
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={newUser.avatar_url || "https://example.com/default-avatar.png"} 
                    alt="Ảnh đại diện hiện tại"
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=Avatar')}
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL ảnh đại diện</label>
                    <input
                      type="text"
                      placeholder="Nhập URL ảnh đại diện"
                      className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.avatar_url ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                      value={newUser.avatar_url}
                      onChange={(e) =>
                        setNewUser({ ...newUser, avatar_url: e.target.value })
                      }
                    />
                    {errors.avatar_url && <p className="text-red-400 text-xs mt-1">{errors.avatar_url}</p>}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tên</label>
                <input
                  type="text"
                  placeholder="Nhập tên"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              {editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vai trò</label>
                  <select
                    className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.role ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="coach">Huấn luyện viên</option>
                    <option value="user">Người dùng</option>
                  </select>
                  {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewUser({ email: "", name: "", role: "", avatar_url: "" });
                  setEditingId(null);
                }}
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddOrUpdate}
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
                ) : editingId ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <ConfirmModal
          message="Bạn có chắc chắn muốn xóa người dùng này không?"
          onCancel={() => {
            setShowConfirm(false);
            setUserToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(userToDelete);
            setShowConfirm(false);
            setUserToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Users;