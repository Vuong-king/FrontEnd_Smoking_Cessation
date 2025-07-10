import React, { useCallback, useEffect } from "react";
import { message } from "antd";

import StageOverview from "./StageOverview";
import StageHeader from "./StageHeader";
import StageStats from "./StageStats";
import StageTaskList from "./StageTaskList";

import { useUserQuitPlan } from "../../../hook/useUserQuitPlan";
import { StageEmptyCard, StageErrorCard, StageLoadingSkeleton } from "./StateFallbacks.jsx";

const UserStageView = () => {
  const {
    currentStage,
    myStages,
    stageTasks,
    loading,
    error,
    progress,
    completedCount,
    completeTask,
    moveToNextStage,
    refetch,
  } = useUserQuitPlan();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCompleteTask = useCallback(async (taskId) => {
    const result = await completeTask(taskId);
    if (result.success) {
      if (result.allStagesCompleted) {
        message.success(result.message, 5);
      } else if (result.stageCompleted && result.hasNextStage) {
        message.success(
          "🎉 Chúc mừng! Bạn đã hoàn thành giai đoạn này. Nhấn nút 'Chuyển giai đoạn tiếp theo' để tiếp tục!",
          6
        );
      } else {
        message.success("Hoàn thành nhiệm vụ thành công!");
      }
    } else {
      message.error(result.error || "Không thể hoàn thành nhiệm vụ.");
    }
  }, [completeTask]);

  const handleRefresh = useCallback(() => {
    message.loading("Đang tải lại dữ liệu...", 1);
    refetch();
  }, [refetch]);

  const handleMoveToNextStage = useCallback(async () => {
    const result = await moveToNextStage();
    if (result.success) {
      message.success(result.message, 3);
    } else {
      message.error(result.error || "Không thể chuyển giai đoạn.");
    }
  }, [moveToNextStage]);

  if (loading)
    return <StageLoadingSkeleton text="Đang tải thông tin giai đoạn..." />;
  if (error)
    return <StageErrorCard message="Lỗi tải dữ liệu" description={error} />;
  if (!currentStage)
    return (
      <StageEmptyCard
        title="Chưa có giai đoạn nào được thiết lập"
        desc="Huấn luyện viên sẽ sớm thiết lập lộ trình cai thuốc."
      />
    );

  return (
    <div>
      <StageOverview myStages={myStages} currentStage={currentStage} />
      <StageHeader
        currentStage={currentStage}
        stageTasks={stageTasks}
        progress={progress}
        completedCount={completedCount}
        loading={loading}
        onRefresh={handleRefresh}
        onMoveToNextStage={handleMoveToNextStage}
      />
      <StageStats
        currentStage={currentStage}
        myStages={myStages}
        progress={progress}
        completedCount={completedCount}
        totalTasks={stageTasks.length}
      />
      <StageTaskList
        tasks={stageTasks}
        progress={progress}
        onComplete={handleCompleteTask}
      />
    </div>
  );
};

export default UserStageView;
