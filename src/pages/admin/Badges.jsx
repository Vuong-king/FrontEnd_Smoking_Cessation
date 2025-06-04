import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Shield,
  Trophy,
  Gem,
} from "lucide-react";

const Badges = () => {
  const [badges, setBadges] = useState([
    { id: 1, name: "First Step", description: "Completed first quit plan", level: "Bronze" },
    { id: 2, name: "Streak Master", description: "7 days smoke-free", level: "Silver" },
    { id: 3, name: "Champion", description: "30 days smoke-free", level: "Gold" },
  ]);

  const [editingBadge, setEditingBadge] = useState(null);
  const [newData, setNewData] = useState({ name: "", description: "", level: "Bronze" });
  const [isNew, setIsNew] = useState(false);

  const iconByLevel = {
    Bronze: <Shield className="w-6 h-6 text-amber-700" />,
    Silver: <Trophy className="w-6 h-6 text-slate-300" />,
    Gold: <Gem className="w-6 h-6 text-yellow-400" />,
  };

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setNewData(badge);
    setIsNew(false);
  };

  const handleSave = () => {
    if (!newData.name || !newData.description) return;

    if (isNew) {
      const newBadge = {
        id: Date.now(),
        ...newData,
      };
      setBadges((prev) => [...prev, newBadge]);
    } else {
      setBadges((prev) =>
        prev.map((b) => (b.id === editingBadge.id ? { ...newData, id: b.id } : b))
      );
    }

    setEditingBadge(null);
    setIsNew(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this badge?")) {
      setBadges((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleNew = () => {
    setNewData({ name: "", description: "", level: "Bronze" });
    setEditingBadge({});
    setIsNew(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Badges
          </span>
        </h2>
        <p className="text-white/70">
          Review the list of achievements and their requirements.
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-5xl mx-auto mb-6 text-right">
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Badge
        </button>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            <div className="flex items-center justify-center mb-4">
              {iconByLevel[badge.level]}
            </div>

            <h3 className="text-lg font-semibold mb-1 text-center">{badge.name}</h3>
            <p className="text-sm text-white/70 mb-2 text-center">{badge.description}</p>
            <p className="text-xs text-white/50 text-center mb-4">Level: {badge.level}</p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(badge)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(badge.id)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Badge" : "Edit Badge"}
            </h3>

            <div className="grid gap-3 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={newData.name}
                onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                className="p-2 rounded text-black"
              />
              <input
                type="text"
                placeholder="Description"
                value={newData.description}
                onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                className="p-2 rounded text-black"
              />
              <select
                value={newData.level}
                onChange={(e) => setNewData({ ...newData, level: e.target.value })}
                className="p-2 rounded text-black"
              >
                <option>Bronze</option>
                <option>Silver</option>
                <option>Gold</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingBadge(null);
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

export default Badges;
