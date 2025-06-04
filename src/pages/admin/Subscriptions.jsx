import React, { useState } from "react";
import { BadgeCheck, XCircle, Pencil, Plus, Trash } from "lucide-react";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: "Basic", price: "$9/mo", status: "Active" },
    { id: 2, name: "Premium", price: "$19/mo", status: "Active" },
    { id: 3, name: "Family", price: "$29/mo", status: "Inactive" },
  ]);

  const [selectedSub, setSelectedSub] = useState(null);
  const [editedSub, setEditedSub] = useState({ name: "", price: "", status: "Active" });
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openEditModal = (sub) => {
    setSelectedSub(sub);
    setIsNew(false);
    setEditedSub({ ...sub });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedSub({ name: "", price: "", status: "Active" });
    setSelectedSub({}); // Trigger modal
  };

  const handleSaveChanges = () => {
    if (!editedSub.name || !editedSub.price) return;

    if (isNew) {
      const newSub = {
        id: Date.now(),
        ...editedSub,
      };
      setSubscriptions((prev) => [...prev, newSub]);
      showToast("Subscription added successfully.");
    } else {
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === selectedSub.id ? { ...sub, ...editedSub } : sub))
      );
      showToast("Subscription updated successfully.");
    }

    setSelectedSub(null);
    setIsNew(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      showToast("Subscription deleted.", "error");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300
            ${toast.type === "error" ? "bg-red-600" : "bg-green-600"} text-white`}
        >
          {toast.message}
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Subscriptions
          </span>
        </h2>
        <p className="text-white/70">
          Manage and review all active and past subscriptions.
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Subscription
        </button>
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto bg-white/5 rounded-xl p-6 shadow-lg ring-1 ring-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-white/80 border-b border-white/10">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="hover:bg-white/10 transition duration-200 border-b border-white/10"
              >
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                  {sub.status === "Active" ? (
                    <BadgeCheck className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  {sub.name}
                </td>
                <td className="py-3 px-4">{sub.price}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      sub.status === "Active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 transition text-white"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Subscription" : "Edit Subscription"}
            </h3>

            <div className="grid gap-3 mb-6">
              <input
                type="text"
                value={editedSub.name}
                onChange={(e) => setEditedSub({ ...editedSub, name: e.target.value })}
                placeholder="Subscription Name"
                className="p-2 rounded text-black w-full"
              />
              <input
                type="text"
                value={editedSub.price}
                onChange={(e) => setEditedSub({ ...editedSub, price: e.target.value })}
                placeholder="Price"
                className="p-2 rounded text-black w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Status:</span>
                <button
                  onClick={() =>
                    setEditedSub({
                      ...editedSub,
                      status:
                        editedSub.status === "Active" ? "Inactive" : "Active",
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    editedSub.status === "Active"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {editedSub.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedSub(null);
                  setIsNew(false);
                }}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Subscriptions;
