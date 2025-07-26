import { Typography, Empty } from "antd";
import TaskCard from "./TaskCard";

const { Title } = Typography;

const StageTaskList = ({ tasks, onComplete, loading }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Empty
          description="Chưa có nhiệm vụ nào được thiết lập cho giai đoạn này"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="text-gray-800">
          Danh sách nhiệm vụ ({tasks.length})
        </Title>
        <div className="text-sm text-gray-500">
          {tasks.filter(t => t.is_completed).length}/{tasks.length} hoàn thành
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onComplete={onComplete}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default StageTaskList;
