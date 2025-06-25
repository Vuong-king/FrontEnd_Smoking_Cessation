import React, { useState } from "react";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { Dialog } from "@headlessui/react";

const mockRequests = [
  {
    _id: "1",
    user: { name: "Nguyễn Văn A" },
    createdAt: "2025-06-20",
    status: "pending",
    coach: null,
  },
  {
    _id: "2",
    user: { name: "Trần Thị B" },
    createdAt: "2025-06-21",
    status: "accepted",
    coach: null,
  },
  {
    _id: "3",
    user: { name: "Lê Văn C" },
    createdAt: "2025-06-22",
    status: "planned",
    coach: { name: "Coach Dũng" },
  },
  {
    _id: "4",
    user: { name: "Phạm Thị D" },
    createdAt: "2025-06-22",
    status: "confirmed",
    coach: { name: "Coach Linh" },
  },
];

const mockCoaches = [
  { _id: "coach1", name: "Coach Dũng" },
  { _id: "coach2", name: "Coach Linh" },
  { _id: "coach3", name: "Coach Hoa" },
];

const Request = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionRequest, setActionRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [selectedCoach, setSelectedCoach] = useState({});

  const handleAction = () => {
    if (!actionRequest || !actionType) return;
    let updated = [...requests];

    if (actionType === "accept") {
      updated = updated.map((r) =>
        r._id === actionRequest._id ? { ...r, status: "accepted" } : r
      );
    } else if (actionType === "assign") {
      const coach = mockCoaches.find((c) => c._id === actionRequest.coachId);
      updated = updated.map((r) =>
        r._id === actionRequest._id ? { ...r, status: "planned", coach } : r
      );
    } else if (actionType === "confirm") {
      updated = updated.map((r) =>
        r._id === actionRequest._id ? { ...r, status: "confirmed" } : r
      );
    } else if (actionType === "complete") {
      updated = updated.map((r) =>
        r._id === actionRequest._id ? { ...r, status: "done" } : r
      );
    }

    setRequests(updated);
    setShowConfirm(false);
    setActionRequest(null);
    setActionType("");
  };

  return (
    <section className="min-h-screen px-8 py-16 bg-gradient-to-br from-[#6b21a8] via-[#9333ea] to-[#06b6d4] text-white">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2">
          Quản lý Request từ người dùng
        </h2>
        <p className="text-white/80 text-base">
          Xử lý các yêu cầu cai thuốc gửi từ người dùng theo từng bước cụ thể.
        </p>
      </div>

      {/* Tổng quan */}
      <div className="mb-6 text-right">
        <div className="inline-block bg-gradient-to-r from-pink-500 to-pink-400 px-4 py-2 rounded-full shadow-md text-white font-semibold text-sm">
          Tổng yêu cầu: {requests.length}
        </div>
      </div>

      {/* Bảng glassmorphic */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]">
        <table className="w-full table-auto text-sm text-white">
          <thead className="bg-white/10 text-white/80 uppercase text-xs rounded-t-xl">
            <tr>
              <th className="px-6 py-4 text-left">Người dùng</th>
              <th className="px-6 py-4 text-left">Ngày gửi</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-left">Coach</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-t border-white/10 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-medium">{r.user?.name || "-"}</td>
                <td className="px-6 py-4">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full
                        ${r.status === "pending" && "bg-yellow-300"}
                        ${r.status === "accepted" && "bg-blue-300"}
                        ${r.status === "planned" && "bg-purple-300"}
                        ${r.status === "confirmed" && "bg-indigo-300"}
                        ${r.status === "done" && "bg-green-300"}
                      `}
                    ></span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${r.status === "pending" && "bg-yellow-100 text-yellow-900"}
                        ${r.status === "accepted" && "bg-blue-100 text-blue-900"}
                        ${r.status === "planned" && "bg-purple-100 text-purple-900"}
                        ${r.status === "confirmed" && "bg-indigo-100 text-indigo-900"}
                        ${r.status === "done" && "bg-green-100 text-green-900"}
                      `}
                    >
                      {r.status}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  {r.status === "accepted" ? (
                    <select
                      className="bg-white/20 text-white border border-white/30 text-sm rounded-lg px-3 py-1 focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                      value={selectedCoach[r._id] || ""}
                      onChange={(e) =>
                        setSelectedCoach({
                          ...selectedCoach,
                          [r._id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Chọn Coach</option>
                      {mockCoaches.map((c) => (
                        <option key={c._id} value={c._id} className="text-black">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-white">{r.coach?.name || "-"}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {r.status === "pending" && (
                    <button
                      onClick={() => {
                        setActionRequest(r);
                        setActionType("accept");
                        setShowConfirm(true);
                      }}
                      className="px-4 py-1 rounded-full text-sm text-white bg-green-500 hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                  )}
                  {r.status === "accepted" && (
                    <button
                      onClick={() => {
                        setActionRequest({
                          ...r,
                          coachId: selectedCoach[r._id],
                        });
                        setActionType("assign");
                        setShowConfirm(true);
                      }}
                      disabled={!selectedCoach[r._id]}
                      className="px-4 py-1 rounded-full text-sm text-white bg-yellow-400 hover:bg-yellow-500 transition disabled:opacity-40"
                    >
                      Gán Coach
                    </button>
                  )}
                  {r.status === "planned" && (
                    <button
                      onClick={() => {
                        setActionRequest(r);
                        setActionType("confirm");
                        setShowConfirm(true);
                      }}
                      className="px-4 py-1 rounded-full text-sm text-white bg-gradient-to-r from-sky-500 to-blue-500 hover:opacity-90"
                    >
                      Xác nhận QuitPlan
                    </button>
                  )}
                  {r.status === "confirmed" && (
                    <button
                      onClick={() => {
                        setActionRequest(r);
                        setActionType("complete");
                        setShowConfirm(true);
                      }}
                      className="px-4 py-1 rounded-full text-sm text-white bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:opacity-90"
                    >
                      Hoàn tất
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-white/60">
                  Không có yêu cầu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận */}
      {showConfirm && (
        <ConfirmModal
          message="Bạn có chắc muốn thực hiện thao tác này?"
          onCancel={() => {
            setShowConfirm(false);
            setActionRequest(null);
            setActionType("");
          }}
          onConfirm={handleAction}
        />
      )}
    </section>
  );
};

export default Request;
