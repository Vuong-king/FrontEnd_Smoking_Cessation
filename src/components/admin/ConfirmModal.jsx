import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export function ConfirmModal({ message, onConfirm, onCancel }) {
  // 3️⃣ ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="animate-scaleIn bg-gradient-to-br from-white via-slate-100 to-gray-200 text-gray-900 p-6 rounded-xl shadow-2xl max-w-md w-full transition duration-300 ease-in-out"
      >
        {/* 1️⃣ Alert icon */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-rose-500 w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold mb-2 text-center">Confirm Action</h3>
        <p className="text-sm text-center mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
