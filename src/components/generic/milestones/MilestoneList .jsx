import { useEffect, useState } from "react";
import { useQuitPlanData } from "../../../hook/useQuitPlanData";
import { MilestoneHeader } from "./MilestoneHeader";
import { CheckCircle } from "lucide-react";

export const MilestoneList = ({ planId }) => {
  const { getStagesByPlanId } = useQuitPlanData();
  const [milestones, setMilestones] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stages = await getStagesByPlanId(planId);
        setMilestones(stages);
      } catch (err) {
        console.error("Lỗi khi lấy stages:", err);
      }
    };

    if (planId) fetchData();
  }, [planId]);

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <MilestoneHeader
          key={milestone._id}
          milestone={{
            ...milestone,
            icon: <CheckCircle />, // Hoặc custom icon dựa trên dữ liệu
          }}
          expanded={expandedId === milestone._id}
          onToggle={() =>
            setExpandedId(expandedId === milestone._id ? null : milestone._id)
          }
        />
      ))}
    </div>
  );
};
