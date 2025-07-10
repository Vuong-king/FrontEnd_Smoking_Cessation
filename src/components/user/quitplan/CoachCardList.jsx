import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card, Typography, Alert, Button, message, Spin } from "antd";
import QuitPlanModal from "./QuitPlanModal";

import CoachCard from "./CoachCard";
import CoachInfo from "./CoachInfo";
import DetailedCoachInfo from "./DetailedCoachInfo";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAuth } from "../../../context/AuthContext";
import { useCoachData } from "../../../hook/useCoachData";
import useQuitPlanData from "../../../hook/useQuitPlanData";
import UserStageView from "./UserStageView";

const { Title, Text } = Typography;

const CoachCardList = () => {
  const { user } = useAuth();
  const { getAllCoaches } = useCoachData();
  const { getQuitPlanByUserId, sendQuitPlanRequest, getMyQuitPlanRequests } =
    useQuitPlanData();

  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [userQuitPlan, setUserQuitPlan] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = useMemo(() => user?.userId || user?.id || user?._id, [user]);

  const serviceRef = useRef({
    getAllCoaches,
    getQuitPlanByUserId,
    getMyQuitPlanRequests,
  });

  serviceRef.current = { getAllCoaches, getQuitPlanByUserId, getMyQuitPlanRequests };

  const refreshData = useCallback(async () => {
    if (!userId || isRefreshing) return;

    setIsRefreshing(true);
    setLoading(true);
    try {
      const [coachList, quitPlans, requests] = await Promise.all([
        serviceRef.current.getAllCoaches(),
        serviceRef.current.getQuitPlanByUserId(userId),
        serviceRef.current.getMyQuitPlanRequests(),
      ]);

      setCoaches(coachList || []);
      let approvedPlan = Array.isArray(quitPlans)
        ? quitPlans.find((p) => p.status === "approved" || p.coach_id)
        : quitPlans?.status === "approved" || quitPlans?.coach_id
        ? quitPlans
        : null;

      setUserQuitPlan(approvedPlan);

      const pendingReq = Array.isArray(requests)
        ? requests.find((r) => ["pending", "created", "approved"].includes(r.status))
        : requests?.status && ["pending", "created", "approved"].includes(requests.status)
        ? requests
        : null;

      setPendingRequest(pendingReq);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, isRefreshing]);

  useEffect(() => {
    if (!userId) return setLoading(false);
    refreshData();
  }, [userId]);

  const handleSubmit = async (formData) => {
    const coachId =
      selectedCoach?.coach_id?._id || selectedCoach?.coach_id || selectedCoach?._id;
    if (!coachId) return message.error("Không xác định được coach!");

    try {
      await sendQuitPlanRequest({ coach_id: coachId, ...formData });
      message.success("Gửi yêu cầu thành công!");
      setSelectedCoach(null);
      await refreshData();
    } catch (err) {
      message.error("Thất bại: " + (err?.message || ""));
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 shadow-lg rounded-lg max-w-4xl">
          <Alert
            type="error"
            message="Không thể tải dữ liệu"
            description={error}
            showIcon
          />
          <div className="mt-4 text-center">
            <Button onClick={refreshData} type="primary">Thử lại</Button>
          </div>
        </Card>
      </div>
    );

  if (userQuitPlan?._id) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg rounded-lg">
              <DetailedCoachInfo coach={userQuitPlan.coach_id} plan={userQuitPlan} />
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="shadow-lg rounded-lg">
              <Title level={3}>Giai Đoạn Hiện Tại & Nhiệm Vụ</Title>
              <UserStageView quitPlan={userQuitPlan} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (pendingRequest?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 shadow-lg rounded-lg max-w-4xl w-full">
          <Title level={2}>Yêu Cầu Đã Được Gửi</Title>
          <Text>Vui lòng chờ huấn luyện viên xác nhận yêu cầu của bạn.</Text>
          <div className="mt-6">
            <Button onClick={refreshData} loading={isRefreshing}>
              🔄 Kiểm tra cập nhật
            </Button>
          </div>
          {pendingRequest.coach_id && (
            <div className="mt-6">
              <CoachInfo coach={pendingRequest.coach_id} />
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 shadow-lg rounded-lg max-w-6xl w-full">
        <Title level={2} className="text-center">Chọn Huấn Luyện Viên</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {coaches.length ? (
            coaches.map((coach) => (
              <CoachCard
                key={coach._id}
                coach={coach}
                onSelectCoach={setSelectedCoach}
              />
            ))
          ) : (
            <Text className="col-span-full text-center">Không có huấn luyện viên</Text>
          )}
        </div>

        <QuitPlanModal
          visible={!!selectedCoach}
          onCancel={() => setSelectedCoach(null)}
          onSubmit={handleSubmit}
          coach={selectedCoach}
        />
      </Card>
    </div>
  );
};

export default CoachCardList;
