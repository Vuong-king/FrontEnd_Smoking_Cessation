import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";
import DetailedCoachInfo from "../../components/user/quitplan/DetailedCoachInfo";
import UserStageView from "../../components/user/quitplan/UserStageView";
import useQuitPlanData from "../../hook/useQuitPlanData";
import UserQuitPlanService from "../../services/userQuitPlanService";
import PlanStageView from "../../components/generic/quitplan/PlanStageView";

function QuitPlanManagePage() {
  const { id } = useParams();
  const { getQuitPlanById } = useQuitPlanData();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const planData = await getQuitPlanById(id);
        setPlan(planData);
        setError(null);
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, getQuitPlanById]);

  if (loading) return <Spin className="block mx-auto mt-20" size="large" />;
  if (error) return <Alert type="error" message={error} className="mt-10" />;
  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="mr-24  max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 text-center justify-center ">
        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <PlanStageView quitPlanId={id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default QuitPlanManagePage; 