import { useState, useEffect } from "react";
import api from "../api";

export function useQuitPlanData() {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchQuitPlans();
  }, []);


  const fetchQuitPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quitPlan");

      console.log("QuitPlan API response:", response.data);

      if (Array.isArray(response.data)) {
        setQuitPlans(response.data);
      } else if (Array.isArray(response.data.data)) {
        setQuitPlans(response.data.data);
      } else {
        setQuitPlans([]);
      }
    } catch (err) {
      console.error("Error fetching quit plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tạo kế hoạch bỏ thuốc
  const createQuitPlan = async (planData) => {
    try {
      setLoading(true);
      const response = await api.post("/quitPlan", planData);
      await fetchQuitPlans();
      return response.data;
    } catch (err) {
      setError(err.message || "Có lỗi khi tạo kế hoạch");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lấy kế hoạch theo ID
  const getQuitPlanById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/quitPlan/${id}`);
      console.log("Raw QuitPlan response:", response.data);

      const data = response.data?.data || response.data;
      if (!data) throw new Error("Không tìm thấy kế hoạch bỏ thuốc");

      const formattedPlan = {
        _id: data._id || id,
        name: data.name || "Kế hoạch không tên",
        reason: data.reason || "Không có lý do",
        start_date: data.start_date || data.createdAt || new Date().toISOString(),
        target_quit_date: data.target_quit_date || "",
        createdAt: data.createdAt || "",
        updatedAt: data.updatedAt || "",
        image: data.image || data.banner || "/placeholder-plan.png",
        user_id: data.user_id || null,
        status: data.status || "draft",
      };

      return formattedPlan;
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi tải kế hoạch");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách các giai đoạn (stages) theo kế hoạch
  const getStagesByPlanId = async (planId) => {
    try {
      const response = await api.get(`/stages/plan/${planId}`);
      console.log("Stages by Plan response:", response.data);

      return Array.isArray(response.data?.data) ? response.data.data : response.data;
    } catch (error) {
      console.error("Lỗi khi lấy stages của kế hoạch:", error);
      throw error;
    }
  };

  // Gửi yêu cầu kế hoạch đến coach 
  const sendQuitPlanRequest = async (data) => {
    try {
      const response = await api.post("/quitPlan/request", data);
      console.log("Yêu cầu đã gửi:", response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Không thể gửi yêu cầu kế hoạch");
      throw error;
    }
  };

  return {
    quitPlans,
    loading,
    error,
    fetchQuitPlans,
    getQuitPlanById,
    getStagesByPlanId,
    createQuitPlan,
    sendQuitPlanRequest, 
  };
}
