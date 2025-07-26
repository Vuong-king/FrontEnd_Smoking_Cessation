import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { StageEmptyCard, StageErrorCard, StageLoadingSkeleton } from "./StateFallbacks";
import StageOverview from "./StageOverview";
import StageHeader from "./StageHeader";
import StageStats from "./StageStats";
import StageTaskList from "./StageTaskList";
import UserQuitPlanService from "../../../services/userQuitPlanService";
import ProgressService from '../../../services/progressService';

const PlanStageView = (props) => {
  const params = useParams();
  const location = useLocation();
  const quitPlanId = props.quitPlanId || params.id;
  const [stages, setStages] = useState([]);
  const [currentStage, setCurrentStage] = useState(null);
  const [stageTasks, setStageTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stageProgressEntries, setStageProgressEntries] = useState([]);

  // Xác định nguồn truy cập (ví dụ: từ query hoặc props)
  const isFromMyQuitPlan = location.state?.isFromMyQuitPlan || false;

  // Helper xác định current stage
  const determineCurrentStage = (stages) => {
    if (!stages || stages.length === 0) return null;
    let currentStage = stages.find((s) => s.status === "in_progress");
    if (currentStage) return currentStage;
    currentStage = stages.find((s) => s.status !== "completed");
    if (currentStage) return currentStage;
    if (stages.length > 0) return stages[stages.length - 1];
    return stages[0];
  };

  // Hàm fetch lại dữ liệu stage và task
  const fetchData = async () => {
    if (!quitPlanId) return;
    setLoading(true);
    setError(null);
    try {
      const stagesData = await UserQuitPlanService.getMyStages(quitPlanId);
      setStages(stagesData);
      const current = determineCurrentStage(stagesData);
      setCurrentStage(current);
      if (current) {
        const tasks = await UserQuitPlanService.getTasksWithCompletion(current._id);
        setStageTasks(tasks);
        // Fetch progress entries for this stage
        try {
          const entries = await ProgressService.getSingleStageProgressAPI(current._id);
          setStageProgressEntries(Array.isArray(entries) ? entries : []);
        } catch (e) {
          setStageProgressEntries([]);
          console.error("Error fetching stage progress entries:", e);
        }
      } else {
        setStageTasks([]);
        setStageProgressEntries([]);
      }
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [quitPlanId]);

  if (loading) return <StageLoadingSkeleton text="Đang tải thông tin giai đoạn..." />;
  if (error) return <StageErrorCard message="Lỗi tải dữ liệu" description={error} />;
  if (!currentStage)
    return (
      <StageEmptyCard
        title="Chưa có giai đoạn nào được thiết lập"
        desc="Huấn luyện viên sẽ sớm thiết lập lộ trình cai thuốc."
      />
    );

  // Có thể tái sử dụng các props như UserStageView
  const progress = stageTasks.length ? Math.round((stageTasks.filter(t => t.is_completed).length / stageTasks.length) * 100) : 0;
  const completedCount = stageTasks.filter(t => t.is_completed).length;

  // Thêm logic hoàn thành task
  const handleCompleteTask = async (taskId) => {
    setLoading(true);
    try {
      await UserQuitPlanService.completeTask(taskId);
      // Sau khi hoàn thành, load lại tasks
      if (currentStage) {
        const tasks = await UserQuitPlanService.getTasksWithCompletion(currentStage._id);
        setStageTasks(tasks);
      }
    } catch (err) {
      setError(err.message || "Lỗi khi hoàn thành nhiệm vụ");
    } finally {
      setLoading(false);
    }
  };

  // Thêm logic chuyển giai đoạn chỉ local state
  const handleMoveToNextStage = async () => {
    if (!currentStage || !stages.length) return;

    const currentIndex = stages.findIndex(s => s._id === currentStage._id);
    const nextStage = stages[currentIndex + 1];

    // Cập nhật trạng thái local cho stage hiện tại và stage tiếp theo
    const updatedStages = stages.map((stage, idx) => {
      if (idx === currentIndex) return { ...stage, status: "completed" };
      if (idx === currentIndex + 1) return { ...stage, status: "in_progress" };
      return stage;
    });
    setStages(updatedStages);

    // Chuyển sang stage tiếp theo
    if (nextStage) {
      setCurrentStage({ ...nextStage, status: "in_progress" });
      setLoading(true);
      try {
        const tasks = await UserQuitPlanService.getTasksWithCompletion(nextStage._id);
        setStageTasks(tasks);
      } catch (err) {
        setError(err.message || "Lỗi khi tải nhiệm vụ giai đoạn mới");
        setStageTasks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const totalCigarettesSmoked = stageProgressEntries && Array.isArray(stageProgressEntries) ? stageProgressEntries.reduce((sum, entry) => sum + (entry.cigarettes_smoked || 0), 0) : 0;

  return (
    <div className="bg-white min-h-screen pt-10">
      <div className="max-w-3xl mx-auto mt-0 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <StageOverview myStages={stages} currentStage={currentStage} />
          <StageHeader
            currentStage={currentStage}
            stageTasks={stageTasks}
            progress={progress}
            completedCount={completedCount}
            loading={loading}
            onRefresh={fetchData}
            onMoveToNextStage={handleMoveToNextStage}
            showProgressButton={isFromMyQuitPlan}
          />
          <StageStats
            currentStage={currentStage}
            myStages={stages}
            progress={progress}
            completedCount={completedCount}
            totalTasks={stageTasks.length}
            totalCigarettesSmoked={totalCigarettesSmoked}
          />
          <StageTaskList
            tasks={stageTasks}
            onComplete={handleCompleteTask}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanStageView;