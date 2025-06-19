import { useState } from "react";
import { MilestoneCard } from "../../components/generic/milestones/MilestoneCard";
import { MotivationBox } from "../../components/generic/milestones/MotivationBox";

const milestones = [
  {
    id: 1,
    title: "Ngày đầu tiên",
    timeframe: "24 giờ đầu",
    description: "Bước đầu quan trọng nhất trong hành trình cai nghiện",
    icon: "🎯",
    color: "bg-red-500",
    status: "completed",
    tasks: [
      { id: 1, text: "Vứt bỏ tất cả thuốc lá và đồ hút thuốc", completed: true, priority: "high" },
      { id: 2, text: "Thông báo với gia đình và bạn bè về quyết định cai thuốc", completed: true, priority: "high" },
      { id: 3, text: "Tải app theo dõi cai thuốc lá", completed: true, priority: "medium" },
      { id: 4, text: "Chuẩn bị đồ ăn nhẹ và nước uống", completed: false, priority: "medium" },
      { id: 5, text: "Lên kế hoạch hoạt động thay thế khi thèm thuốc", completed: false, priority: "high" }
    ]
  },
  {
    id: 2,
    title: "Tuần đầu tiên",
    timeframe: "7 ngày",
    description: "Vượt qua giai đoạn cai nghiện cấp tính",
    icon: "🌱",
    color: "bg-orange-500",
    status: "active",
    tasks: [
      { id: 1, text: "Uống nhiều nước để thanh lọc cơ thể", completed: true, priority: "high" },
      { id: 2, text: "Tập thể dục nhẹ 30 phút mỗi ngày", completed: false, priority: "medium" },
      { id: 3, text: "Tránh xa những nơi có người hút thuốc", completed: true, priority: "high" },
      { id: 4, text: "Thực hành kỹ thuật thở sâu khi thèm thuốc", completed: false, priority: "high" },
      { id: 5, text: "Ghi nhật ký cảm xúc hàng ngày", completed: false, priority: "medium" },
      { id: 6, text: "Tham gia nhóm hỗ trợ online", completed: false, priority: "medium" }
    ]
  },

];

const StagesPage = () => {
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const toggleMilestone = (milestoneId) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const toggleTask = (milestoneId, taskId) => {
    console.log(`Toggle task ${taskId} in milestone ${milestoneId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hành Trình Cai Nghiện Thuốc Lá</h1>
          <p className="text-gray-600 text-lg">Theo dõi tiến độ qua từng mốc quan trọng</p>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              expanded={expandedMilestone === milestone.id}
              onToggleMilestone={toggleMilestone}
              onToggleTask={toggleTask}
            />
          ))}
        </div>

        <MotivationBox />
      </div>
    </div>
  );
};

export default StagesPage;
