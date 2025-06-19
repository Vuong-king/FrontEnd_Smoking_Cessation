import { CheckCircle, Circle } from 'lucide-react';

export const TaskItem = ({ task, onToggle }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
      <button onClick={onToggle} className="flex-shrink-0">
        {task.completed
          ? <CheckCircle className="text-green-500" size={20} />
          : <Circle className="text-gray-400 hover:text-gray-900" size={20} />}
      </button>
      <div className="flex-1">
        <p className={task.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
          {task.text}
        </p>
      </div>
      <div className={`px-2 py-1 rounded text-xs border ${getPriorityColor(task.priority)}`}>
        {task.priority === 'high' && 'Quan trọng'}
        {task.priority === 'medium' && 'Trung bình'}
        {task.priority === 'low' && 'Thấp'}
      </div>
    </div>
  );
};
