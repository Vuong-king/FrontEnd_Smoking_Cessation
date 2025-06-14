import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Shield,
  Trophy,
  Gem,
} from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBadge, setEditingBadge] = useState(null);
  const [newData, setNewData] = useState({ 
    name: "", 
    condition: "", 
    tier: "Bronze", 
    point_value: 0,
    url_image: "" 
  });
  const [errors, setErrors] = useState({
    name: "",
    condition: "",
    tier: "",
    point_value: "",
    url_image: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/badges');
      setBadges(response.data);
    } catch (err) {
      console.error("Error fetching badges:", err);
      setError(err.response?.data?.message || "Failed to fetch badges");
    } finally {
      setLoading(false);
    }
  };

  const iconByLevel = {
    Bronze: <Shield className="w-6 h-6 text-amber-700" />,
    Silver: <Trophy className="w-6 h-6 text-slate-300" />,
    Gold: <Gem className="w-6 h-6 text-yellow-400" />,
  };

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setNewData({
      name: badge.name,
      condition: badge.condition,
      tier: badge.tier,
      point_value: badge.point_value,
      url_image: badge.url_image
    });
    setIsNew(false);
  };

  const handleSave = async () => {
    const newErrors = {
      name: !newData.name ? "Please enter a badge name" : "",
      condition: !newData.condition ? "Please enter a condition" : "",
      tier: !newData.tier ? "Please select a tier" : "",
      point_value: !newData.point_value && newData.point_value !== 0 ? "Please enter point value" : 
                  newData.point_value < 0 ? "Point value cannot be negative" : "",
      url_image: ""
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.post('/badges/create', newData);
      } else {
        await api.put(`/badges/${editingBadge._id}`, newData);
      }
      await fetchBadges();
      setEditingBadge(null);
      setIsNew(false);
    } catch (err) {
      console.error("Error saving badge:", err);
      setError(err.response?.data?.message || "Failed to save badge");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/badges/${id}`);
      await fetchBadges();
    } catch (err) {
      console.error("Error deleting badge:", err);
      setError(err.response?.data?.message || "Failed to delete badge");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setNewData({ 
      name: "", 
      condition: "", 
      tier: "Bronze", 
      point_value: 0,
      url_image: "" 
    });
    setErrors({
      name: "",
      condition: "",
      tier: "",
      point_value: "",
      url_image: ""
    });
    setEditingBadge({});
    setIsNew(true);
  };

  if (loading && badges.length === 0) {
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
            Badges
          </span>
        </h2>
        <p className="text-white/70">
          Review the list of achievements and their requirements.
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-6 text-right">
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Badge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {badges.map((badge) => (
          <div
            key={badge._id}
            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            <div className="flex items-center justify-center mb-4">
              {badge.url_image ? (
                <img 
                  src={badge.url_image} 
                  alt={badge.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                iconByLevel[badge.tier]
              )}
            </div>

            <h3 className="text-lg font-semibold mb-1 text-center">{badge.name}</h3>
            <p className="text-sm text-white/70 mb-2 text-center">{badge.condition}</p>
            <p className="text-xs text-white/50 text-center mb-2">Level: {badge.tier}</p>
            <p className="text-xs text-white/50 text-center mb-4">Points: {badge.point_value}</p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(badge)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => {
                  setBadgeToDelete(badge._id);
                  setShowConfirm(true);
                }}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Badge" : "Edit Badge"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={newData.name}
                  onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.name ? 'border-2 border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Condition"
                  value={newData.condition}
                  onChange={(e) => setNewData({ ...newData, condition: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.condition ? 'border-2 border-red-500' : ''}`}
                />
                {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Point Value"
                  value={newData.point_value}
                  onChange={(e) => setNewData({ ...newData, point_value: parseInt(e.target.value) })}
                  className={`p-2 rounded text-black w-full ${errors.point_value ? 'border-2 border-red-500' : ''}`}
                />
                {errors.point_value && <p className="text-red-500 text-sm mt-1">{errors.point_value}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newData.url_image}
                  onChange={(e) => setNewData({ ...newData, url_image: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.url_image ? 'border-2 border-red-500' : ''}`}
                />
                {errors.url_image && <p className="text-red-500 text-sm mt-1">{errors.url_image}</p>}
              </div>

              <div>
                <select
                  value={newData.tier}
                  onChange={(e) => setNewData({ ...newData, tier: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.tier ? 'border-2 border-red-500' : ''}`}
                >
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                </select>
                {errors.tier && <p className="text-red-500 text-sm mt-1">{errors.tier}</p>}
              </div>
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
          message="Are you sure you want to delete this badge?"
          onCancel={() => {
            setShowConfirm(false);
            setBadgeToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(badgeToDelete);
            setShowConfirm(false);
            setBadgeToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Badges;
