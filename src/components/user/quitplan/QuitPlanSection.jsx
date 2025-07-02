import { Alert, Spin } from "antd";
import { useEffect, useState } from "react";
import ColourfulText from "../../ui/ColourfulText";
import { useQuitPlanData } from "../../../hook/useQuitPlanData";
import QuitPlanCard from "./QuitPlanCard";
import { useAuth } from "../../../context/AuthContext";

function QuitPlanSection() {
  const { getQuitPlanByUserId, loading } = useQuitPlanData();
  const { user } = useAuth();

  const [myPlan, setMyPlan] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchMyPlan = async () => {

      if (user && typeof user.id === 'string' && user.id.trim() !== '') {
        try {

          const plan = await getQuitPlanByUserId(user.id);

          setMyPlan(plan);
        } catch (err) {
          setFetchError(err.message || "Không thể tải kế hoạch cá nhân");
        }
      } 
    };
    fetchMyPlan();
  }, [user?._id, getQuitPlanByUserId]);

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <ColourfulText text="Kế Hoạch Của Bạn" />
          </h2>
          <p className="text-xl text-gray-600">
            Đây là kế hoạch bỏ thuốc được cá nhân hóa của bạn.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : fetchError ? (
          <Alert
            type="error"
            message="Lỗi tải dữ liệu"
            description={fetchError}
            className="mb-8"
          />
        ) : myPlan ? (
          <div className="max-w-md mx-auto">
            <QuitPlanCard
              id={myPlan._id}
              image={myPlan.image || "/placeholder.svg"}
              title={myPlan.name}
              description={
                <>
                  <p className="text-sm text-gray-500 mb-2">{myPlan.reason}</p>
                  <p className="text-xs text-gray-400">
                    Bắt đầu:{" "}
                    {new Date(myPlan.start_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Mục tiêu:{" "}
                    {new Date(myPlan.target_quit_date).toLocaleDateString()}
                  </p>
                </>
              }
              delay={0}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">Chưa có kế hoạch nào.</p>
        )}
      </div>
    </section>
  );
}

export default QuitPlanSection;
