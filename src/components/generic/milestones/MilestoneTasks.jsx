import { useEffect, useState } from "react";
import { ClipboardList } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { TaskStatistics } from './TaskStatistics';
import { useTaskData } from "../../../hook/useTaskData";

export const MilestoneTasks = ({ milestone }) => {
  const { fetchTasksByStageId } = useTaskData();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const res = await fetchTasksByStageId(milestone._id);
        setTasks(res);
      } catch (err) {
        console.error("Lỗi khi load tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (milestone) loadTasks();
  }, [milestone]);

  const handleToggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId ? { ...task, is_done: !task.is_done } : task
      )
    );
  };

  return (
    <div className="border-t border-gray-200 p-6 bg-gray-50">
      <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
        <ClipboardList className="text-blue-500" size={20} />
        Danh sách công việc cần làm
      </h4>

      {loading ? (
        <p>Đang tải công việc...</p>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={() => handleToggleTask(task._id)}
              />
            ))}
          </div>
          <TaskStatistics tasks={tasks} />
        </>
      )}
    </div>
  );
};
