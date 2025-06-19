import { Users } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { TaskStatistics } from './TaskStatistics';

export const MilestoneTasks = ({ milestone, onToggleTask }) => {
  return (
    <div className="border-t border-gray-200 p-6 bg-gray-50">
      <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Users className="text-blue-400" size={20} />
        Danh sách công việc cần làm
      </h4>
      <div className="space-y-3">
        {milestone.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(milestone.id, task.id)}
          />
        ))}
      </div>
      <TaskStatistics tasks={milestone.tasks} />
    </div>
  );
};
