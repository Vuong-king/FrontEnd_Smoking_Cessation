import React from "react";
import { ShieldCheck, UserCheck, User } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useUsers from "../../hook/useUsers";

const Users = () => {
  const {
    users,
    loading,
    error,
    role,
    setRole,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    errors,
    editingId,
    setEditingId,
    showConfirm,
    setShowConfirm,
    userToDelete,
    setUserToDelete,
    openNewModal,
    openEditModal,
    handleSave,
    deleteUser,
  } = useUsers();

  const filteredUsers = users.filter((u) => u.role === role);

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  const RoleIcon = () => {
    if (role === "Admin")
      return <ShieldCheck className="inline w-5 h-5 text-purple-400 ml-2" />;
    if (role === "Coach")
      return <UserCheck className="inline w-5 h-5 text-cyan-400 ml-2" />;
    return <User className="inline w-5 h-5 text-green-400 ml-2" />;
  };

  if (loading && users.length === 0) {
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
    <section className="py-20 bg-gray-50 min-h-screen text-gray-800">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">
          Quản lý {" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-black  font-bold">
            {role === "admin" ? "Quản trị viên" : role === "coach" ? "Huấn luyện viên" : "Người dùng"}
          </span>{" "}
          <RoleIcon />
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
              className={`px-4 py-2 rounded font-medium transition duration-300 transform ${
                role === r.toLowerCase()
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md"
                  : "bg-white/10 text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500 hover:scale-105"
              }`}
            >
              {r === "Admin" ? "Quản trị viên" : r === "Coach" ? "Huấn luyện viên" : "Người dùng"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-xl ring-1 ring-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th>Ảnh đại diện</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              {(role === "coach" || role === "user") && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr
                key={u.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition duration-200 ${
                  index === 0 ? "rounded-t-lg" : ""
                }`}
              >
                <td>
                  <img
                    src={u.avatar_url}
                    alt={`Ảnh đại diện của ${u.name}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="text-gray-700">{u.email}</td>
                <td className="text-gray-700">{u.name}</td>
                <td className="text-gray-700">{u.role === "admin" ? "Quản trị viên" : u.role === "coach" ? "Huấn luyện viên" : "Người dùng"}</td>
                {(role === "coach" || role === "user") && (
                  <td className="space-x-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="px-3 py-1 rounded text-gray-700 font-semibold bg-gray-100 hover:bg-cyan-500 hover:text-white transition"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => {
                        setUserToDelete(u.id);
                        setShowConfirm(true);
                      }}
                      className="px-3 py-1 rounded text-red-700 font-semibold bg-red-100 hover:bg-red-500 hover:text-white transition"
                    >
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  {role === "admin" ? "Không có quản trị viên nào." : role === "coach" ? "Không có huấn luyện viên nào." : "Không có người dùng nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* {(role === "coach" || role === "user") && (
        <button
          onClick={openNewModal}
          className="fixed bottom-10 right-10 flex items-center gap-3 px-6 py-3 rounded-full 
             bg-gradient-to-r from-purple-500 to-cyan-500 text-white 
             hover:from-purple-600 hover:to-cyan-600 
             shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span
            className="text-xl leading-none text-white"
            style={{ filter: "brightness(0) invert(1)" }}
          >
            ➕
          </span>

          <span className="text-sm font-semibold tracking-wide">
            Thêm {role === "coach" ? "huấn luyện viên" : "người dùng"}
          </span>
        </button>
      )} */}

      {showModal && (role === "coach" || role === "user") && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              {editingId ? "Sửa" : "Thêm"} {role === "coach" ? "huấn luyện viên" : "người dùng"}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {editingId && (
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={newUser.avatar_url || "https://example.com/default-avatar.png"}
                    alt="Ảnh đại diện hiện tại"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="URL ảnh đại diện"
                      className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.avatar_url ? 'border-red-500' : ''}`}
                      value={newUser.avatar_url}
                      onChange={(e) =>
                        setNewUser({ ...newUser, avatar_url: e.target.value })
                      }
                    />
                    {errors.avatar_url && <p className="text-red-500 text-sm mt-1">{errors.avatar_url}</p>}
                  </div>
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.email ? 'border-red-500' : ''}`}
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Họ tên"
                  className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.name ? 'border-red-500' : ''}`}
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              {editingId && (
                <div>
                  <select
                    className={`p-2 rounded bg-gray-50 text-gray-800 border border-gray-300 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${errors.role ? 'border-red-500' : ''}`}
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
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewUser({ email: "", name: "", role: "", avatar_url: "" });
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded shadow-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition duration-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded shadow-md bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold transition duration-300 disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm"}
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
