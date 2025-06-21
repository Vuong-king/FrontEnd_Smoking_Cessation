import { CheckCircle2, Circle } from "lucide-react";

export const TaskItem = ({ task, onToggle }) => {
  const isDone = task.is_done;
  const priority = task.priority; // 'high', 'medium', 'low'

  const getPriorityLabel = () => {
    switch (priority) {
      case 'high':
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Quan trọng</span>;
      case 'medium':
        return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">Trung bình</span>;
      case 'low':
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">Thấp</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${
        isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        {isDone ? (
          <CheckCircle2 className="text-green-500" size={24} />
        ) : (
          <Circle className="text-gray-400" size={24} />
        )}
        <span
          className={`text-base ${
            isDone ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {task.title}
        </span>
      </div>
      {task.priority && getPriorityLabel()}
    </div>
  );
};
