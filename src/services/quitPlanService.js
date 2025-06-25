// services/quitPlanService.js
import api from "../api";

export const fetchQuitPlansAPI = async () => {
  const response = await api.get("/quitPlan");
  return response.data;
};

export const createQuitPlanAPI = async (planData) => {
  const response = await api.post("/quitPlan", planData);
  return response.data;
};

export const getQuitPlanByIdAPI = async (id) => {
  const response = await api.get(`/quitPlan/${id}`);
  return response.data;
};

export const getStagesByPlanIdAPI = async (planId) => {
  const response = await api.get(`/stages/plan/${planId}`);
  return response.data;
};

export const sendQuitPlanRequestAPI = async (data) => {
  const response = await api.post("/quitPlan/request", data);
  return response.data;
};

export const getMyQuitPlanRequestsAPI = async () => {
  const response = await api.get("/quitPlan/request/mine");
  return response.data;
};
