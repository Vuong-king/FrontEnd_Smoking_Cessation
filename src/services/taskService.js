// services/taskService.js
import api from "../api";

// Lấy tất cả task
export const fetchAllTasksAPI = () => api.get("/tasks");

// Lấy task theo stageId (có token)
export const fetchTasksByStageIdAPI = (stageId) => {
  const token = localStorage.getItem("token");

  return api.get(`/tasks/stage/${stageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
