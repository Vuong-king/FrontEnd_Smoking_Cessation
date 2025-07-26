import { Alert, Col, Row, Spin, Typography, Tag } from "antd";
import { useEffect } from "react";

import PlanCard from "./PlanCard";
import useQuitPlanData from "../../../hook/useQuitPlanData";
import ColourfulText from "../../ui/ColourfulText";

const { Title, Paragraph } = Typography;

const PlanSection = ({ title, description, children, cigarette_limit, attempt_number }) => {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <Title level={4} className="text-gray-800 mb-2">
          {title}
        </Title>
        {description && (
          <Paragraph className="text-gray-600 mb-3">
            {description}
          </Paragraph>
        )}
        
        {/* Hiển thị thông tin giới hạn và số lần thử nếu có */}
        {(cigarette_limit || attempt_number) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">🎯 Mục tiêu giai đoạn:</span>
                {cigarette_limit ? (
                  <Tag color="red" className="font-medium">
                    Giới hạn {cigarette_limit} điếu thuốc
                  </Tag>
                ) : (
                  <Tag color="green" className="font-medium">
                    Không giới hạn số điếu
                  </Tag>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">🔄 Lần thử:</span>
                <Tag color="blue" className="font-medium">
                  Lần thử thứ {attempt_number || 1}
                </Tag>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              💡 {cigarette_limit ? 
                `Cố gắng giữ số điếu thuốc trong ngày dưới ${cigarette_limit} điếu để đạt mục tiêu giai đoạn này.` : 
                'Giai đoạn này không có giới hạn cụ thể về số điếu thuốc, tập trung vào việc giảm dần thói quen hút thuốc.'
              }
            </div>
          </div>
        )}
      </div>
      {children}
    </section>
  );
};

function QuitPlanSection() {
  const { publicPlans, loading, error, fetchPublicPlans } = useQuitPlanData();

  useEffect(() => {
    fetchPublicPlans();
  }, [fetchPublicPlans]);

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <ColourfulText text="Kế Hoạch" />
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các kế hoạch bỏ thuốc được cá nhân hóa và hỗ trợ chi tiết
            cho bạn.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert
            type="error"
            message="Lỗi tải dữ liệu"
            description={error.message}
            className="mb-8"
          />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {Array.isArray(publicPlans) &&
              publicPlans.map((plan, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={plan._id}>
                  <PlanCard
                    id={plan._id}
                    image={plan.image || "/placeholder.svg"}
                    title={plan.name}
                    description={
                      <>
                        <p className="text-sm text-gray-500 mb-2">
                          {plan.reason}
                        </p>
                        <p className="text-xs text-gray-400">
                          Bắt đầu:{" "}
                          {new Date(plan.start_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Mục tiêu:{" "}
                          {new Date(plan.target_quit_date).toLocaleDateString()}
                        </p>
                      </>
                    }
                    delay={index}
                    cigarette_limit={plan.cigarette_limit}
                    attempt_number={plan.attempt_number}
                  />
                </Col>
              ))}
          </Row>
        )}
      </div>
    </section>
  );
}

export default QuitPlanSection;
