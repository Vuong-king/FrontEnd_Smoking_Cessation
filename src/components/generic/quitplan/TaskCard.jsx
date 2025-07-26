import { Card, Button, Tag, Typography } from "antd";
import { CheckCircle, Circle, Clock } from "lucide-react";

const { Text } = Typography;

const TaskCard = ({ task, onComplete, loading }) => {
  const isCompleted = task.is_completed;
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (isOverdue) {
      return <Clock className="w-5 h-5 text-red-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isCompleted) return "Hoàn thành";
    if (isOverdue) return "Quá hạn";
    return "Chưa hoàn thành";
  };

  const getStatusColor = () => {
    if (isCompleted) return "green";
    if (isOverdue) return "red";
    return "default";
  };

  return (
    <Card
      className={`mb-4 transition-all duration-300 hover:shadow-md ${
        isCompleted ? "bg-green-50 border-green-200" : "bg-white"
      }`}
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <div className="flex-1">
              <h4 className={`font-medium ${isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}>
                {task.title}
              </h4>
              {task.description && (
                <Text type="secondary" className="text-sm">
                  {task.description}
                </Text>
              )}
            </div>
          </div>
          
          {/* Hiển thị thông tin giới hạn và số lần thử nếu có */}
          {(task.cigarette_limit || task.attempt_number) && (
            <div className="flex gap-2 mt-2">
              {task.cigarette_limit && (
                <Tag color="red" size="small">
                  Giới hạn: {task.cigarette_limit} điếu
                </Tag>
              )}
              {task.attempt_number && (
                <Tag color="blue" size="small">
                  Lần thử thứ {task.attempt_number}
                </Tag>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-4 mt-3">
            <Tag color={getStatusColor()} size="small">
              {getStatusText()}
            </Tag>
            {task.due_date && (
              <Text type="secondary" className="text-xs">
                Hạn: {new Date(task.due_date).toLocaleDateString()}
              </Text>
            )}
            {task.priority && (
              <Tag color={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green"} size="small">
                {task.priority === "high" ? "Cao" : task.priority === "medium" ? "Trung bình" : "Thấp"}
              </Tag>
            )}
          </div>
        </div>
        
        {!isCompleted && (
          <Button
            type="primary"
            size="small"
            onClick={() => onComplete(task._id)}
            loading={loading}
            className="ml-4"
          >
            Hoàn thành
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
