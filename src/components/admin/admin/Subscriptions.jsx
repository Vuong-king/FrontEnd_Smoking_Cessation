import React, { useState, useEffect } from "react";
import { BadgeCheck, XCircle, Pencil, Plus, Trash } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [editedSub, setEditedSub] = useState({
    name: "",
    price: "",
    start_date: "",
    end_date: "",
    is_active: true,
    plan_id: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    start_date: "",
    end_date: "",
    plan_id: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
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

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(err.response?.data?.message || "Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (sub) => {
    setSelectedSub(sub);
    setIsNew(false);
    setEditedSub({
      name: sub.name,
      price: sub.price,
      start_date: sub.start_date ? new Date(sub.start_date).toISOString().split('T')[0] : "",
      end_date: sub.end_date ? new Date(sub.end_date).toISOString().split('T')[0] : "",
      is_active: sub.is_active,
      plan_id: sub.plan_id
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedSub({
      name: "",
      price: "",
      start_date: "",
      end_date: "",
      is_active: true,
      plan_id: ""
    });
    setSelectedSub({});
  };

  const handleSaveChanges = async () => {
    const newErrors = {
      name: !editedSub.name ? "Please enter a subscription name" : "",
      price: !editedSub.price ? "Please enter a price" : "",
      start_date: !editedSub.start_date ? "Please select a start date" : "",
      end_date: !editedSub.end_date ? "Please select an end date" : "",
      plan_id: !editedSub.plan_id ? "Please select a plan" : ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        const { plan_id, ...subscriptionData } = editedSub;
        await api.post(`/subscriptions/${plan_id}`, subscriptionData);
      } else {
        await api.put(`/subscriptions/${selectedSub._id}`, editedSub);
      }
      await fetchSubscriptions();
      setSelectedSub(null);
      setIsNew(false);
    } catch (err) {
      console.error("Error saving subscription:", err);
      setError(err.response?.data?.message || "Failed to save subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/subscriptions/${id}`);
      await fetchSubscriptions();
    } catch (err) {
      console.error("Error deleting subscription:", err);
      setError(err.response?.data?.message || "Failed to delete subscription");
    } finally {
      setLoading(false);
    }
  };

  if (loading && subscriptions.length === 0) {
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
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">End Date</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-white/10 transition duration-200 border-b border-white/10"
              >
                <td className="py-3 px-4">
                  <span>{sub.name}</span>
                </td>
                <td className="py-3 px-4">{sub.price}</td>
                <td className="py-3 px-4">{new Date(sub.start_date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(sub.end_date).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  {plans.find(p => p._id === sub.plan_id)?.name || sub.plan_id}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      sub.is_active
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {sub.is_active ? "Active" : "Inactive"}
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
                    onClick={() => {
                      setSubToDelete(sub._id);
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
      {selectedSub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Subscription" : "Edit Subscription"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <select
                  value={editedSub.plan_id}
                  onChange={(e) => setEditedSub({ ...editedSub, plan_id: e.target.value })}
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
                  value={editedSub.name}
                  onChange={(e) => setEditedSub({ ...editedSub, name: e.target.value })}
                  placeholder="Subscription Name"
                  className={`p-2 rounded text-black w-full ${errors.name ? 'border-2 border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={editedSub.price}
                  onChange={(e) => setEditedSub({ ...editedSub, price: e.target.value })}
                  placeholder="Price"
                  className={`p-2 rounded text-black w-full ${errors.price ? 'border-2 border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <input
                  type="date"
                  value={editedSub.start_date}
                  onChange={(e) => setEditedSub({ ...editedSub, start_date: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.start_date ? 'border-2 border-red-500' : ''}`}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <input
                  type="date"
                  value={editedSub.end_date}
                  onChange={(e) => setEditedSub({ ...editedSub, end_date: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.end_date ? 'border-2 border-red-500' : ''}`}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Status:</span>
                <button
                  onClick={() =>
                    setEditedSub({
                      ...editedSub,
                      is_active: !editedSub.is_active,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    editedSub.is_active
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {editedSub.is_active ? "Deactivate" : "Activate"}
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
          message="Are you sure you want to delete this subscription?"
          onCancel={() => {
            setShowConfirm(false);
            setSubToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(subToDelete);
            setShowConfirm(false);
            setSubToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Subscriptions;
