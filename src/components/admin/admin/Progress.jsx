import React, { useState, useEffect } from "react";
import { Pencil, Plus, Trash, Calendar, DollarSign, Activity } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useProgress from "../../../hook/useProgress";
import api from "../../api";

const Progress = () => {
  const {
    progress,
    loading,
    error,
    createProgress,
    updateProgress,
    deleteProgress,
  } = useProgress();

  const [selectedProgress, setSelectedProgress] = useState(null);
  const [stages, setStages] = useState([]);
  const [users, setUsers] = useState([]);
  const [editedProgress, setEditedProgress] = useState({
    stage_id: "",
    date: "",
    cigarettes_smoked: "",
    money_saved: "",
    user_id: ""
  });
  const [errors, setErrors] = useState({
    stage_id: "",
    date: "",
    cigarettes_smoked: "",
    money_saved: "",
    user_id: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [progressToDelete, setProgressToDelete] = useState(null);

  useEffect(() => {
    fetchStages();
    fetchUsers();
  }, []);

  const fetchStages = async () => {
    try {
      const response = await api.get('/stages');
      setStages(response.data);
    } catch {
      setStages([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch {
      setUsers([]);
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
      user_id: progress.user_id
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedProgress({
      stage_id: "",
      date: "",
      cigarettes_smoked: "",
      money_saved: "",
      user_id: ""
    });
    setSelectedProgress({});
  };

  const handleSaveChanges = async () => {
    const newErrors = {
      stage_id: !editedProgress.stage_id ? "Please select a stage" : "",
      date: !editedProgress.date ? "Please select a date" : "",
      cigarettes_smoked: !editedProgress.cigarettes_smoked ? "Please enter cigarettes smoked" : "",
      money_saved: !editedProgress.money_saved ? "Please enter money saved" : "",
      user_id: !editedProgress.user_id ? "Please select a user" : ""
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }
    if (isNew) {
      await createProgress(editedProgress);
    } else {
      await updateProgress(selectedProgress._id, editedProgress);
    }
    setSelectedProgress(null);
    setIsNew(false);
  };

  const handleDelete = async (id) => {
    await deleteProgress(id);
  };

  if (loading && progress.length === 0) {
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
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Progress Tracking
          </span>
        </h2>
        <p className="text-white/70">
          Monitor and manage user progress in their quit smoking journey
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Progress Record
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white/5 rounded-xl p-6 shadow-lg ring-1 ring-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-white/80 border-b border-white/10">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Cigarettes Smoked</th>
              <th className="py-3 px-4">Money Saved</th>
              <th className="py-3 px-4">Stage ID</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-white/10 transition duration-200 border-b border-white/10"
              >
                <td className="py-3 px-4">{new Date(p.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{p.cigarettes_smoked}</td>
                <td className="py-3 px-4">{p.money_saved} VND</td>
                <td className="py-3 px-4">{p.stage_id}</td>
                <td className="py-3 px-4">{p.user_id}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setProgressToDelete(p._id);
                      setShowConfirm(true);
                    }}
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
      {selectedProgress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Progress" : "Edit Progress"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <select
                  value={editedProgress.stage_id}
                  onChange={(e) => setEditedProgress({ ...editedProgress, stage_id: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.stage_id ? 'border-2 border-red-500' : ''}`}
                >
                  <option value="">Select a stage</option>
                  {stages.map(stage => (
                    <option key={stage._id} value={stage._id}>
                      {stage.title} - Stage {stage.stage_number}
                    </option>
                  ))}
                </select>
                {errors.stage_id && <p className="text-red-500 text-sm mt-1">{errors.stage_id}</p>}
              </div>

              <div>
                <select
                  value={editedProgress.user_id}
                  onChange={(e) => setEditedProgress({ ...editedProgress, user_id: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.user_id ? 'border-2 border-red-500' : ''}`}
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
              </div>

              <div>
                <input
                  type="date"
                  value={editedProgress.date}
                  onChange={(e) => setEditedProgress({ ...editedProgress, date: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.date ? 'border-2 border-red-500' : ''}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <input
                  type="number"
                  value={editedProgress.cigarettes_smoked}
                  onChange={(e) => setEditedProgress({ ...editedProgress, cigarettes_smoked: e.target.value })}
                  placeholder="Cigarettes Smoked"
                  className={`p-2 rounded text-black w-full ${errors.cigarettes_smoked ? 'border-2 border-red-500' : ''}`}
                />
                {errors.cigarettes_smoked && <p className="text-red-500 text-sm mt-1">{errors.cigarettes_smoked}</p>}
              </div>

              <div>
                <input
                  type="number"
                  value={editedProgress.money_saved}
                  onChange={(e) => setEditedProgress({ ...editedProgress, money_saved: e.target.value })}
                  placeholder="Money Saved (VND)"
                  className={`p-2 rounded text-black w-full ${errors.money_saved ? 'border-2 border-red-500' : ''}`}
                />
                {errors.money_saved && <p className="text-red-500 text-sm mt-1">{errors.money_saved}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedProgress(null);
                  setIsNew(false);
                }}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this progress record?"
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
