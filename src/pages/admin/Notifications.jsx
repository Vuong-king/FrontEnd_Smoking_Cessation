import React, { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addMessage = () => {
    if (!message.trim()) return;
    const newItem = { id: Date.now(), text: message };
    const updated = [...notifications, newItem];
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setMessage("");
    showToast("Notification added");
  };

  const deleteMessage = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
    showToast("Deleted", "error");
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {toast && (
        <div className={`fixed top-6 right-6 px-4 py-2 rounded z-50 ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
          {toast.message}
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Motivational Messages</h2>
        <p className="text-white/60">Manage daily and weekly reminder messages</p>
      </div>

      <div className="max-w-xl mx-auto mb-6 flex gap-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message..."
          className="flex-1 p-2 rounded text-black"
        />
        <button onClick={addMessage} className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-sm">
          <Plus className="w-4 h-4 inline-block" /> Add
        </button>
      </div>

      <ul className="max-w-xl mx-auto space-y-3">
        {notifications.map((n) => (
          <li key={n.id} className="flex justify-between items-center bg-white/5 p-4 rounded">
            <span>{n.text}</span>
            <button onClick={() => deleteMessage(n.id)} className="text-red-400 hover:text-red-600">
              <Trash className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notifications;
