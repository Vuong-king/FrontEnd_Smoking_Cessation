import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";

const QuitPlans = () => {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    targetDate: "",
    stages: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("quitPlans");
    if (saved) setPlans(JSON.parse(saved));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingPlan({});
    setFormData({ reason: "", startDate: "", targetDate: "", stages: "" });
  };

  const handleEdit = (plan) => {
    setIsNew(false);
    setEditingPlan(plan);
    setFormData(plan);
  };

  const handleSave = () => {
    if (!formData.reason || !formData.startDate || !formData.targetDate) return;

    setPlans((prev) => {
      const updated = isNew
        ? [...prev, { ...formData, id: Date.now() }]
        : prev.map((p) =>
            p.id === editingPlan.id ? { ...formData, id: p.id } : p
          );
      localStorage.setItem("quitPlans", JSON.stringify(updated));
      return updated;
    });

    showToast(isNew ? "Plan created." : "Plan updated.");
    setEditingPlan(null);
    setIsNew(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        localStorage.setItem("quitPlans", JSON.stringify(updated));
        return updated;
      });
      showToast("Plan deleted.", "error");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300 ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

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
            key={plan.id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            <h3 className="text-lg font-semibold mb-1">{plan.reason}</h3>
            <p className="text-sm text-white/70 mb-1">
              Start: {plan.startDate} → Target: {plan.targetDate}
            </p>
            <p className="text-sm text-white/50 mb-4">
              Stages: {plan.stages || "N/A"}
            </p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(plan)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
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
              <input
                type="text"
                placeholder="Reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <input
                type="date"
                placeholder="Target Date"
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData({ ...formData, targetDate: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <textarea
                placeholder="Stages"
                value={formData.stages}
                onChange={(e) =>
                  setFormData({ ...formData, stages: e.target.value })
                }
                className="p-2 rounded text-black"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setIsNew(false);
                }}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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

export default QuitPlans;
