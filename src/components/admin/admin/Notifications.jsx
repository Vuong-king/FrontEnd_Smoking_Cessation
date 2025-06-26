import React, { useState, useEffect } from "react";
import { Plus, Trash, Pencil, Calendar, Clock } from "lucide-react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import useNotifications from "../../../hook/useNotifications";
import api from "../../api";

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    createNotification,
    updateNotification,
    deleteNotification,
  } = useNotifications();

  const [progresses, setProgresses] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [editedNotification, setEditedNotification] = useState({
    progress_id: "",
    message: "",
    type: "daily",
    schedule: "",
    is_sent: false
  });
  const [errors, setErrors] = useState({
    progress_id: "",
    message: "",
    type: "",
    schedule: "",
    is_sent: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    fetchProgresses();
  }, []);

  const fetchProgresses = async () => {
    try {
      const response = await api.get('/progress');
      setProgresses(response.data);
    } catch {
      setProgresses([]);
    }
  };

  const openEditModal = (notification) => {
    setSelectedNotification(notification);
    setIsNew(false);
    setEditedNotification({
      progress_id: notification.progress_id,
      message: notification.message,
      type: notification.type,
      schedule: notification.schedule,
      is_sent: notification.is_sent
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedNotification({
      progress_id: "",
      message: "",
      type: "daily",
      schedule: "",
      is_sent: false
    });
    setSelectedNotification({});
  };

  const handleSaveChanges = async () => {
    const newErrors = {
      progress_id: !editedNotification.progress_id ? "Please select a progress" : "",
      message: !editedNotification.message ? "Please enter a message" : "",
      type: !editedNotification.type ? "Please select a type" : "",
      schedule: !editedNotification.schedule ? "Please enter a schedule" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }
    if (isNew) {
      await createNotification(editedNotification);
    } else {
      await updateNotification(selectedNotification._id, editedNotification);
    }
    setSelectedNotification(null);
    setIsNew(false);
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
  };

  if (loading && notifications.length === 0) {
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
            Notifications Management
          </span>
        </h2>
        <p className="text-white/70">
          Manage and schedule notifications for users
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Notification
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white/5 rounded-xl p-6 shadow-lg ring-1 ring-white/10 overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-white/80 border-b border-white/10">
              <th className="py-3 px-4">Message</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Schedule</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification._id}
                className="hover:bg-white/10 transition duration-200 border-b border-white/10"
              >
                <td className="py-3 px-4">{notification.message}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    notification.type === 'daily' 
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {notification.type}
                  </span>
                </td>
                <td className="py-3 px-4">{notification.schedule}</td>
                <td className="py-3 px-4">
                  {progresses.find(p => p._id === notification.progress_id)?.stage_id || notification.progress_id}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    notification.is_sent 
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}>
                    {notification.is_sent ? "Sent" : "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(notification)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setNotificationToDelete(notification._id);
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
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Notification" : "Edit Notification"}
            </h3>

            <div className="grid gap-3 mb-6">
              <div>
                <select
                  value={editedNotification.progress_id}
                  onChange={(e) => setEditedNotification({ ...editedNotification, progress_id: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.progress_id ? 'border-2 border-red-500' : ''}`}
                >
                  <option value="">Select a progress</option>
                  {progresses.map(progress => (
                    <option key={progress._id} value={progress._id}>
                      Stage {progress.stage_id} - {new Date(progress.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {errors.progress_id && <p className="text-red-500 text-sm mt-1">{errors.progress_id}</p>}
              </div>

              <div>
                <textarea
                  value={editedNotification.message}
                  onChange={(e) => setEditedNotification({ ...editedNotification, message: e.target.value })}
                  placeholder="Notification Message"
                  className={`p-2 rounded text-black w-full ${errors.message ? 'border-2 border-red-500' : ''}`}
                  rows="3"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <div>
                <select
                  value={editedNotification.type}
                  onChange={(e) => setEditedNotification({ ...editedNotification, type: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.type ? 'border-2 border-red-500' : ''}`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="motivation">Motivation</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <input
                  type="datetime-local"
                  value={editedNotification.schedule}
                  onChange={(e) => setEditedNotification({ ...editedNotification, schedule: e.target.value })}
                  className={`p-2 rounded text-black w-full ${errors.schedule ? 'border-2 border-red-500' : ''}`}
                />
                {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={editedNotification.is_sent}
                    onChange={(e) => setEditedNotification({ ...editedNotification, is_sent: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  Mark as sent
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedNotification(null);
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
          message="Are you sure you want to delete this notification?"
          onCancel={() => {
            setShowConfirm(false);
            setNotificationToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(notificationToDelete);
            setShowConfirm(false);
            setNotificationToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default Notifications;
