import { useState } from "react";
import {
  fetchAllTasksAPI,
  fetchTasksByStageIdAPI,
} from "../services/taskService";
// Thêm các hàm API thao tác task
import {
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from "../services/taskService";

export function useTaskData() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTasksAPI();

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
      const response = await fetchTasksByStageIdAPI(stageId);

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

  // Thêm các hàm thao tác task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await createTaskAPI(taskData);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message || "Lỗi khi tạo task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await updateTaskAPI(taskId, taskData);
      setTasks((prev) => prev.map((task) => (task._id === taskId ? updatedTask : task)));
      return updatedTask;
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTaskAPI(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.message || "Lỗi khi xóa task");
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
    createTask, // thêm
    updateTask, // thêm
    deleteTask, // thêm
  };
}
