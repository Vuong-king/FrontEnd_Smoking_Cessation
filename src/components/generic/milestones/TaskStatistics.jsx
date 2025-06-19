export const TaskStatistics = ({ tasks }) => {
  return (
    <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
      <span>
        Hoàn thành: {tasks.filter(t => t.completed).length}/{tasks.length} công việc
      </span>
      <div className="flex gap-4">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          Quan trọng: {tasks.filter(t => t.priority === 'high').length}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          Trung bình: {tasks.filter(t => t.priority === 'medium').length}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Thấp: {tasks.filter(t => t.priority === 'low').length}
        </span>
      </div>
    </div>
  );
};
