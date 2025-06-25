import { useState, useCallback } from "react";
import {
  createQuitPlanAPI,
  fetchQuitPlansAPI,
  getMyQuitPlanRequestsAPI,
  getQuitPlanByIdAPI,
  getStagesByPlanIdAPI,
  sendQuitPlanRequestAPI,
  getPublicQuitPlansAPI,
} from "../services/quitPlanService";

export function useQuitPlanData() {
  const [quitPlans, setQuitPlans] = useState([]);
  const [publicQuitPlans, setPublicQuitPlans] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  Gọi tất cả kế hoạch của user
  const fetchQuitPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchQuitPlansAPI();

      if (Array.isArray(data)) {
        setQuitPlans(data);
      } else if (Array.isArray(data.data)) {
        setQuitPlans(data.data);
      } else {
        setQuitPlans([]);
      }
    } catch (err) {
      console.error("Error fetching quit plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //  Gọi tất cả kế hoạch công khai
  const fetchPublicQuitPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPublicQuitPlansAPI();

      if (Array.isArray(data)) {
        setPublicQuitPlans(data);
      } else if (Array.isArray(data.data)) {
        setPublicQuitPlans(data.data);
      } else {
        setPublicQuitPlans([]);
      }
    } catch (err) {
      console.error("Error fetching public quit plans:", err);
      setError(err.message || "Lỗi khi tải kế hoạch công khai");
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuitPlan = useCallback(async (planData) => {
    try {
      setLoading(true);
      const created = await createQuitPlanAPI(planData);
      await fetchQuitPlans();
      return created;
    } catch (err) {
      setError(err.message || "Có lỗi khi tạo kế hoạch");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchQuitPlans]);

  const getQuitPlanById = useCallback(async (id) => {
    try {
      setLoading(true);
      const raw = await getQuitPlanByIdAPI(id);
      const data = raw?.data || raw;

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
  }, []);

  const getStagesByPlanId = useCallback(async (planId) => {
    try {
      const result = await getStagesByPlanIdAPI(planId);
      return Array.isArray(result?.data) ? result.data : result;
    } catch (error) {
      console.error("Lỗi khi lấy stages của kế hoạch:", error);
      throw error;
    }
  }, []);

  const sendQuitPlanRequest = useCallback(async (data) => {
    try {
      return await sendQuitPlanRequestAPI(data);
    } catch (error) {
      setError(error.response?.data?.message || "Không thể gửi yêu cầu kế hoạch");
      throw error;
    }
  }, []);

  const getMyQuitPlanRequests = useCallback(async () => {
    try {
      const result = await getMyQuitPlanRequestsAPI();
      return Array.isArray(result?.data) ? result.data : result;
    } catch (error) {
      console.error("Không thể lấy danh sách yêu cầu của tôi:", error);
      throw error;
    }
  }, []);

  return {
    // State
    quitPlans,
    publicQuitPlans,
    loading,
    error,
    // API functions
    fetchQuitPlans,
    fetchPublicQuitPlans,
    getQuitPlanById,
    getStagesByPlanId,
    createQuitPlan,
    sendQuitPlanRequest,
    getMyQuitPlanRequests,
  };
}
