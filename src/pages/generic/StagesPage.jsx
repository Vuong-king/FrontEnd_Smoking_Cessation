import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MilestoneCard } from "../../components/generic/milestones/MilestoneCard";
import { MotivationBox } from "../../components/generic/milestones/MotivationBox";
import { useQuitPlanData } from "../../hook/useQuitPlanData";



const StagesPage = () => {
  const { id: planId } = useParams(); 
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [milestoneError, setMilestoneError] = useState(null);

  const { getStagesByPlanId } = useQuitPlanData();

  useEffect(() => {
    const fetchMilestones = async () => {
      setLoadingMilestones(true);
      try {
        const data = await getStagesByPlanId(planId);
        setMilestones(data);
      } catch (err) {
        setMilestoneError(err.message || "Không thể tải các cột mốc");
      } finally {
        setLoadingMilestones(false);
      }
    };

    if (planId) {
      fetchMilestones();
    }
  }, [planId]);

  const toggleMilestone = (milestoneId) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hành Trình Cai Nghiện Thuốc Lá</h1>
          <p className="text-gray-600 text-lg">Theo dõi tiến độ qua từng mốc quan trọng</p>
        </div>

        {loadingMilestones && <p>Đang tải...</p>}
        {milestoneError && <p className="text-red-500">Lỗi: {milestoneError}</p>}

        <div className="space-y-4">
          {milestones.map((milestone) => (
            <MilestoneCard
              key={milestone._id || milestone.id}
              milestone={milestone}
              expanded={expandedMilestone === (milestone._id || milestone.id)}
              onToggleMilestone={toggleMilestone}
            />
          ))}
        </div>

        <MotivationBox />
      </div>
    </div>
  );
};

export default StagesPage;
