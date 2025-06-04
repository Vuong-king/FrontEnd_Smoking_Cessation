import React, { useState } from "react";
import { ShieldCheck, UserCheck, User } from "lucide-react"; // dùng icon từ lucide-react
import { ConfirmModal } from "../../components/admin/ConfirmModal";

const Users = () => {
  const [role, setRole] = useState("Coach");
  const [users, setUsers] = useState([
    {
      id: 1,
      login: "admin1@example.com",
      first: "Admin",
      last: "One",
      role: "Admin",
    },
    {
      id: 2,
      login: "coach1@example.com",
      first: "Thanh",
      last: "Nguyen",
      role: "Coach",
    },
    {
      id: 3,
      login: "customer1@example.com",
      first: "Anh",
      last: "Tran",
      role: "Customer",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ login: "", first: "", last: "" });
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter((u) => u.role === role);

  const handleAddOrUpdate = () => {
    if (!newUser.login || !newUser.first || !newUser.last) return;

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...newUser } : u))
      );
      setEditingId(null);
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: Date.now(),
          login: newUser.login,
          first: newUser.first,
          last: newUser.last,
          role,
        },
      ]);
    }

    setNewUser({ login: "", first: "", last: "" });
    setShowModal(false);
  };

  const handleEdit = (u) => {
    setNewUser({ login: u.login, first: u.first, last: u.last });
    setEditingId(u.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const RoleIcon = () => {
    if (role === "Admin")
      return <ShieldCheck className="inline w-5 h-5 text-purple-400 ml-2" />;
    if (role === "Coach")
      return <UserCheck className="inline w-5 h-5 text-cyan-400 ml-2" />;
    return <User className="inline w-5 h-5 text-green-400 ml-2" />;
  };

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
          {["Admin", "Coach", "Customer"].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setNewUser({ login: "", first: "", last: "" });
                setEditingId(null);
                setShowModal(false);
              }}
              className={`px-4 py-2 rounded font-medium transition duration-300 transform ${
                role === r
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md"
                  : "bg-white/10 text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500 hover:scale-105"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-4xl mx-auto bg-white/5 rounded-xl p-6 shadow-xl ring-1 ring-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th>Email</th>
              <th>First</th>
              <th>Last</th>
              <th>Role</th>
              {(role === "Coach" || role === "Customer") && <th>Actions</th>}
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
                <td>{u.login}</td>
                <td>{u.first}</td>
                <td>{u.last}</td>
                <td>{u.role}</td>
                {(role === "Coach" || role === "Customer") && (
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

      {/* FAB - Floating Add Button */}
      {(role === "Coach" || role === "Customer") && (
        <button
          onClick={() => {
            setShowModal(true);
            setNewUser({ login: "", first: "", last: "" });
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

      {/* MODAL */}
      {showModal && (role === "Coach" || role === "Customer") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {editingId ? "Edit" : "Add"} {role}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="email"
                placeholder="Email"
                className="p-2 rounded text-black"
                value={newUser.login}
                onChange={(e) =>
                  setNewUser({ ...newUser, login: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="First Name"
                className="p-2 rounded text-black"
                value={newUser.first}
                onChange={(e) =>
                  setNewUser({ ...newUser, first: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="p-2 rounded text-black"
                value={newUser.last}
                onChange={(e) =>
                  setNewUser({ ...newUser, last: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewUser({ login: "", first: "", last: "" });
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded shadow-md bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 rounded shadow-md bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold transition duration-300"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
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
