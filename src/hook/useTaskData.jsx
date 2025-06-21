import { useState } from "react";
import api from "../api";

export function useTaskData() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");

      const taskList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setTasks(taskList);
    } catch (err) {
      console.error("Lỗi khi lấy tất cả tasks:", err);
      setError(err.message || "Lỗi không xác định khi gọi tasks");
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStageId = (stageId) => {
    return tasks.filter((task) => task.stage_id === stageId);
  };

  const fetchTasksByStageId = async (stageId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get(`/tasks/stage/${stageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const taskList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      return taskList;
    } catch (err) {
      console.error("Lỗi khi fetch task theo stage:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchAllTasks,
    getTasksByStageId,
    fetchTasksByStageId,
  };
}
