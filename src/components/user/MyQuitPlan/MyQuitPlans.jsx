import React, { useEffect } from "react";
import { Card, Spin, Empty, Button } from "antd";
import { useAuth } from "../../../context/AuthContext";
import useQuitPlanActions from "../../../hook/useQuitPlanActions";
import ColourfulText from "../../ui/ColourfulText";
import { useNavigate } from "react-router-dom";

const MyQuitPlans = () => {
  const { user } = useAuth();
  const { quitPlan, loading, error, fetchQuitPlanByUserId } =
    useQuitPlanActions();
  const navigate = useNavigate();

  // Lấy userId từ nhiều trường khác nhau
  const userId = user?.user_id || user?.id || user?._id || user?.fid;

  // Log user và quitPlan để debug
  console.log('user:', user);
  console.log('quitPlan:', quitPlan);
  console.log('userId:', userId);

  useEffect(() => {
    console.log('useEffect chạy, user:', user);
    if (userId) {
      console.log('Gọi fetchQuitPlanByUserId với:', userId);
      fetchQuitPlanByUserId(userId);
    } else {
      console.log('Không có user id hợp lệ, không gọi API');
    }
  }, [userId, fetchQuitPlanByUserId]);

  // Đảm bảo quitPlan luôn là mảng để render
  const plans = Array.isArray(quitPlan)
    ? quitPlan
    : quitPlan
    ? [quitPlan]
    : [];

  const handleStartPlan = (planId) => {
    navigate(`/stages/${planId}`, { state: { isFromMyQuitPlan: true } });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">
        <ColourfulText text="Kế hoạch cai thuốc của tôi" />
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <Spin tip="Đang tải kế hoạch..." />
        </div>
      ) : error ? (
        <p className="text-red-500">Đã xảy ra lỗi khi tải kế hoạch.</p>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            console.log('plan:', plan);
            console.log('plan.image:', plan.image); // Thêm dòng này để kiểm tra
            return (
              <Card
                key={plan._id}
                title={plan.name}
                bordered
                className="shadow-md"
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleStartPlan(plan._id)}
                    className="w-full"
                  >
                    Bắt đầu
                  </Button>
                ]}
              >
                <p>
                  <strong>Lý do:</strong> {plan.reason || 'Chưa có lý do'}
                </p>
                <p>
                  <strong>Ngày bắt đầu:</strong> {plan.start_date ? new Date(plan.start_date).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                </p>
                <p>
                  <strong>Ngày kết thúc:</strong> {plan.target_quit_date ? new Date(plan.target_quit_date).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {plan.status || 'Chưa có trạng thái'}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty description="Bạn chưa có kế hoạch nào." />
      )}
    </div>
  );
};

export default MyQuitPlans;
