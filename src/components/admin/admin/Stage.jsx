import React, { useState, useEffect } from "react";
import { Pencil, Plus, Trash, Calendar, ListOrdered } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const Stage = () => {
  const [stages, setStages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [editedStage, setEditedStage] = useState({
    plan_id: "",
    title: "",
    description: "",
    stage_number: "",
    start_date: "",
    end_date: "",
    is_completed: false
  });
  const [errors, setErrors] = useState({
    plan_id: "",
    title: "",
    description: "",
    stage_number: "",
    start_date: "",
    end_date: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);

  useEffect(() => {
    fetchStages();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/quitPlan');
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.response?.data?.message || "Failed to fetch plans");
    }
  };

  const fetchStages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/stages');
      setStages(response.data);
    } catch (err) {
      console.error("Error fetching stages:", err);
      setError(err.response?.data?.message || "Failed to fetch stages");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (stage) => {
    setSelectedStage(stage);
    setIsNew(false);
    setEditedStage({
      plan_id: stage.plan_id,
      title: stage.title,
      description: stage.description,
      stage_number: stage.stage_number,
      start_date: stage.start_date ? new Date(stage.start_date).toISOString().split('T')[0] : "",
      end_date: stage.end_date ? new Date(stage.end_date).toISOString().split('T')[0] : "",
      is_completed: stage.is_completed
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedStage({
      plan_id: "",
      title: "",
      description: "",
      stage_number: "",
      start_date: "",
      end_date: "",
      is_completed: false
    });
    setSelectedStage({});
  };

  const handleSaveChanges = async () => {
    const newErrors = {
      plan_id: !editedStage.plan_id ? "Please select a plan" : "",
      title: !editedStage.title ? "Please enter a title" : "",
      description: !editedStage.description ? "Please enter a description" : "",
      stage_number: !editedStage.stage_number ? "Please enter a stage number" : "",
      start_date: !editedStage.start_date ? "Please select a start date" : "",
      end_date: !editedStage.end_date ? "Please select an end date" : ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.post('/stages', editedStage);
      } else {
        await api.put(`/stages/${selectedStage._id}`, editedStage);
      }
      await fetchStages();
      setSelectedStage(null);
      setIsNew(false);
    } catch (err) {
      console.error("Error saving stage:", err);
      setError(err.response?.data?.message || "Failed to save stage");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/stages/${id}`);
      await fetchStages();
    } catch (err) {
      console.error("Error deleting stage:", err);
      setError(err.response?.data?.message || "Failed to delete stage");
    } finally {
      setLoading(false);
    }
  };

  if (loading && stages.length === 0) {
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
            Stages Management
          </span>
        </h2>
        <p className="text-white/70">
          Manage and organize stages for quit smoking plans
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Stage
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white/5 rounded-xl p-6 shadow-lg ring-1 ring-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-white/80 border-b border-white/10">
              <th className="py-3 px-4">Stage #</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">End Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr
                key={stage._id}
                className="hover:bg-white/10 transition duration-200 border-b border-white/10"
              >
                <td className="py-3 px-4">{stage.stage_number}</td>
                <td className="py-3 px-4">{stage.title}</td>
                <td className="py-3 px-4 max-w-xs truncate">{stage.description}</td>
                <td className="py-3 px-4">
                  {plans.find(p => p._id === stage.plan_id)?.name || stage.plan_id}
                </td>
                <td className="py-3 px-4">{new Date(stage.start_date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(stage.end_date).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      stage.is_completed
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {stage.is_completed ? "Completed" : "In Progress"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(stage)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setStageToDelete(stage._id);
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
      {selectedStage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Stage" : "Edit Stage"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <select
                  value={editedStage.plan_id}
                  onChange={(e) => setEditedStage({ ...editedStage, plan_id: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.plan_id ? 'border-2 border-red-500' : ''}`}
                >
                  <option value="">Select a plan</option>
                  {plans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                {errors.plan_id && <p className="text-red-500 text-sm mt-1">{errors.plan_id}</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={editedStage.title}
                  onChange={(e) => setEditedStage({ ...editedStage, title: e.target.value })}
                  placeholder="Stage Title"
                  className={`p-2 rounded text-black w-full ${errors.title ? 'border-2 border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  value={editedStage.description}
                  onChange={(e) => setEditedStage({ ...editedStage, description: e.target.value })}
                  placeholder="Stage Description"
                  className={`p-2 rounded text-black w-full ${errors.description ? 'border-2 border-red-500' : ''}`}
                  rows="3"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <input
                  type="number"
                  value={editedStage.stage_number}
                  onChange={(e) => setEditedStage({ ...editedStage, stage_number: e.target.value })}
                  placeholder="Stage Number"
                  className={`p-2 rounded text-black w-full ${errors.stage_number ? 'border-2 border-red-500' : ''}`}
                />
                {errors.stage_number && <p className="text-red-500 text-sm mt-1">{errors.stage_number}</p>}
              </div>

              <div>
                <input
                  type="date"
                  value={editedStage.start_date}
                  onChange={(e) => setEditedStage({ ...editedStage, start_date: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.start_date ? 'border-2 border-red-500' : ''}`}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <input
                  type="date"
                  value={editedStage.end_date}
                  onChange={(e) => setEditedStage({ ...editedStage, end_date: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.end_date ? 'border-2 border-red-500' : ''}`}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Status:</span>
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
                  {editedStage.is_completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedStage(null);
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
          message="Are you sure you want to delete this stage?"
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