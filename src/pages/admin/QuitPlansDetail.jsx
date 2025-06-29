import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const QuitPlanDetailPageAdmin = () => {
  const navigate = useNavigate();
  const { plan } = useLocation().state || {};

  if (!plan) {
    return (
      <div className="text-center text-white mt-20">
        <h2 className="text-2xl font-bold">Không tìm thấy kế hoạch</h2>
        <button
          onClick={() => navigate("/admin/quit-plans")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded text-white"
        >
          Quay lại danh sách Kế Hoạch
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 text-gray-800 max-w-2xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/quit-plans")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-2 rounded transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách Kế Hoạch
      </button>

      <h1 className="text-3xl font-bold mb-4">{plan.name}</h1>
      <p className="mb-2 text-gray-600">Lý do: {plan.reason}</p>
      <p className="mb-2 text-gray-600">
        Người dùng: {typeof plan.user_id === 'object' && plan.user_id !== null
          ? `${plan.user_id.name} (${plan.user_id.email})`
          : plan.user_id}
      </p>
      <p className="mb-2 text-gray-600">
        Ngày bắt đầu: {plan.start_date ? new Date(plan.start_date).toLocaleDateString('vi-VN') : ''}
      </p>
      <p className="mb-2 text-gray-600">
        Ngày mục tiêu: {plan.target_quit_date ? new Date(plan.target_quit_date).toLocaleDateString('vi-VN') : ''}
      </p>
      {/* Add more fields if needed */}
    </div>
  );
};

export default QuitPlanDetailPageAdmin;
