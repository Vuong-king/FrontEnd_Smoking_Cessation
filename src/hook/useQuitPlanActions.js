import { useState, useCallback } from "react";

import { message } from "antd";
import QuitPlanService from "../services/quitPlanService";

const useQuitPlanActions = () => {
  const [quitPlan, setQuitPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy kế hoạch cai thuốc theo userId
  const fetchQuitPlanByUserId = useCallback(async (userId) => {
    setLoading(true);
    try {
      const data = await QuitPlanService.getQuitPlanByUserId(userId);
      setQuitPlan(data);
      setError(null);
    } catch (err) {
      setError(err);
      message.error("Không thể lấy kế hoạch cai thuốc.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Áp dụng kế hoạch public
  const adoptPlan = useCallback(async (planId, userData) => {
    setLoading(true);
    try {
      const result = await QuitPlanService.adoptPublicQuitPlan(planId, userData);
      message.success("Đã áp dụng kế hoạch thành công!");
      return result;
    } catch (err) {
      setError(err);
      message.error("Không thể áp dụng kế hoạch.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    quitPlan,
    loading,
    error,
    fetchQuitPlanByUserId,
    adoptPlan,
  };
};

export default useQuitPlanActions;
