import React, { useState } from "react";
import { ShieldCheck, UserCheck, User } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useUsers from "../../../hook/useUsers";

const Users = () => {
  const [role, setRole] = useState("admin");
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

  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers(role);

  const filteredUsers = users.filter((u) => u.role === role);

  const handleAddOrUpdate = async () => {
    const newErrors = {
      email: !newUser.email ? "Please enter an email" :
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email) ? "Please enter a valid email" : "",
      name: !newUser.name ? "Please enter a name" : "",
      role: editingId && !newUser.role ? "Please select a role" : "",
      avatar_url: ""
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }
    if (editingId) {
      await updateUser(editingId, { ...newUser });
    } else {
      await createUser({
        ...newUser,
        role: role,
        avatar_url: newUser.avatar_url || "https://example.com/default-avatar.png"
      });
    }
    setNewUser({ email: "", name: "", role: "", avatar_url: "" });
    setErrors({ email: "", name: "", role: "", avatar_url: "" });
    setEditingId(null);
    setShowModal(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">
          Manage{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            {role}s
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
                  : "bg-white/10 text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500 hover:scale-105"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/5 rounded-xl p-6 shadow-xl ring-1 ring-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th>Avatar</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              {(role === "coach" || role === "user") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr
                key={u.id}
                className={`border-b border-white/10 hover:bg-white/5 transition duration-200 ${
                  index === 0 ? "rounded-t-lg" : ""
                }`}
              >
                <td>
                  <img
                    src={u.avatar_url}
                    alt={`${u.name}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
                {(role === "coach" || role === "user") && (
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 rounded text-white font-semibold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setUserToDelete(u.id);
                        setShowConfirm(true);
                      }}
                      className="px-3 py-1 rounded text-white font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white/60">
                  No {role}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(role === "coach" || role === "user") && (
        <button
          onClick={() => {
            setShowModal(true);
            setNewUser({ email: "", name: "", role: "", avatar_url: "" });
            setEditingId(null);
          }}
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
            Add New {role}
          </span>
        </button>
      )}

      {showModal && (role === "coach" || role === "user") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {editingId ? "Edit" : "Add"} {role}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {editingId && (
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={newUser.avatar_url || "https://example.com/default-avatar.png"}
                    alt="Current avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Avatar URL"
                      className={`p-2 rounded text-black w-full ${errors.avatar_url ? 'border-2 border-red-500' : ''}`}
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
                  className={`p-2 rounded text-black w-full ${errors.email ? 'border-2 border-red-500' : ''}`}
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
                  placeholder="Name"
                  className={`p-2 rounded text-black w-full ${errors.name ? 'border-2 border-red-500' : ''}`}
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
                    className={`p-2 rounded text-black w-full ${errors.role ? 'border-2 border-red-500' : ''}`}
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="coach">Coach</option>
                    <option value="user">User</option>
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
                className="px-4 py-2 rounded shadow-md bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                disabled={loading}
                className="px-4 py-2 rounded shadow-md bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold transition duration-300 disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
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
