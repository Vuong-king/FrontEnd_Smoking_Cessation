import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [editingCoach, setEditingCoach] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("coaches");
    if (saved) setCoaches(JSON.parse(saved));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingCoach({});
    setFormData({ name: "", email: "", bio: "" });
  };

  const handleEdit = (coach) => {
    setIsNew(false);
    setEditingCoach(coach);
    setFormData(coach);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    setCoaches((prev) => {
      const updated = isNew
        ? [...prev, { ...formData, id: Date.now() }]
        : prev.map((c) =>
            c.id === editingCoach.id ? { ...formData, id: c.id } : c
          );
      localStorage.setItem("coaches", JSON.stringify(updated));
      return updated;
    });

    showToast(isNew ? "Coach added." : "Coach updated.");
    setEditingCoach(null);
    setIsNew(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      setCoaches((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        localStorage.setItem("coaches", JSON.stringify(updated));
        return updated;
      });
      showToast("Coach deleted.", "error");
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
            Coaches
          </span>
        </h2>
        <p className="text-white/70">Manage and assign coaches to support users.</p>
      </div>

      <div className="max-w-5xl mx-auto mb-6 text-right">
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Coach
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            <h3 className="text-lg font-semibold mb-1">{coach.name}</h3>
            <p className="text-sm text-white/70 mb-1">{coach.email}</p>
            <p className="text-sm text-white/50 mb-4">{coach.bio}</p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(coach)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(coach.id)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingCoach && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Coach" : "Edit Coach"}
            </h3>

            <div className="grid gap-3 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="p-2 rounded text-black"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingCoach(null);
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

export default Coaches;
