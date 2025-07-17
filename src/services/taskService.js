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
export const fetchTaskByIdAPI = (taskId) => api.get(`/tasks/${taskId}`);

export const createTaskAPI = (taskData) => api.post("/tasks", taskData);

export const updateTaskAPI = (taskId, taskData) =>
  api.put(`/tasks/${taskId}`, taskData);

export const deleteTaskAPI = (taskId) => api.delete(`/tasks/${taskId}`);

export const completeTaskAPI = (taskId) => api.post(`/tasks/${taskId}/complete`);