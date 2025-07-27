import React, { useState, useEffect, useMemo, useCallback } from "react";
import ProgressHeader from "./ProgressHeader";
import JournalSection from "./JournalSection";
import { Spin, Alert } from "antd";
import useProgress from "../../../hook/useUserProgress";
import UserQuitPlanService from "../../../services/userQuitPlanService";
import SmokingStatusService from "../../../services/SmokingStatusService";


function ProgressUser() {
  // Initial state
  const [userState, setUserState] = useState({
    userId: null,
    quitPlan: null,
    smokingStatus: null,
    currentStage: null,
    loading: true,
    error: null,
  });

  const [quitDate, setQuitDate] = useState(null);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [pricePerPack, setPricePerPack] = useState(0);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);

  // Get userId from localStorage
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const userId = currentUser?.userId || currentUser?.id || currentUser?._id;

  // Custom hook: Progress logic
  const {
    progress: entries,
    planTotalStats,
    planSmokingStats,
    loading: progressLoading,
    submitting,
    error: progressError,
    createProgressEntry,
    calculateStats,
    clearError,
    fetchPlanTotalStats,
    fetchPlanSmokingStats,
  } = useProgress(userId, userState.currentStage?._id, userState.quitPlan?._id);

  // Fetch user data: quitPlan + smokingStatus + currentStage
  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setUserState((prev) => ({
        ...prev,
        error: "User not found. Please login again.",
        loading: false,
      }));
      return;
    }

    try {
      setUserState((prev) => ({ ...prev, loading: true, error: null }));

      const planData = await UserQuitPlanService.getMyQuitPlan();
      if (!planData)
        return setUserState((prev) => ({
          ...prev,
          error: "No approved quit plan found. Please contact your coach.",
          loading: false,
        }));

      const statusData = await SmokingStatusService.getStatus(userId);
      if (!statusData)
        return setUserState((prev) => ({
          ...prev,
          error: "No smoking status found. Please update your profile.",
          loading: false,
        }));

      const stages = await UserQuitPlanService.getMyStages(planData._id);
      if (!stages.length)
        return setUserState((prev) => ({
          ...prev,
          error: "No stages found in your quit plan.",
          loading: false,
        }));

      const currentStageData =
        stages.find((stage) => !stage.is_completed) || stages.at(-1);

      setUserState({
        userId,
        quitPlan: planData,
        smokingStatus: statusData,
        currentStage: currentStageData,
        loading: false,
        error: null,
      });

      // Set additional state
      setQuitDate(new Date(planData.start_date));
      setCigarettesPerDay(statusData.cigarettes_per_day);
      setPricePerPack(statusData.cost_per_pack);
      setCigarettesPerPack(statusData.cigarettes_per_pack || 20);
    } catch {
      setUserState((prev) => ({
        ...prev,
        error: "Failed to load user data. Please try again.",
        loading: false,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userState.quitPlan?._id) {
      fetchPlanTotalStats(userState.quitPlan._id);
      fetchPlanSmokingStats(userState.quitPlan._id);
    }
  }, [userState.quitPlan?._id, fetchPlanTotalStats, fetchPlanSmokingStats]);

  const stats = useMemo(() => {
    if (!quitDate) return {};
    return calculateStats(
      quitDate,
      cigarettesPerDay,
      pricePerPack,
      cigarettesPerPack
    );
  }, [
    quitDate,
    cigarettesPerDay,
    pricePerPack,
    cigarettesPerPack,
    calculateStats,
  ]);

  const handleSubmit = useCallback(
    async (entry) => {
      if (!userState.currentStage || !userId) return;

      try {
        clearError();
        await createProgressEntry({
          date: entry.date,
          cigarettes_smoked: entry.cigarettes,
          health_status: entry.symptoms || "",
          stage_id: userState.currentStage._id,
          user_id: userId,
          isUpdate: entry.isUpdate,
          entryId: entry.entryId,
        });
      } catch (error) {
        console.error("Progress submission error:", error);
      }
    },
    [userState.currentStage, userId, createProgressEntry, clearError]
  );

  useEffect(() => {
    if (progressError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [progressError, clearError]);

  // Loading
  if (userState.loading) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[50vh]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Error
  if (userState.error) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            {/* Icon Container */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-2xl mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Cần liên kết với huấn luyện viên
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Để theo dõi tiến trình cai thuốc một cách hiệu quả, bạn cần được hỗ trợ bởi một huấn luyện viên chuyên nghiệp. 
                Huấn luyện viên sẽ giúp bạn xây dựng kế hoạch cá nhân và theo dõi quá trình cai thuốc.
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kế hoạch cá nhân</h3>
                  <p className="text-sm text-gray-600">Lộ trình cai thuốc được thiết kế riêng cho bạn</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Hỗ trợ chuyên môn</h3>
                  <p className="text-sm text-gray-600">Được tư vấn bởi huấn luyện viên có kinh nghiệm</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Theo dõi tiến trình</h3>
                  <p className="text-sm text-gray-600">Phân tích chi tiết quá trình cai thuốc</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/user/quitplan'}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Chọn huấn luyện viên ngay
                </button>
                
                <p className="text-sm text-gray-500">
                  Quá trình này chỉ mất vài phút 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Incomplete data
  if (
    !userState.quitPlan ||
    !userState.smokingStatus ||
    !userState.currentStage
  ) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Alert
            message="Dữ liệu chưa đầy đủ"
            description="Vui lòng hoàn thành thiết lập quit plan và thông tin hút thuốc trước khi sử dụng tính năng này."
            type="warning"
            showIcon
            className="mb-4"
          />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProgressHeader
          quitDate={quitDate}
          stats={stats}
          planTotalStats={planTotalStats}
          planSmokingStats={planSmokingStats}
        />

        <JournalSection
          entries={entries}
          currentStage={userState.currentStage}
          planTotalStats={planTotalStats}
          onSubmit={handleSubmit}
          isLoading={progressLoading || submitting}
          smokingStatus={{
            cigarettesPerDay,
            costPerPack: pricePerPack,
            cigarettesPerPack,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressUser;
