import { Typography, Progress, Tag } from "antd";

const { Text } = Typography;

const StatCard = ({ label, value, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-100`}>
    <Text strong className={`text-${color}-800 text-sm`}>{label}</Text>
    <Text className={`text-2xl font-bold text-${color}-700`}>{value}</Text>
  </div>
);

const ProgressCard = ({ percent, completed, total }) => (
  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
    <div className="flex flex-col">
      <div className="flex justify-between mb-2">
        <Text strong className="text-green-800 text-sm">Tiến độ hoàn thành</Text>
        <Text className="text-2xl font-bold text-green-700">{percent}%</Text>
      </div>
      <Progress percent={percent} size="small" showInfo={false} />
      <Text type="secondary" className="text-xs">
        {completed}/{total} nhiệm vụ
      </Text>
    </div>
  </div>
);

const LimitCard = ({ cigaretteLimit, attemptNumber, totalCigarettesSmoked, endDate }) => {
  // Kiểm tra xem đã hết ngày của giai đoạn chưa
  const isStageEndDateReached = () => {
    if (!endDate) return false;
    const now = new Date();
    const end = new Date(endDate);
    return now >= end;
  };

  return (
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex flex-col gap-2">
      <div>
        <span className="text-sm font-medium text-purple-800">Giới hạn thuốc lá:</span>
        {cigaretteLimit ? (
          <Tag color="red" className="font-medium">{cigaretteLimit} điếu</Tag>
        ) : (
          <Tag color="orange">Không giới hạn</Tag>
        )}
      </div>
      <div>
        <span className="text-sm font-medium text-purple-800">Đã hút trong giai đoạn:</span>
        <Tag color="red">{totalCigarettesSmoked || 0} điếu</Tag>
      </div>
      <div>
        <span className="text-sm font-medium text-purple-800">Lần thử thứ:</span>
        <Tag color="blue" className="font-medium">Lần {attemptNumber || 1}</Tag>
      </div>
      {endDate && (
        <div>
          <span className="text-sm font-medium text-purple-800">Ngày kết thúc:</span>
          <Tag color={isStageEndDateReached() ? "green" : "orange"} className="font-medium">
            {new Date(endDate).toLocaleDateString('vi-VN')}
          </Tag>
        </div>
      )}
    </div>
  );
};

const StageStats = ({
  currentStage,
  myStages,
  progress,
  completedCount,
  totalTasks,
  totalCigarettesSmoked
}) => {
  if (!currentStage) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        label={`Giai đoạn hiện tại`}
        value={`1/${myStages?.length || 1}`}
        color="blue"
      />
      <ProgressCard
        percent={progress}
        completed={completedCount}
        total={totalTasks}
      />
      <div>
        <div className="font-bold text-blue-700 mb-2">
          Trạng thái
          <span className="ml-2">
            {currentStage.status === "completed" ? (
              <span className="text-green-600">Hoàn thành</span>
            ) : (
              <span className="text-blue-600">Đang thực hiện</span>
            )}
          </span>
        </div>
        <LimitCard
          cigaretteLimit={currentStage.cigarette_limit}
          attemptNumber={currentStage.attempt_number}
          totalCigarettesSmoked={totalCigarettesSmoked}
          endDate={currentStage.end_date}
        />
      </div>
    </div>
  );
};

export default StageStats;
