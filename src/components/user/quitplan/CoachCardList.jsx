
import CoachSelectionView from "./CoachSelectionView";
import PendingRequestView from "./PendingRequestView";
import QuitPlanView from "./QuitPlanView";
import { useCoachSelection } from "../../../hook/useCoachSelection";
import { useUserSubscription } from "../../../hook/useUserSubscription";
import { FullPageErrorCard, FullPageLoadingSkeleton } from "../../common/QuitPlanComponents";
import SubscriptionUpgradeCard from "../../common/SubscriptionUpgradeCard";
import { Alert, Button, Card } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";

// Component hiển thị khi user đã có quit plan nhưng chưa có coach
const NoCoachSelectedView = ({ coaches, onSelectCoach, selectedCoach, onSubmit, onCancel }) => {
  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
      <CoachSelectionView
        coaches={coaches}
        selectedCoach={selectedCoach}
        onSelectCoach={onSelectCoach}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

// Component hiển thị khi user đã có quit plan và coach nhưng chưa có stages
const WaitingForStagesView = ({ userQuitPlan, onRefresh, isRefreshing }) => {
  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <Alert
          message="Đang chờ huấn luyện viên thiết lập kế hoạch"
          description="Huấn luyện viên của bạn đang thiết lập lộ trình cai thuốc cá nhân. Vui lòng chờ đợi trong khi chúng tôi chuẩn bị kế hoạch phù hợp với bạn."
          type="info"
          showIcon
          icon={<ClockCircleOutlined />}
        />
      </div>

      <Card className="border border-slate-200 rounded-2xl shadow-sm">
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
              <ClockCircleOutlined className="text-4xl text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Đang chuẩn bị kế hoạch cai thuốc
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Huấn luyện viên <strong>{userQuitPlan?.coach_id?.name || "của bạn"}</strong> đang thiết lập lộ trình cai thuốc cá nhân dựa trên thông tin bạn đã cung cấp.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <p className="text-blue-800 text-sm">
              💡 <strong>Lời khuyên:</strong> Trong khi chờ đợi, bạn có thể:
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Đọc các bài viết về cai thuốc</li>
              <li>• Theo dõi tình trạng hút thuốc hiện tại</li>
              <li>• Xem các thành tựu có thể đạt được</li>
            </ul>
          </div>

          <Button 
            type="primary" 
            size="large"
            onClick={onRefresh}
            loading={isRefreshing}
            icon={<ClockCircleOutlined />}
          >
            Kiểm tra cập nhật
          </Button>
        </div>
      </Card>
    </div>
  );
};

const CoachCardList = () => {
  const {
    selectedCoach,
    coaches,
    userQuitPlan,
    pendingRequest,
    quitPlanWithoutCoach,
    loading,
    error,
    isRefreshing,
    setSelectedCoach,
    handleSubmit,
    refreshData,
  } = useCoachSelection();

  // Kiểm tra gói thành viên
  const {
    loading: subscriptionLoading,
    error: subscriptionError,
    canAccessCoach,
    isFreeUser,
  } = useUserSubscription();

  // Loading state - ưu tiên loading subscription trước
  if (subscriptionLoading || loading) {
    return <FullPageLoadingSkeleton text="Đang kiểm tra gói thành viên..." />;
  }

  // Error state
  if (error && !subscriptionError) {
    return <FullPageErrorCard message="Lỗi tải dữ liệu" description={error} />;
  }

  // Kiểm tra quyền truy cập coach
  if (!canAccessCoach()) {
    const isUserFree = isFreeUser();

    return (
      <SubscriptionUpgradeCard
        title={
          isUserFree
            ? "Mua gói Plus/Premium để chọn huấn luyện viên"
            : "Cần nâng cấp gói để chọn huấn luyện viên"
        }
        description={
          isUserFree
            ? "Bạn chưa có gói đăng ký nào. Mua gói Plus hoặc Premium để được hỗ trợ bởi huấn luyện viên chuyên nghiệp!"
            : "Tính năng huấn luyện viên cá nhân chỉ dành cho thành viên Plus và Premium. Nâng cấp ngay để nhận được sự hỗ trợ chuyên nghiệp!"
        }
      />
    );
  }

  // Show pending request view if user has pending request
  if (pendingRequest?._id) {
    console.log('CoachCardList: Render PendingRequestView', pendingRequest);
    return (
      <PendingRequestView
        pendingRequest={pendingRequest}
        onRefresh={refreshData}
        isRefreshing={isRefreshing}
      />
    );
  }

  // Show quit plan view if user has approved plan with coach and stages
  if (userQuitPlan?._id && userQuitPlan?.coach_id) {
    console.log('CoachCardList: Render QuitPlanView', userQuitPlan);
    return <QuitPlanView userQuitPlan={userQuitPlan} />;
  }

  // Show waiting for stages view if user has quit plan and coach but no stages
  // This case should be handled by the hook, but we'll add it as a fallback
  if (quitPlanWithoutCoach?._id && quitPlanWithoutCoach?.coach_id) {
    console.log('CoachCardList: Render WaitingForStagesView', quitPlanWithoutCoach);
    return (
      <WaitingForStagesView
        userQuitPlan={quitPlanWithoutCoach}
        onRefresh={refreshData}
        isRefreshing={isRefreshing}
      />
    );
  }

  // Show no coach selected view if user has quit plan but no coach
  if (quitPlanWithoutCoach?._id) {
    console.log('CoachCardList: Render NoCoachSelectedView', quitPlanWithoutCoach);
    return (
      <NoCoachSelectedView
        coaches={coaches}
        selectedCoach={selectedCoach}
        onSelectCoach={setSelectedCoach}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedCoach(null)}
      />
    );
  }

  // Show coach selection view for all other cases
  console.log('CoachCardList: Render CoachSelectionView', coaches);
  return (
    <CoachSelectionView
      coaches={coaches}
      selectedCoach={selectedCoach}
      onSelectCoach={setSelectedCoach}
      onSubmit={handleSubmit}
      onCancel={() => setSelectedCoach(null)}
    />
  );
};

export default CoachCardList;
