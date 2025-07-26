import { Typography, Progress, Tag } from "antd";

const { Text } = Typography;

const StageOverview = ({ myStages, currentStage }) => {
  const totalStages = myStages.length;
  const currentStageIndex = myStages.findIndex(
    (stage) => stage._id === currentStage._id
  );
  const progress = totalStages > 0 ? ((currentStageIndex + 1) / totalStages) * 100 : 0;

  // Kiểm tra xem đã hết ngày của giai đoạn chưa
  const isStageEndDateReached = () => {
    if (!currentStage?.end_date) return false;
    const today = new Date();
    const endDate = new Date(currentStage.end_date);
    return today >= endDate;
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Text strong className="text-lg text-gray-800">
            Tổng quan lộ trình cai thuốc
          </Text>
          <div className="text-sm text-gray-600 mt-1">
            Giai đoạn {currentStageIndex + 1} / {totalStages}
          </div>
        </div>
        
        {/* Thông tin giới hạn và số lần thử */}
        <div className="flex gap-3">
          <div className="text-center">
            <div className="text-sm text-gray-600">Giới hạn thuốc lá</div>
            {currentStage.cigarette_limit ? (
              <Tag color="red" className="font-medium text-sm">
                {currentStage.cigarette_limit} điếu
              </Tag>
            ) : (
              <Tag color="orange" className="text-sm">Không giới hạn</Tag>
            )}
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Lần thử thứ</div>
            <Tag color="blue" className="font-medium text-sm">
              Lần {currentStage.attempt_number || 1}
            </Tag>
          </div>
          {currentStage.end_date && (
            <div className="text-center">
              <div className="text-sm text-gray-600">Ngày kết thúc</div>
              <Tag color={isStageEndDateReached() ? "green" : "orange"} className="font-medium text-sm">
                {new Date(currentStage.end_date).toLocaleDateString('vi-VN')}
              </Tag>
            </div>
          )}
        </div>
      </div>
      
      <Progress
        percent={progress}
        size="small"
        showInfo={false}
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068",
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Bắt đầu</span>
        <span>Hoàn thành</span>
      </div>
    </div>
  );
};

export default StageOverview;
