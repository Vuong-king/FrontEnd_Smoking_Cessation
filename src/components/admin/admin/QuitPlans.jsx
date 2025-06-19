import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

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
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/quitPlan');
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.response?.data?.message || "Failed to fetch quit plans");
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
        setDateError("End date must be after start date");
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
    console.log("Editing plan:", plan);
    setIsNew(false);
    setEditingPlan(plan);
    const user = users.find(u => u._id === plan.user_id);
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
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
    setFormData({ ...formData, user: userId });
  };

  const handleSave = async () => {
    const newErrors = {
      user: !formData.user ? "Please select a user" : "",
      reason: !formData.reason ? "Please enter a reason" : "",
      name: !formData.name ? "Please enter a name" : "",
      start_date: !formData.start_date ? "Please select a start date" : "",
      target_quit_date: !formData.target_quit_date ? "Please select a target date" : "",
    };

    if (!validateDates(formData.start_date, formData.target_quit_date)) {
      newErrors.target_quit_date = "End date must be after start date";
    }

    setErrors(newErrors);

    // Check if there are any errors
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
      console.error("Error saving plan:", err);
      setError(err.response?.data?.message || "Failed to save quit plan");
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
      console.error("Error deleting plan:", err);
      setError(err.response?.data?.message || "Failed to delete quit plan");
    } finally {
      setLoading(false);
    }
  };

  if (loading && plans.length === 0) {
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Quit Plans
          </span>
        </h2>
        <p className="text-white/70">Manage user's quit smoking plans.</p>
      </div>

      <div className="max-w-5xl mx-auto mb-6 text-right">
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
            <p className="text-sm text-white/70 mb-1">{plan.reason}</p>
            <p className="text-sm text-white/70 mb-1">
              Start: {new Date(plan.start_date).toLocaleDateString('vi-VN')} → Target: {new Date(plan.target_quit_date).toLocaleDateString('vi-VN')}
            </p>
            <p className="text-sm text-white/50 mb-4">
              User ID: {plan.user_id}
            </p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(plan)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => {
                  setPlanToDelete(plan._id);
                  setShowConfirm(true);
                }}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Quit Plan" : "Edit Quit Plan"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <select
                  value={formData.user || ""}
                  onChange={handleUserChange}
                  className={`p-2 rounded text-black w-full ${errors.user ? 'border-2 border-red-500' : ''}`}
                >
                  <option value="">Select user</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.user && <p className="text-red-500 text-sm mt-1">{errors.user}</p>}
                {selectedUser && (
                  <div className="mt-2 text-sm text-gray-300">
                    Selected: {selectedUser.name} ({selectedUser.email})
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`p-2 rounded text-black w-full ${errors.name ? 'border-2 border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className={`p-2 rounded text-black w-full ${errors.reason ? 'border-2 border-red-500' : ''}`}
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>

              <div>
                <input
                  type="date"
                  placeholder="Start Date"
                  value={formData.start_date}
                  onChange={(e) => handleDateChange('start_date', e.target.value)}
                  className={`p-2 rounded text-black w-full ${errors.start_date ? 'border-2 border-red-500' : ''}`}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <input
                  type="date"
                  placeholder="Target Quit Date"
                  value={formData.target_quit_date}
                  onChange={(e) => handleDateChange('target_quit_date', e.target.value)}
                  className={`p-2 rounded text-black w-full ${errors.target_quit_date ? 'border-2 border-red-500' : ''}`}
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
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || dateError}
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
          message="Are you sure you want to delete this quit plan?"
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
    </section>
  );
};

export default QuitPlans;
